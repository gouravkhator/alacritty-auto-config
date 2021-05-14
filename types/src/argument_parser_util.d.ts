import { alacritty_config_structure } from "./config_object_structures";
export declare const hex_color_regex: RegExp;
export declare const hash_color_regex: RegExp;
/**
 * Converts short color codes in 3 letter format to long color codes in 6 letter format.
 *
 * @param color_code Color code in # or 0x format, without prefix. Ex:- for color '#fff', color_code will be passed as 'fff'
 * @returns Color code which is expanded to 6 digits, if it was initially 3 digits long
 */
export declare function convertShortToLongCode(color_code: string): string;
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
export declare function convertToHash(color_code: string | number): string | undefined;
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
export declare function convertToHex(color_code: string | number): string | undefined;
/**
 * Takes argument inputs for the alacritty configuration.
 *
 * @param alacritty_old_config Alacritty old config object with params (if it exists)
 * @returns Argument Inputs object with all properties taken as input from the user
 */
export declare function takeArgumentInputs(alacritty_old_config?: alacritty_config_structure): any;
//# sourceMappingURL=argument_parser_util.d.ts.map