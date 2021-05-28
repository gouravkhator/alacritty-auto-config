#!/usr/bin/env node
import path from 'path';
import { URL } from 'url';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import os from 'os';
import fs from 'fs';
import YAML from 'yamljs';
import { execSync } from 'child_process';

const hex_color_regex = /^0x([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/;
const hash_color_regex = /^#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/;
// ! ISSUE: If the color code is 0x0.. then it gives error in yargs format
// ! ISSUE: If color code is 0x000 then error is raised and program terminates unexpectedly.
// ! ISSUE: If wrong params like -z or -f etc. are given, then give error
function capitaliseString(str) {
    if (!!str) {
        return str[0].toUpperCase() + str.substring(1).toLowerCase();
    }
    else {
        return undefined;
    }
}
/**
 * Converts short color codes in 3 letter format to long color codes in 6 letter format.
 *
 * @param color_code Color code in # or 0x format, without prefix. Ex:- for color '#fff', color_code will be passed as 'fff'
 * @returns Color code which is expanded to 6 digits, if it was initially 3 digits long
 */
function convertShortToLongCode(color_code) {
    color_code = color_code.trim();
    const color_code_regex = /^([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/;
    // if the color code is not 3 or 6 letters long, or if it has other characters than specified in regex, then throw error
    if (!color_code_regex.test(color_code)) {
        throw new Error("Color code, provided in params, is neither in 3 letter format nor in 6 letter format..");
    }
    // if the hex code is 3 letters long, then duplicate each letter to make 6 letters long hex color code
    if (color_code.length === 3) {
        let temp_str = "";
        for (let i = 0; i <= 2; i++) {
            temp_str += color_code.charAt(i) + color_code.charAt(i);
        }
        return temp_str;
    }
    return color_code; // color_code is 6 letters long, as all checks were done above
}
/**
 * Converts color code into # format in string like '#f12ef3'
 *
 * @param color_code Color code with prefix as # or 0x in string format (Eg: '#fff' or '0xfff').
 *
 * Or, in number (hexadecimal) format (Eg: 0xf12).
 *
 * 3 or 6 letters color codes are accepted.
 * @returns 6 letter Color code with prefix as # in string format.
 * @returns undefined, if the provided color code is empty or undefined
 * @throwsError if Color code is not provided in correct format
 */
function convertToHash(color_code) {
    // color code is normally provided in string, but if the hexadecimal is provided then its inputted as decimal number.
    if (typeof (color_code) === 'string') {
        if (!color_code || (color_code && color_code.trim() === "")) {
            return undefined;
        }
        color_code = color_code.trim();
        if (hex_color_regex.test(color_code)) {
            // color_code was in hex(0x) and convert that to hash(#)
            return '#' + convertShortToLongCode(color_code.substring(2));
        }
        else if (hash_color_regex.test(color_code)) {
            // color_code was in hash(#) but can be in short (3 letter format), so convert that to long format
            return '#' + convertShortToLongCode(color_code.substring(1));
        }
        else {
            // neither in hash format nor in hex format
            throw new Error('Color code is not provided in hex(0x) or hash(#) format..');
        }
    }
    else if (typeof (color_code) === "number") {
        // color_code will be decimal format of hexadecimal number(which is also in 0x format but not a string)
        // if color code inputted was 0x1f2, then its decimal was saved in color_code variable, and toString(16) will get back the '1f2' part as string in temp_str
        let temp_str = color_code.toString(16);
        return "#" + convertShortToLongCode(temp_str);
    }
}
/**
 * Converts color code into 0x format in string like '0xf12ef3'
 *
 * @param color_code Color code with prefix as # or 0x in string format (Eg: '#fff' or '0xfff')
 *
 * Or, in number (hexadecimal) format (Eg: 0xf12).
 *
 * 3 or 6 letters color codes are accepted.
 * @returns 6 letter Color code with prefix as 0x in string format.
 * @returns undefined, if the provided color code is empty or undefined
 * @throwsError if Color code is not provided in correct format
 */
function convertToHex(color_code) {
    // color code is normally provided in string, but if the hexadecimal is provided then its inputted as decimal number.
    if (typeof (color_code) === 'string') {
        if (!color_code || (color_code && color_code.trim() === "")) {
            return undefined;
        }
        color_code = color_code.trim();
        if (hash_color_regex.test(color_code)) {
            // color_code was in hash(#) and convert that to hex(0x)
            return '0x' + convertShortToLongCode(color_code.substring(1));
        }
        else if (hex_color_regex.test(color_code)) {
            // color_code was in hex(0x)
            return '0x' + convertShortToLongCode(color_code.substring(2));
        }
        else {
            // neither in hash format nor in hex format
            throw new Error('Color code is not provided in hex(0x) or hash(#) format..');
        }
    }
    else if (typeof (color_code) === "number") {
        // color_code will be decimal format of hexadecimal number(which is also in 0x format but not a string)
        let temp_str = color_code.toString(16);
        return "0x" + convertShortToLongCode(temp_str);
    }
}
/**
 * Takes argument inputs for the alacritty configuration.
 *
 * @param alacritty_old_config Alacritty old config object with params (if it exists)
 * @returns Argument Inputs object with all properties taken as input from the user
 */
function takeArgumentInputs(alacritty_old_config = {}) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
    // for referring to options' longnames
    const arg_keys = {
        s: 'fontsize',
        b: 'bgcolor',
        c: 'fgcolor',
        t: 'selcolor',
        y: 'cursor',
        o: 'opacity', // background opacity
    };
    // provide optional default values (for fields you want to provide)
    const default_values = {
        s: 16,
        b: '#111122',
        c: '#ccccff',
        t: '#111122',
        y: "Block",
        o: 1.0,
    };
    return yargs(hideBin(process.argv))
        .usage('Usage: node dist/$0 [options]=[values]\n\nThe options may/may not provided in the CLI. If they are not provided, either the previously set config is used or the defaults are set.')
        // .demandOption(['s', 'b', 'c']) // to set them required, but as I am setting defaults so its optional
        // options
        .help('h')
        .version("1.1.1") // the version is replaced in rollup build process
        // aliases
        .alias('s', arg_keys.s)
        .alias('b', arg_keys.b)
        .alias('c', arg_keys.c)
        .alias('t', arg_keys.t)
        .alias('y', arg_keys.y)
        .alias('o', arg_keys.o)
        .alias('h', 'help')
        .alias('v', 'version')
        // defaults to alacritty old config if that exists or our own default
        .default(arg_keys.s, (_b = (_a = alacritty_old_config === null || alacritty_old_config === void 0 ? void 0 : alacritty_old_config.font) === null || _a === void 0 ? void 0 : _a.size) !== null && _b !== void 0 ? _b : default_values.s)
        .default(arg_keys.b, (_e = (_d = (_c = alacritty_old_config === null || alacritty_old_config === void 0 ? void 0 : alacritty_old_config.colors) === null || _c === void 0 ? void 0 : _c.primary) === null || _d === void 0 ? void 0 : _d.background) !== null && _e !== void 0 ? _e : default_values.b)
        .default(arg_keys.c, (_h = (_g = (_f = alacritty_old_config === null || alacritty_old_config === void 0 ? void 0 : alacritty_old_config.colors) === null || _f === void 0 ? void 0 : _f.primary) === null || _g === void 0 ? void 0 : _g.foreground) !== null && _h !== void 0 ? _h : default_values.c)
        .default(arg_keys.t, (_l = (_k = (_j = alacritty_old_config === null || alacritty_old_config === void 0 ? void 0 : alacritty_old_config.colors) === null || _j === void 0 ? void 0 : _j.selection) === null || _k === void 0 ? void 0 : _k.text) !== null && _l !== void 0 ? _l : default_values.t)
        .default(arg_keys.y, (_o = (_m = alacritty_old_config === null || alacritty_old_config === void 0 ? void 0 : alacritty_old_config.cursor) === null || _m === void 0 ? void 0 : _m.style) !== null && _o !== void 0 ? _o : default_values.y)
        .default(arg_keys.o, (_p = alacritty_old_config === null || alacritty_old_config === void 0 ? void 0 : alacritty_old_config.background_opacity) !== null && _p !== void 0 ? _p : default_values.o)
        // number of arguments
        .nargs({
        [arg_keys.s]: 1,
        [arg_keys.b]: 1,
        [arg_keys.c]: 1,
        [arg_keys.t]: 1,
        [arg_keys.y]: 1,
        [arg_keys.o]: 1,
    })
        // description of options
        .describe(arg_keys.s, `Takes font size to be set in alacritty\t[default=${default_values.s}]`)
        .describe(arg_keys.b, `Takes primary background color in #ffffff or #fff or 0xfff or 0xffffff format\t[default=${default_values.b}]`)
        .describe(arg_keys.c, `Takes primary foreground color in #ffffff or #fff or 0xfff or 0xffffff format\t[default=${default_values.c}]`)
        .describe(arg_keys.t, `Takes text color (when the area is selected) in #ffffff or #fff or 0xfff or 0xffffff format\t[default=${default_values.t}]`)
        .describe(arg_keys.y, `Takes cursor style that can be Block or Underline or Beam\t[default=${default_values.y}]`)
        .describe(arg_keys.o, `Takes background opacity which is between 0.0 (transparent) and 1.0 (opaque)\t[default=${default_values.o}]`)
        // conditional checks
        .check((argv) => {
        if (argv.s && (argv.s <= 0.0 || argv.s > 40.0)) {
            throw new Error(`Wrong Arguments: Provided font size ${argv.s} should be within the range of display: 0.1 to 40.0`);
        }
        /* If the color is provided as 0x111 then its actually taken as hexadecimal number, so its typeof will be "number".

        But here, as b is a string in typescript. So the check of whether its a number input or not will never be possible. It will not be compiled.

        Same is the case with other colors.
        */
        if (argv.b && convertToHex(argv.b) === undefined) {
            throw new Error(`Wrong Arguments: Provided background color ${argv.b} should be in hash or hex format`);
        }
        if (argv.c && convertToHex(argv.c) === undefined) {
            throw new Error(`Wrong Arguments: Provided font color ${argv.c} should be in hash or hex format`);
        }
        if (argv.t && convertToHex(argv.t) === undefined) {
            throw new Error(`Wrong Arguments: Provided selection text color ${argv.t} should be in hash or hex format`);
        }
        // allowing any case for cursor style (lower, upper or mixed)
        if (argv.y && !["Block", "Underline", "Beam"].includes(capitaliseString("" + argv.y))) {
            throw new Error(`Wrong Arguments: Provided cursor style ${argv.y} should be in one of the 3 styles`);
        }
        if (argv.o && (argv.o < 0.0 || argv.o > 1.0)) {
            throw new Error(`Wrong Arguments: Provided background opacity ${argv.o} should be between 0.0 and 1.0`);
        }
        return true;
    })
        .argv;
}

/**
 * Checks if the alacritty is installed or not.
 *
 * Also checks for os type if its supported or not.
 *
 * If alacritty is installed and this api is supported on the current os, then make directory and file for its config if the folder or file does not exist.
 * @returns Alacritty config path
 */
function configInit() {
    // check for os type
    if (os.type() === 'Windows_NT') {
        // The path for alacritty config is %APPDATA%\alacritty\alacritty.yml
        // TODO: I can code up this if windows users can confirm the working
        throw new Error("Platform win32 not supported by our app");
    }
    // check if alacritty is installed or not
    try {
        execSync('which alacritty');
    }
    catch (err) {
        throw new Error("Package Not Installed: alacritty is not installed in your system or it's path is not set in your PATH variable, so you cannot use our library..");
    }
    const original_config_path = path.join(os.homedir(), '.config/alacritty/alacritty.yml');
    if (!fs.existsSync(original_config_path)) {
        // mkdirectory recursively for original config file if it does not exists
        fs.mkdirSync(path.dirname(original_config_path), { recursive: true });
        fs.writeFileSync(original_config_path, '');
    }
    return original_config_path;
}
/**
 * Reads the original alacritty config from the .yml file and return the config object with the existing properties.
 *
 * Before calling this function, make sure the path exists, with the yml file already created in that path
 *
 * (I suggest to first invoke the configInit function of the api, then this method will work fine)
 * @param original_config_path Absolute Path required to load the original config file of alacritty (Ex- /home/gourav/.config/alacritty/alacritty.yml)
 * @returns The Alacritty Config object which contains the properties and attributes (if there are any)
 */
function readOriginalConfig(original_config_path) {
    try {
        let alacritty_config = YAML.load(original_config_path);
        return alacritty_config;
    }
    catch (err) {
        throw new Error("Cannot load original alacritty config file from the path provided..");
    }
}
/**
 * Writes the config object, to the path passed as parameter.
 *
 * @param alacritty_config_to_write The Alacritty Config Object containing the properties and attributes (if there are any), to write to the original config path
 * @param original_config_path_dir Absolute Path for the original alacritty config directory (Ex- /home/gourav/.config/alacritty/)
 */
function writeToConfigFile(alacritty_config_to_write, original_config_path_dir) {
    // const temp_config_dir = 'user_config_temp';
    const temp_config_dir = path.join(original_config_path_dir, 'user_config_temp');
    const json_file_path = path.resolve(temp_config_dir, 'alacritty.json');
    // mkdir recursively if it does not exists
    fs.mkdirSync(temp_config_dir, { recursive: true });
    // write to json
    fs.writeFileSync(json_file_path, JSON.stringify(alacritty_config_to_write), 'utf8');
    /*
    First, convert json to yaml and then rename that yaml to yml, then cp that yml file to the original config folder and finally remove the temp config folder created. I have written all paths within single quotes as the path can have spaces also.
    */
    const write_command = `npx json2yaml '${json_file_path}' --save -d 8 && mv '${path.resolve(temp_config_dir, 'alacritty.yaml')}' '${path.resolve(temp_config_dir, 'alacritty.yml')}' && cp '${path.resolve(temp_config_dir, 'alacritty.yml')}' '${original_config_path_dir}' && rm -rf ${temp_config_dir}`;
    execSync(write_command);
    console.log('Please close and reopen all windows of alacritty if some effects were not applied..');
}
/**
 * Edits the old config object with the new config parameters, and writes that updated config to the original config path directory as taken in the parameters
 *
 * @param alacritty_old_config Old Alacritty Config Object similar to {font: {size: number}, colors: {primary: {background: '0x333333', foreground: {'0xcccccc'}}}}
 * @param new_config New Config inputs
 * @param original_config_path_dir Path for the Original Alacritty Config directory (Ex- /home/gourav/.config/alacritty/)
 *
 * @returns Updated alacritty config
 */
function editConfig(alacritty_old_config = {}, new_config, original_config_path_dir) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
    // ! ISSUE: primary_bgcolor and fgcolor and all other colors can be hexadecimal number also, so make that type possible
    // if old configs are there, then take that else leave alacritty to its default
    let old_bgcolor = (_c = (_b = (_a = alacritty_old_config === null || alacritty_old_config === void 0 ? void 0 : alacritty_old_config.colors) === null || _a === void 0 ? void 0 : _a.primary) === null || _b === void 0 ? void 0 : _b.background) !== null && _c !== void 0 ? _c : "";
    let old_fgcolor = (_f = (_e = (_d = alacritty_old_config === null || alacritty_old_config === void 0 ? void 0 : alacritty_old_config.colors) === null || _d === void 0 ? void 0 : _d.primary) === null || _e === void 0 ? void 0 : _e.foreground) !== null && _f !== void 0 ? _f : "";
    let old_fontsize = (_h = (_g = alacritty_old_config === null || alacritty_old_config === void 0 ? void 0 : alacritty_old_config.font) === null || _g === void 0 ? void 0 : _g.size) !== null && _h !== void 0 ? _h : undefined;
    let old_selcolor = (_l = (_k = (_j = alacritty_old_config === null || alacritty_old_config === void 0 ? void 0 : alacritty_old_config.colors) === null || _j === void 0 ? void 0 : _j.selection) === null || _k === void 0 ? void 0 : _k.text) !== null && _l !== void 0 ? _l : "";
    let old_cursor_style = (_o = (_m = alacritty_old_config === null || alacritty_old_config === void 0 ? void 0 : alacritty_old_config.cursor) === null || _m === void 0 ? void 0 : _m.style) !== null && _o !== void 0 ? _o : "Block";
    let old_background_opacity = (_p = alacritty_old_config === null || alacritty_old_config === void 0 ? void 0 : alacritty_old_config.background_opacity) !== null && _p !== void 0 ? _p : undefined;
    // take all new config params, and fallback to old config if not provided
    let { primary_bgcolor = old_bgcolor, primary_fgcolor = old_fgcolor, fontsize = old_fontsize, selection_fgcolor = old_selcolor, cursor_style = old_cursor_style, background_opacity = old_background_opacity } = new_config;
    // we will convert every string to hex code starting with 0x (if possible), to save in new config file
    // if the colors are empty or undefined, then return undefined from convertToHex
    // if the colors are not in correct format, throw error
    primary_bgcolor = convertToHex(primary_bgcolor);
    primary_fgcolor = convertToHex(primary_fgcolor);
    selection_fgcolor = convertToHex(selection_fgcolor);
    if (fontsize < 0.1 || fontsize > 40.0) {
        throw new Error("Font size provided is not in the range 0.1 to 40.0");
    }
    // accepts any case (lower, upper, mixed) for Block, Underline, Beam
    if (cursor_style && !(["Block", "Underline", "Beam"].includes(capitaliseString(cursor_style)))) {
        throw new Error("Cursor style provided is not in one of the 3 accepted styles");
    }
    if (background_opacity < 0.0 || background_opacity > 1.0) {
        throw new Error("Background opacity provided is not in the range 0.0 to 1.0");
    }
    // the config file only accepts hex codes starting with 0x
    const alacritty_updated_config = Object.assign(Object.assign({}, alacritty_old_config), { font: {
            size: fontsize,
        }, colors: {
            primary: {
                background: primary_bgcolor,
                foreground: primary_fgcolor,
            },
            selection: {
                text: selection_fgcolor,
            },
        }, cursor: {
            style: cursor_style,
        }, background_opacity: background_opacity });
    writeToConfigFile(alacritty_updated_config, original_config_path_dir); // writing updated config to the original config path directory
    return alacritty_updated_config;
}

var _a;
/**
 * Main Function which is run from the command line
 */
function main() {
    let original_config_path = "";
    try {
        original_config_path = configInit();
        let alacritty_config = readOriginalConfig(original_config_path);
        const original_config_path_dir = path.dirname(original_config_path);
        let argumentInputs = takeArgumentInputs(alacritty_config);
        // if the arguments are not passed, it will take the old config only, and if config does not have that property, it will set defaults for that
        editConfig(alacritty_config, {
            fontsize: parseFloat("" + argumentInputs.s),
            primary_bgcolor: argumentInputs.b,
            primary_fgcolor: argumentInputs.c,
            selection_fgcolor: argumentInputs.t,
            cursor_style: argumentInputs.y,
            background_opacity: parseFloat("" + argumentInputs.o),
        }, original_config_path_dir);
    }
    catch (err) {
        console.error(err);
    }
}
const fileURL = new URL(`file://${process.argv[1]}`);
// converting the path to URL as this will make the valid url out of it, like replace space with %20, or some special characters with some codes
// Only run main() when the file is run from cli
if (((_a = (import.meta)) === null || _a === void 0 ? void 0 : _a.url) === fileURL.toString()) {
    main();
}

export { capitaliseString, configInit, convertShortToLongCode, convertToHash, convertToHex, editConfig, hash_color_regex, hex_color_regex, readOriginalConfig, takeArgumentInputs, writeToConfigFile };
