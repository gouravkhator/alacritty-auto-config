/**
 * Structure for the alacritty original config object in JSON format
 */
declare type alacritty_config_structure = {
    font?: {
        size?: number;
    };
    colors?: {
        primary?: {
            background?: string;
            foreground?: string;
        };
        selection?: {
            text?: string;
        };
    };
    background_opacity?: number;
    cursor?: {
        style?: string;
    };
};
/**
 * Summarized Structure for the alacritty config object which is used while taking inputs from user or for the API
 */
declare type alacritty_summarized_config_structure = {
    fontsize?: number;
    primary_bgcolor?: string;
    primary_fgcolor?: string;
    selection_fgcolor?: string;
    background_opacity?: number;
    cursor_style?: "Block" | "Underline" | "Beam";
};

/**
 * Checks if the alacritty is installed or not.
 *
 * Also checks for os type if its supported or not.
 *
 * If alacritty is installed and this api is supported on the current os, then make directory and file for its config if the folder or file does not exist.
 * @returns Alacritty config path
 */
declare function configInit(): string;
/**
 * Reads the original alacritty config from the .yml file and return the config object with the existing properties.
 *
 * Before calling this function, make sure the path exists, with the yml file already created in that path
 *
 * (I suggest to first invoke the configInit function of the api, then this method will work fine)
 * @param original_config_path Absolute Path required to load the original config file of alacritty (Ex- /home/gourav/.config/alacritty/alacritty.yml)
 * @returns The Alacritty Config object which contains the properties and attributes (if there are any)
 */
declare function readOriginalConfig(original_config_path: string): alacritty_config_structure;
/**
 * Writes the config object, to the path passed as parameter.
 *
 * @param alacritty_config_to_write The Alacritty Config Object containing the properties and attributes (if there are any), to write to the original config path
 * @param original_config_path_dir Absolute Path for the original alacritty config directory (Ex- /home/gourav/.config/alacritty/)
 */
declare function writeToConfigFile(alacritty_config_to_write: alacritty_config_structure, original_config_path_dir: string): void;
/**
 * Edits the old config object with the new config parameters, and writes that updated config to the original config path directory as taken in the parameters
 *
 * @param alacritty_old_config Old Alacritty Config Object similar to {font: {size: number}, colors: {primary: {background: '0x333333', foreground: {'0xcccccc'}}}}
 * @param new_config New Config inputs
 * @param original_config_path_dir Path for the Original Alacritty Config directory (Ex- /home/gourav/.config/alacritty/)
 *
 * @returns Updated alacritty config
 */
declare function editConfig(alacritty_old_config: alacritty_config_structure, new_config: alacritty_summarized_config_structure, original_config_path_dir: string): alacritty_config_structure;

declare const hex_color_regex: RegExp;
declare const hash_color_regex: RegExp;
/**
 * Converts short color codes in 3 letter format to long color codes in 6 letter format.
 *
 * @param color_code Color code in # or 0x format, without prefix. Ex:- for color '#fff', color_code will be passed as 'fff'
 * @returns Color code which is expanded to 6 digits, if it was initially 3 digits long
 * @throwsError if Color code is not provided in correct format
 */
declare function convertShortToLongCode(color_code: string): string;
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
declare function convertToHash(color_code: string): string | undefined;
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
declare function convertToHex(color_code: string): string | undefined;
/**
 * Takes argument inputs for the alacritty configuration.
 *
 * @param alacritty_old_config Alacritty old config object with params (if it exists)
 * @returns Argument Inputs object with all properties taken as input from the user
 */
declare function takeArgumentInputs(alacritty_old_config?: alacritty_config_structure): any;
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
declare function oldConvertToHash(color_code: string | number): string | undefined;
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
declare function oldConvertToHex(color_code: string | number): string | undefined;

export { configInit, convertShortToLongCode, convertToHash, convertToHex, editConfig, hash_color_regex, hex_color_regex, oldConvertToHash, oldConvertToHex, readOriginalConfig, takeArgumentInputs, writeToConfigFile };
