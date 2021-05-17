import os from "os";
import fs from "fs";
import path from "path";
import YAML from "yamljs";
import { execSync } from "child_process";

import { convertToHex } from "./argument_parser_util.js";
import { alacritty_summarized_config_structure, alacritty_config_structure } from "./config_object_structures.js";

/**
 * Checks if the alacritty is installed or not. 
 * 
 * Also checks for os type if its supported or not.
 * 
 * If alacritty is installed and this api is supported on the current os, then make directory and file for its config if the folder or file does not exist.
 * @returns Alacritty config path
 */
export function configInit(): string {
    // check for os type
    if (os.type() === 'Windows_NT') {
        // The path for alacritty config is %APPDATA%\alacritty\alacritty.yml
        // TODO: I can code up this if windows users can confirm the working
        throw new Error("Platform win32 not supported by our app");
    }

    // check if alacritty is installed or not
    try {
        execSync('which alacritty');
    } catch (err: any) {
        throw new Error("Package Not Installed: alacritty is not installed in your system or it's path is not set in your PATH variable, so you cannot use our library..");
    }

    const original_config_path: string = path.join(os.homedir(), '.config/alacritty/alacritty.yml');

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
export function readOriginalConfig(original_config_path: string): alacritty_config_structure {
    try {
        let alacritty_config: any = YAML.load(original_config_path);
        return alacritty_config;
    } catch (err: any) {
        throw new Error("Cannot load original alacritty config file from the path provided..");
    }
}

/**
 * Writes the config object, to the path passed as parameter.
 * 
 * @param alacritty_config_to_write The Alacritty Config Object containing the properties and attributes (if there are any), to write to the original config path
 * @param original_config_path_dir Absolute Path for the original alacritty config directory (Ex- /home/gourav/.config/alacritty/)
 */
export function writeToConfigFile(alacritty_config_to_write: alacritty_config_structure, original_config_path_dir: string) {
    const temp_config_dir = 'user_config_temp';

    const json_file_path = path.resolve(temp_config_dir, 'alacritty.json');

    // mkdir recursively if it does not exists
    fs.mkdirSync(temp_config_dir, { recursive: true });

    // write to json
    fs.writeFileSync(json_file_path, JSON.stringify(alacritty_config_to_write), 'utf8');

    /*
    First, convert json to yaml and then rename that yaml to yml, then cp that yml file to the original config folder and finally remove the temp config folder created. I have written all paths within single quotes as the path can have spaces also.
    */
    const write_command: string = `npx json2yaml '${json_file_path}' --save -d 8 && mv '${path.resolve(temp_config_dir, 'alacritty.yaml')}' '${path.resolve(temp_config_dir, 'alacritty.yml')}' && cp '${path.resolve(temp_config_dir, 'alacritty.yml')}' '${original_config_path_dir}' && rm -rf ${temp_config_dir}`;

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
export function editConfig(alacritty_old_config: alacritty_config_structure = {}, new_config: alacritty_summarized_config_structure, original_config_path_dir: string): alacritty_config_structure {

    // ! ISSUE: primary_bgcolor and fgcolor can be hexadecimal number also, so make that type possible
    // if old configs are there, then take that else leave alacritty to its default
    let old_bgcolor = alacritty_old_config?.colors?.primary?.background ?? "";
    let old_fgcolor = alacritty_old_config?.colors?.primary?.foreground ?? "";
    let old_fontsize = alacritty_old_config?.font?.size ?? undefined;

    // take all new config params, and fallback to old config if not provided
    let { primary_bgcolor = old_bgcolor, primary_fgcolor = old_fgcolor, fontsize = old_fontsize } = new_config;

    // we will convert every string to hex code starting with 0x (if possible), to save in new config file
    // if the colors are empty or undefined, then return undefined from convertToHex
    // if the colors are not in correct format, throw error
    primary_bgcolor = convertToHex(primary_bgcolor);
    primary_fgcolor = convertToHex(primary_fgcolor);

    if (fontsize < 0.1 || fontsize > 40.0) {
        throw new Error("Font size provided is not in the range 0.1 to 40.0")
    }

    // the config file only accepts hex codes starting with 0x
    const alacritty_updated_config: alacritty_config_structure = {
        ...alacritty_old_config,
        font: {
            size: fontsize,
        },
        colors: {
            primary: {
                background: primary_bgcolor,
                foreground: primary_fgcolor,
            },
        },
    };

    writeToConfigFile(alacritty_updated_config, original_config_path_dir); // writing updated config to the original config path directory
    return alacritty_updated_config;
}
