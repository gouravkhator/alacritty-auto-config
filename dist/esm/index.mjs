#!/usr/bin/env node
import path from 'path';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import fs, { realpathSync } from 'fs';
import { pathToFileURL } from 'url';
import os from 'os';
import YAML from 'yaml';
import { execSync } from 'child_process';

/**
 *
 * @param str String to capitalise
 * @returns Capitalised string
 */
function capitaliseString(str) {
    if (!!str) {
        return str[0].toUpperCase() + str.substring(1).toLowerCase();
    }
    else {
        return undefined;
    }
}
/**
 * Tells if the script is run from the cli or imported as a module..
 * @returns true if the script is run from the CLI, and false otherwise..
 */
function isTheScriptRunFromCLI() {
    /*
      We use realpathSync to resolve symlinks,
      as the cli scripts will often be executed from symlinks in the `node_modules/.bin` folder
      */
    /*
      Why we had process.argv[1]?
      > It is bcoz, even the npm bin commands are resolved to command:
      `node <cjs/esm filename>.<cjs/esm>`.
    
      We want the real file path of the second argument in the resolved command, as mentioned above.
      */
    const realPath = realpathSync(process.argv[1]);
    // Convert the file-path to a file-url before comparing it
    const realPathAsUrl = pathToFileURL(realPath).href;
    /*
      if the script's import url is same as the path where the script is actually stored,
      then it was run from the CLI itself
      */
    return import.meta.url === realPathAsUrl;
}

