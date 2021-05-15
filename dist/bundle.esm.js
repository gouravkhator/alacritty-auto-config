import path from 'path';
import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';
import os from 'os';
import fs from 'fs';
import YAML from 'yamljs';
import { execSync } from 'child_process';

var version = "1.0.0";

var hex_color_regex = /^0x([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/;
var hash_color_regex = /^#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/;
/**
 * Converts short color codes in 3 letter format to long color codes in 6 letter format.
 *
 * @param color_code Color code in # or 0x format, without prefix. Ex:- for color '#fff', color_code will be passed as 'fff'
 * @returns Color code which is expanded to 6 digits, if it was initially 3 digits long
 */
function convertShortToLongCode(color_code) {
    color_code = color_code.trim();
    var color_code_regex = /^([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/;
    // if the color code is not 3 or 6 letters long, or if it has other characters than specified in regex, then throw error
    if (!color_code_regex.test(color_code)) {
        throw new Error("Color code, provided in params, is neither in 3 letter format nor in 6 letter format..");
    }
    // if the hex code is 3 letters long, then duplicate each letter to make 6 letters long hex color code
    if (color_code.length === 3) {
        var temp_str = "";
        for (var i = 0; i <= 2; i++) {
            temp_str += color_code.charAt(i) + color_code.charAt(i);
        }
        return temp_str;
    }
    return color_code; // color_code is 6 letters long, as all checks were done above
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
        var temp_str = color_code.toString(16);
        return "0x" + convertShortToLongCode(temp_str);
    }
}
/**
 * Takes argument inputs for the alacritty configuration.
 *
 * @param alacritty_old_config Alacritty old config object with params (if it exists)
 * @returns Argument Inputs object with all properties taken as input from the user
 */
function takeArgumentInputs(alacritty_old_config) {
    var _a;
    var _b, _c, _d, _e, _f, _g, _h, _j;
    if (alacritty_old_config === void 0) { alacritty_old_config = {}; }
    // for referring to options' longnames
    var arg_keys = {
        s: 'fontsize',
        b: 'bgcolor',
        c: 'fgcolor'
    };
    // provide optional default values (for fields you want to provide)
    var default_values = {
        s: 10,
        b: '#333333',
        c: '#ffffff'
    };
    return yargs(hideBin(process.argv))
        .usage('Usage: node dist/$0 [options]=[values]\n\nThe options may/may not provided in the CLI. If they are not provided, all the defaults are set.')
        // .demandOption(['s', 'b', 'c']) // to set them required, but as I am setting defaults so its optional
        // options
        .help('h')
        .version(version)
        // aliases
        .alias('s', arg_keys.s)
        .alias('b', arg_keys.b)
        .alias('c', arg_keys.c)
        .alias('h', 'help')
        .alias('v', 'version')["default"](arg_keys.s, (_c = (_b = alacritty_old_config === null || alacritty_old_config === void 0 ? void 0 : alacritty_old_config.font) === null || _b === void 0 ? void 0 : _b.size) !== null && _c !== void 0 ? _c : default_values.s)["default"](arg_keys.b, (_f = (_e = (_d = alacritty_old_config === null || alacritty_old_config === void 0 ? void 0 : alacritty_old_config.colors) === null || _d === void 0 ? void 0 : _d.primary) === null || _e === void 0 ? void 0 : _e.background) !== null && _f !== void 0 ? _f : default_values.b)["default"](arg_keys.c, (_j = (_h = (_g = alacritty_old_config === null || alacritty_old_config === void 0 ? void 0 : alacritty_old_config.colors) === null || _g === void 0 ? void 0 : _g.primary) === null || _h === void 0 ? void 0 : _h.foreground) !== null && _j !== void 0 ? _j : default_values.c)
        // number of arguments
        .nargs((_a = {},
        _a[arg_keys.s] = 1,
        _a[arg_keys.b] = 1,
        _a[arg_keys.c] = 1,
        _a))
        // description of options
        .describe(arg_keys.s, "Takes font size to be set in alacritty\t[default=" + default_values.s + "]")
        .describe(arg_keys.b, "Takes primary background color in #ffffff or #fff or 0xfff or 0xffffff format\t[default=" + default_values.b + "]")
        .describe(arg_keys.c, "Takes primary foreground color in #ffffff or #fff or 0xfff or 0xffffff format\t[default=" + default_values.c + "]")
        // conditional checks
        .check(function (argv) {
        // argv.anyproperty is a string and nothing else
        if (argv.s && (parseFloat(argv.s) <= 0.0 || parseFloat(argv.s) > 40.0)) {
            throw new Error("Wrong Arguments: Provided font size " + argv.s + " should be within the range of display: 0.1 to 40.0");
        }
        /* If the color is provided as 0x111 then its actually taken as hexadecimal number, so its typeof will be "number".
        
        But here, as b is a string in typescript. So the check of whether its a number input or not will never be possible. It will not be compiled.

        Same is the case with other colors.
        */
        if (argv.b && convertToHex(argv.b) === undefined) {
            throw new Error("Wrong Arguments: Provided background color " + argv.b + " should be in hash or hex format");
        }
        if (argv.c && convertToHex(argv.c) === undefined) {
            throw new Error("Wrong Arguments: Provided font color " + argv.c + " should be in hash or hex format");
        }
        return true;
    })
        .argv;
}

var __assign = (globalThis && globalThis.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
    var original_config_path = path.join(os.homedir(), '.config/alacritty/alacritty.yml');
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
        var alacritty_config = YAML.load(original_config_path);
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
    var temp_config_dir = 'user_config_temp';
    var json_file_path = path.resolve(temp_config_dir, 'alacritty.json');
    // mkdir recursively if it does not exists
    fs.mkdirSync(temp_config_dir, { recursive: true });
    // write to json
    fs.writeFileSync(json_file_path, JSON.stringify(alacritty_config_to_write), 'utf8');
    /*
    First, convert json to yaml and then rename that yaml to yml, then cp that yml file to the original config folder and finally remove the temp config folder created. I have written all paths within single quotes as the path can have spaces also.
    */
    var write_command = "npx json2yaml '" + json_file_path + "' --save -d 8 && mv '" + path.resolve(temp_config_dir, 'alacritty.yaml') + "' '" + path.resolve(temp_config_dir, 'alacritty.yml') + "' && cp '" + path.resolve(temp_config_dir, 'alacritty.yml') + "' '" + original_config_path_dir + "' && rm -rf " + temp_config_dir;
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
function editConfig(alacritty_old_config, new_config, original_config_path_dir) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    if (alacritty_old_config === void 0) { alacritty_old_config = {}; }
    // ! ISSUE: primary_bgcolor and fgcolor can be hexadecimal number also, so make that type possible
    // if old configs are there, then take that else leave alacritty to its default
    var old_bgcolor = (_c = (_b = (_a = alacritty_old_config === null || alacritty_old_config === void 0 ? void 0 : alacritty_old_config.colors) === null || _a === void 0 ? void 0 : _a.primary) === null || _b === void 0 ? void 0 : _b.background) !== null && _c !== void 0 ? _c : "";
    var old_fgcolor = (_f = (_e = (_d = alacritty_old_config === null || alacritty_old_config === void 0 ? void 0 : alacritty_old_config.colors) === null || _d === void 0 ? void 0 : _d.primary) === null || _e === void 0 ? void 0 : _e.foreground) !== null && _f !== void 0 ? _f : "";
    var old_fontsize = (_h = (_g = alacritty_old_config === null || alacritty_old_config === void 0 ? void 0 : alacritty_old_config.font) === null || _g === void 0 ? void 0 : _g.size) !== null && _h !== void 0 ? _h : undefined;
    // take all new config params, and fallback to old config if not provided
    var _j = new_config.primary_bgcolor, primary_bgcolor = _j === void 0 ? old_bgcolor : _j, _k = new_config.primary_fgcolor, primary_fgcolor = _k === void 0 ? old_fgcolor : _k, _l = new_config.fontsize, fontsize = _l === void 0 ? old_fontsize : _l;
    // we will convert every string to hex code starting with 0x (if possible), to save in new config file
    // if the colors are empty or undefined, then return undefined from convertToHex
    // if the colors are not in correct format, throw error
    primary_bgcolor = convertToHex(primary_bgcolor);
    primary_fgcolor = convertToHex(primary_fgcolor);
    if (fontsize < 0.1 || fontsize > 40.0) {
        throw new Error("Font size provided is not in the range 0.1 to 40.0");
    }
    // the config file only accepts hex codes starting with 0x
    var alacritty_updated_config = __assign(__assign({}, alacritty_old_config), { font: {
            size: fontsize
        }, colors: {
            primary: {
                background: primary_bgcolor,
                foreground: primary_fgcolor
            }
        } });
    writeToConfigFile(alacritty_updated_config, original_config_path_dir); // writing updated config to the original config path directory
    return alacritty_updated_config;
}

/**
 * Main Function which is run from the command line
 */
function main() {
    var original_config_path = "";
    try {
        original_config_path = configInit();
        var alacritty_config = readOriginalConfig(original_config_path);
        var original_config_path_dir = path.dirname(original_config_path);
        var argumentInputs = takeArgumentInputs(alacritty_config);
        // if the arguments are not passed, it will take the old config only, and if config does not have that property, it will set defaults for that
        editConfig(alacritty_config, {
            fontsize: parseFloat(argumentInputs.s),
            primary_bgcolor: argumentInputs.b,
            primary_fgcolor: argumentInputs.c
        }, original_config_path_dir);
    }
    catch (err) {
        console.error(err);
    }
}
// Only run main() when the file is run from cli
if (import.meta.url === "file://" + process.argv[1]) {
    main();
}

export { configInit, editConfig, readOriginalConfig, writeToConfigFile };