const hex_color_regex = /^0x([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/;
const hash_color_regex = /^#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/;
// ! ISSUE: If wrong params like -z or -f etc. are given, then give error
/**
 * Converts short color codes in 3 letter format to long color codes in 6 letter format.
 *
 * @param color_code Color code in # or 0x format, without prefix. Ex:- for color '#fff', color_code will be passed as 'fff'
 * @returns Color code which is expanded to 6 digits, if it was initially 3 digits long
 * @throwsError if Color code is not provided in correct format
 */
function convertShortToLongCode(color_code) {
    color_code = color_code.trim();
    const color_code_regex = /^([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/;
    // if the color code is not 3 or 6 letters long, or if it has other characters than specified in regex, then throw error
    if (!color_code_regex.test(color_code)) {
        throw new Error("Color code provided, is neither in 3 letter format nor in 6 letter format..");
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
 * 3 or 6 letters color codes are accepted.
 * @returns 6 letter Color code with prefix as # in string format.
 * @returns undefined, if the provided color code is empty or undefined
 * @throwsError if Color code is not provided in correct format
 */
function convertToHash(color_code) {
    if (!color_code || (color_code && color_code.trim() === "")) {
        return undefined;
    }
    color_code = color_code.trim();
    if (hex_color_regex.test(color_code)) {
        // color_code was in hex(0x) and convert that to hash(#)
        return "#" + convertShortToLongCode(color_code.substring(2));
    }
    else if (hash_color_regex.test(color_code)) {
        // color_code was in hash(#) but can be in short (3 letter format), so convert that to long format
        return "#" + convertShortToLongCode(color_code.substring(1));
    }
    else {
        // neither in hash format nor in hex format
        throw new Error("Color code is not provided in hex(0x) or hash(#) format..");
    }
}
/**
 * Converts color code into 0x format in string like '0xf12ef3'
 *
 * @param color_code Color code with prefix as # or 0x in string format (Eg: '#fff' or '0xfff')
 *
 * 3 or 6 letters color codes are accepted.
 * @returns 6 letter Color code with prefix as 0x in string format.
 * @returns undefined, if the provided color code is empty or undefined
 * @throwsError if Color code is not provided in correct format
 */
function convertToHex(color_code) {
    if (!color_code || (color_code && color_code.trim() === "")) {
        return undefined;
    }
    color_code = color_code.trim();
    if (hash_color_regex.test(color_code)) {
        // color_code was in hash(#) and convert that to hex(0x)
        return "0x" + convertShortToLongCode(color_code.substring(1));
    }
    else if (hex_color_regex.test(color_code)) {
        // color_code was in hex(0x)
        return "0x" + convertShortToLongCode(color_code.substring(2));
    }
    else {
        // neither in hash format nor in hex format
        throw new Error("Color code provided is invalid, as it either contains invalid values or it is not in hex(0x) or hash(#) format..");
    }
}
/**
 * Takes argument inputs for the alacritty configuration.
 *
 * @param alacritty_old_config Alacritty old config object with params (if it exists)
 * @returns Argument Inputs object with all properties taken as input from the user
 */
function takeArgumentInputs(alacritty_old_config = {}) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
    // for referring to options' longnames
    const arg_keys = {
        s: "fontsize",
        b: "bgcolor",
        c: "fgcolor",
        t: "selcolor",
        y: "cursor",
        o: "opacity", // background opacity
    };
    // provide optional default values (for fields you want to provide)
    const default_values = {
        s: 16,
        b: "#111122",
        c: "#ccccff",
        t: "#111122",
        y: "Block",
        o: 1.0,
    };
    return (yargs(hideBin(process.argv))
        .options({
        // adding type to each argument
        s: { type: "number" },
        b: { type: "string" },
        c: { type: "string" },
        t: { type: "string" },
        y: { type: "string" },
        o: { type: "number" },
    })
        .usage("Usage: node <javascript-file-name> [options]=[values],\nif the file you ran is a javascript file..\n\nOr just, <executable-name> [options]=[values]\n\nThe options are not required fields. If you don't provide the options, we either load your previously set alacritty config, or we set our own defaults for those options.")
        /*
        to set the fields required we can use `demandOption`,
        but as I am setting defaults so so those fields are optional for my use case
        */
        // .demandOption(['s', 'b', 'c'])
        // options
        .help("h")
        .version("1.3.3") // the version is replaced in rollup build process
        // aliases
        .alias("s", arg_keys.s)
        .alias("b", arg_keys.b)
        .alias("c", arg_keys.c)
        .alias("t", arg_keys.t)
        .alias("y", arg_keys.y)
        .alias("o", arg_keys.o)
        .alias("h", "help")
        .alias("v", "version")
        // defaults to alacritty old config if that exists or our own default
        .default(arg_keys.s, (_b = (_a = alacritty_old_config === null || alacritty_old_config === void 0 ? void 0 : alacritty_old_config.font) === null || _a === void 0 ? void 0 : _a.size) !== null && _b !== void 0 ? _b : default_values.s)
        .default(arg_keys.b, (_e = (_d = (_c = alacritty_old_config === null || alacritty_old_config === void 0 ? void 0 : alacritty_old_config.colors) === null || _c === void 0 ? void 0 : _c.primary) === null || _d === void 0 ? void 0 : _d.background) !== null && _e !== void 0 ? _e : default_values.b)
        .default(arg_keys.c, (_h = (_g = (_f = alacritty_old_config === null || alacritty_old_config === void 0 ? void 0 : alacritty_old_config.colors) === null || _f === void 0 ? void 0 : _f.primary) === null || _g === void 0 ? void 0 : _g.foreground) !== null && _h !== void 0 ? _h : default_values.c)
        .default(arg_keys.t, (_l = (_k = (_j = alacritty_old_config === null || alacritty_old_config === void 0 ? void 0 : alacritty_old_config.colors) === null || _j === void 0 ? void 0 : _j.selection) === null || _k === void 0 ? void 0 : _k.text) !== null && _l !== void 0 ? _l : default_values.t)
        .default(arg_keys.y, (_o = (_m = alacritty_old_config === null || alacritty_old_config === void 0 ? void 0 : alacritty_old_config.cursor) === null || _m === void 0 ? void 0 : _m.style) !== null && _o !== void 0 ? _o : default_values.y)
        .default(arg_keys.o, (_q = (_p = alacritty_old_config === null || alacritty_old_config === void 0 ? void 0 : alacritty_old_config.window) === null || _p === void 0 ? void 0 : _p.opacity) !== null && _q !== void 0 ? _q : default_values.o)
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
        .describe(arg_keys.s, `Takes font size to be set in alacritty [default=${default_values.s}]`)
        .describe(arg_keys.b, `Takes primary background color in #ffffff or #fff or 0xfff or 0xffffff format [default=${default_values.b}]`)
        .describe(arg_keys.c, `Takes primary foreground color in #ffffff or #fff or 0xfff or 0xffffff format [default=${default_values.c}]`)
        .describe(arg_keys.t, `Takes text color (when the area is selected) in #ffffff or #fff or 0xfff or 0xffffff format [default=${default_values.t}]`)
        .describe(arg_keys.y, `Takes cursor style that can be Block or Underline or Beam [default=${default_values.y}]`)
        .describe(arg_keys.o, `Takes background opacity which is between 0.0 (transparent) and 1.0 (opaque) [default=${default_values.o}]`)
        // conditional checks
        .check((argv) => {
        if (argv.s && (argv.s <= 0.0 || argv.s > 40.0)) {
            throw new Error(`Invalid Arguments: Provided font size \`${argv.s}\` is out of bounds of the display font range: 0.1 to 40.0!!`);
        }
        if (argv.b && convertToHex("" + argv.b) === undefined) {
            throw new Error(`Invalid Arguments: Provided background color \`${argv.b}\` is neither in hash nor in hex format!!`);
        }
        if (argv.c && convertToHex("" + argv.c) === undefined) {
            throw new Error(`Invalid Arguments: Provided font color \`${argv.c}\` is neither in hash nor in hex format!!`);
        }
        if (argv.t && convertToHex("" + argv.t) === undefined) {
            throw new Error(`Invalid Arguments: Provided selection text color \`${argv.t}\` is neither in hash nor in hex format!!`);
        }
        // here, we allow all case for the input of cursor style field (lowercase, uppercase or mixed-case)
        if (argv.y &&
            !["Block", "Underline", "Beam"].includes(capitaliseString("" + argv.y))) {
            throw new Error(`Invalid Arguments: Provided cursor style: \`${argv.y}\` is not one of the allowed cursor styles: { block, underline, beam }`);
        }
        if (argv.o && (argv.o < 0.0 || argv.o > 1.0)) {
            throw new Error(`Invalid Arguments: Provided background opacity \`${argv.o}\` is not in the range from 0.0 to 1.0!!`);
        }
        return true;
    }).argv);
}
/**
 * @deprecated - since version 1.2.0. Use convertToHash function
 *
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
function oldConvertToHash(color_code) {
    // color code is normally provided in string, but if the hexadecimal is provided then its inputted as decimal number.
    if (typeof color_code === "string") {
        if (!color_code || (color_code && color_code.trim() === "")) {
            return undefined;
        }
        color_code = color_code.trim();
        if (hex_color_regex.test(color_code)) {
            // color_code was in hex(0x) and convert that to hash(#)
            return "#" + convertShortToLongCode(color_code.substring(2));
        }
        else if (hash_color_regex.test(color_code)) {
            // color_code was in hash(#) but can be in short (3 letter format), so convert that to long format
            return "#" + convertShortToLongCode(color_code.substring(1));
        }
        else {
            // neither in hash format nor in hex format
            throw new Error("Color code is not provided in hex(0x) or hash(#) format..");
        }
    }
    else if (typeof color_code === "number") {
        // color_code will be decimal format of hexadecimal number(which is also in 0x format but not a string)
        // if color code inputted was 0x1f2, then its decimal was saved in color_code variable, and toString(16) will get back the '1f2' part as string in temp_str
        let temp_str = color_code.toString(16);
        return "#" + convertShortToLongCode(temp_str);
    }
}
/**
 * @deprecated - since version 1.2.0. Use convertToHex function
 *
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
function oldConvertToHex(color_code) {
    // color code is normally provided in string, but if the hexadecimal is provided then its inputted as decimal number.
    if (typeof color_code === "string") {
        if (!color_code || (color_code && color_code.trim() === "")) {
            return undefined;
        }
        color_code = color_code.trim();
        if (hash_color_regex.test(color_code)) {
            // color_code was in hash(#) and convert that to hex(0x)
            return "0x" + convertShortToLongCode(color_code.substring(1));
        }
        else if (hex_color_regex.test(color_code)) {
            // color_code was in hex(0x)
            return "0x" + convertShortToLongCode(color_code.substring(2));
        }
        else {
            // neither in hash format nor in hex format
            throw new Error("Color code is not provided in hex(0x) or hash(#) format..");
        }
    }
    else if (typeof color_code === "number") {
        // color_code will be decimal format of hexadecimal number(which is also in 0x format but not a string)
        let temp_str = color_code.toString(16);
        return "0x" + convertShortToLongCode(temp_str);
    }
}

/**
 * Checks if the alacritty is installed or not.
 *
 * Also checks for os type if its supported or not.
 *
 * If alacritty is installed and this api is supported on the current os, then make directory and file for its config if the folder or file does not exist.
 * @returns Alacritty config path
 * @throwsError when the alacritty program is not found in your path variable or not even installed in your system
 */
function configInit() {
    let alacritty_install_checker_command = "which alacritty";
    let original_config_path = path.join(os.homedir(), ".config/alacritty/alacritty.yml");
    // if os type is windows then change the install checker command and path directory for original config
    if (os.type() === "Windows_NT") {
        // The path for alacritty config is C:\Users\gourav\alacritty\alacritty.yml and homedir is C:\Users\gourav
        alacritty_install_checker_command = "where alacritty";
        original_config_path = path.join(os.homedir(), "AppData", "alacritty.yml");
    }
    // check if alacritty is installed or not
    try {
        execSync(alacritty_install_checker_command);
    }
    catch (err) {
        throw new Error("Package Not Installed: alacritty is not installed in your system or it's path is not set in your PATH or environment variable. \nSo, we are sorry that you cannot use our library. \n\nPlease install alacritty and try again");
    }
    if (!fs.existsSync(original_config_path)) {
        // mkdirectory recursively for original config file if it does not exists
        fs.mkdirSync(path.dirname(original_config_path), { recursive: true });
        fs.writeFileSync(original_config_path, "");
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
 * @throwsError when the filepath cannot be loaded as yml
 */
function readOriginalConfig(original_config_path) {
    let file_content;
    try {
        file_content = fs.readFileSync(original_config_path, "utf8"); // reads file
        let alacritty_config = YAML.parse(file_content); // parses the yaml and converts that to json format
        return alacritty_config;
    }
    catch (err) {
        if (file_content === undefined) {
            // if file does not exist, ..
            throw new Error("Unable to read the newly-created/original alacritty config file from the default config path..\n\nPlease verify the file/folder permissions assigned to the alacritty's default config folder..");
        }
        else {
            throw new Error("Existing alacritty's config file cannot be parsed.\n\nPlease fix this YAML Parse Error and try again:\n" +
                err.message);
        }
    }
}
/**
 * Writes the config object, to the path passed as parameter.
 *
 * @param alacritty_config_to_write The Alacritty Config Object containing the properties and attributes (if there are any), to write to the original config path
 * @param original_config_path_dir Absolute Path for the original alacritty config directory (Ex- /home/gourav/.config/alacritty/)
 * @throwsError when the configurations cannot be written to target config path directory
 */
function writeToConfigFile(alacritty_config_to_write, original_config_path_dir) {
    try {
        const yml_file_path = path.resolve(original_config_path_dir, "alacritty.yml");
        // mkdir recursively if it does not exists
        fs.mkdirSync(path.dirname(yml_file_path), { recursive: true });
        const yml_str = YAML.stringify(alacritty_config_to_write); // takes json and converts to yml format
        fs.writeFileSync(yml_file_path, yml_str, "utf-8"); // write the yml str to the file
        console.log("Your configs will be applied..\nIn case, you did not see the new look in alacritty, we suggest to close and reopen all windows of alacritty");
    }
    catch (err) {
        console.log("Sorry, some error occurred while writing configurations to the alacritty.yml file");
        console.error("Error: " + err.message);
    }
}
/**
 * Edits the old config object with the new config parameters, and writes that updated config to the original config path directory as taken in the parameters
 *
 * @param alacritty_old_config Old Alacritty Config Object similar to {font: {size: number}, colors: {primary: {background: '0x333333', foreground: {'0xcccccc'}}}}
 * @param new_config New Config inputs
 * @param original_config_path_dir Path for the Original Alacritty Config directory (Ex- /home/gourav/.config/alacritty/)
 *
 * @returns Updated alacritty config
 * @throwsError when some configs are in wrong format, or when the configs could not be written to file
 */
function editConfig(alacritty_old_config = {}, new_config, original_config_path_dir) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
    // if old configs are there, then take that else leave alacritty to its default
    let old_bgcolor = (_c = (_b = (_a = alacritty_old_config === null || alacritty_old_config === void 0 ? void 0 : alacritty_old_config.colors) === null || _a === void 0 ? void 0 : _a.primary) === null || _b === void 0 ? void 0 : _b.background) !== null && _c !== void 0 ? _c : "";
    let old_fgcolor = (_f = (_e = (_d = alacritty_old_config === null || alacritty_old_config === void 0 ? void 0 : alacritty_old_config.colors) === null || _d === void 0 ? void 0 : _d.primary) === null || _e === void 0 ? void 0 : _e.foreground) !== null && _f !== void 0 ? _f : "";
    let old_fontsize = (_h = (_g = alacritty_old_config === null || alacritty_old_config === void 0 ? void 0 : alacritty_old_config.font) === null || _g === void 0 ? void 0 : _g.size) !== null && _h !== void 0 ? _h : undefined;
    let old_selcolor = (_l = (_k = (_j = alacritty_old_config === null || alacritty_old_config === void 0 ? void 0 : alacritty_old_config.colors) === null || _j === void 0 ? void 0 : _j.selection) === null || _k === void 0 ? void 0 : _k.text) !== null && _l !== void 0 ? _l : "";
    let old_cursor_style = (_o = (_m = alacritty_old_config === null || alacritty_old_config === void 0 ? void 0 : alacritty_old_config.cursor) === null || _m === void 0 ? void 0 : _m.style) !== null && _o !== void 0 ? _o : "Block";
    let old_background_opacity = (_q = (_p = alacritty_old_config === null || alacritty_old_config === void 0 ? void 0 : alacritty_old_config.window) === null || _p === void 0 ? void 0 : _p.opacity) !== null && _q !== void 0 ? _q : undefined;
    // take all new config params, and fallback to old config if not provided
    let { primary_bgcolor = old_bgcolor, primary_fgcolor = old_fgcolor, fontsize = old_fontsize, selection_fgcolor = old_selcolor, cursor_style = old_cursor_style, window_background_opacity = old_background_opacity, } = new_config;
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
    if (cursor_style &&
        !["Block", "Underline", "Beam"].includes(capitaliseString(cursor_style))) {
        throw new Error("Cursor style provided is not in one of the 3 accepted styles");
    }
    if (window_background_opacity < 0.0 || window_background_opacity > 1.0) {
        throw new Error("Background opacity provided is not in the range of 0.0 to 1.0");
    }
    // the config file only accepts hex codes starting with 0x
    const alacritty_updated_config = Object.assign(Object.assign({}, alacritty_old_config), { window: {
            opacity: window_background_opacity,
        }, font: {
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
        } });
    // writing updated config to the original config path directory
    writeToConfigFile(alacritty_updated_config, original_config_path_dir);
    return alacritty_updated_config;
}

/**
 * Main Function which is run from the command line
 */
function main() {
    console.log("----Alacritty Auto Config----\n");
    let original_config_path = "";
    try {
        original_config_path = configInit();
        let alacritty_config = readOriginalConfig(original_config_path);
        const original_config_path_dir = path.dirname(original_config_path);
        /*
        if the arguments are not passed, it will take the old config only,
        and if config does not have that property, it will set defaults for that
        */
        let argumentInputs = takeArgumentInputs(alacritty_config);
        editConfig(alacritty_config, {
            // if they are string or number, convert that to string, then parse its numeric value
            fontsize: parseFloat("" + argumentInputs.s),
            primary_bgcolor: argumentInputs.b,
            primary_fgcolor: argumentInputs.c,
            selection_fgcolor: argumentInputs.t,
            cursor_style: argumentInputs.y,
            window_background_opacity: parseFloat("" + argumentInputs.o),
        }, original_config_path_dir);
    }
    catch (err) {
        console.error("Error: " + err.message + "\n");
    }
}
if (isTheScriptRunFromCLI()) {
    main();
}

export { configInit, convertShortToLongCode, convertToHash, convertToHex, editConfig, hash_color_regex, hex_color_regex, oldConvertToHash, oldConvertToHex, readOriginalConfig, takeArgumentInputs, writeToConfigFile };
