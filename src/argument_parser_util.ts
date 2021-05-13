import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';

import { version as packageVersion } from "../package.json";
import { alacritty_config_structure } from "./config_object_structures";

export const hex_color_regex = /^0x([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/;
export const hash_color_regex = /^#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/;

/**
 * Converts short color codes in 3 letter format to long color codes in 6 letter format.
 * 
 * @param color_code Color code in # or 0x format, without prefix. Ex:- for color '#fff', color_code will be passed as 'fff'
 * @returns Color code which is expanded to 6 digits, if it was initially 3 digits long
 */
export function convertShortToLongCode(color_code: string): string {
    color_code = color_code.trim();
    const color_code_regex = /^([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/;

    // if the color code is not 3 or 6 letters long, or if it has other characters than specified in regex, then throw error
    if (!color_code_regex.test(color_code)) {
        throw new Error("Color code, provided in params, is neither in 3 letter format nor in 6 letter format..");
    }

    // if the hex code is 3 letters long, then duplicate each letter to make 6 letters long hex color code
    if (color_code.length === 3) {
        let temp_str: string = "";

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
export function convertToHash(color_code: string | number): string | undefined {
    // color code is normally provided in string, but if the hexadecimal is provided then its inputted as decimal number.
    if (typeof (color_code) === 'string') {

        if (!color_code || (color_code && color_code.trim() === "")) {
            return undefined;
        }

        color_code = color_code.trim();

        if (hex_color_regex.test(color_code)) {
            // color_code was in hex(0x) and convert that to hash(#)
            return '#' + convertShortToLongCode(color_code.substring(2));
        } else if (hash_color_regex.test(color_code)) {
            // color_code was in hash(#) but can be in short (3 letter format), so convert that to long format
            return '#' + convertShortToLongCode(color_code.substring(1));
        } else {
            // neither in hash format nor in hex format
            throw new Error('Color code is not provided in hex(0x) or hash(#) format..');
        }
    }
    else if (typeof (color_code) === "number") {
        // color_code will be decimal format of hexadecimal number(which is also in 0x format but not a string)
        // if color code inputted was 0x1f2, then its decimal was saved in color_code variable, and toString(16) will get back the '1f2' part as string in temp_str
        let temp_str: string = color_code.toString(16);
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
export function convertToHex(color_code: string | number): string | undefined {
    // color code is normally provided in string, but if the hexadecimal is provided then its inputted as decimal number.
    if (typeof (color_code) === 'string') {
        if (!color_code || (color_code && color_code.trim() === "")) {
            return undefined;
        }

        color_code = color_code.trim();

        if (hash_color_regex.test(color_code)) {
            // color_code was in hash(#) and convert that to hex(0x)
            return '0x' + convertShortToLongCode(color_code.substring(1));

        } else if (hex_color_regex.test(color_code)) {
            // color_code was in hex(0x)
            return '0x' + convertShortToLongCode(color_code.substring(2));
        } else {
            // neither in hash format nor in hex format
            throw new Error('Color code is not provided in hex(0x) or hash(#) format..');
        }

    } else if (typeof (color_code) === "number") {
        // color_code will be decimal format of hexadecimal number(which is also in 0x format but not a string)
        let temp_str: string = color_code.toString(16);
        return "0x" + convertShortToLongCode(temp_str);
    }
}

/**
 * Takes argument inputs for the alacritty configuration.
 * 
 * @param alacritty_old_config Alacritty old config object with params (if it exists) 
 * @returns Argument Inputs object with all properties taken as input from the user
 */
export function takeArgumentInputs(alacritty_old_config: alacritty_config_structure = {}): any {
    // for referring to options' longnames
    const arg_keys: {
        s: string;
        b: string;
        c: string;
    } = {
        s: 'fontsize',
        b: 'bgcolor',
        c: 'fgcolor',
    };

    // provide optional default values (for fields you want to provide)
    const default_values: {
        s?: number;
        b?: string;
        c?: string;
    } = {
        s: 10,
        b: '#333333',
        c: '#ffffff',
    }

    return yargs(hideBin(process.argv))
        .usage('Usage: node dist/$0 [options]=[values]\n\nThe options may/may not provided in the CLI. If they are not provided, all the defaults are set.')

        // .demandOption(['s', 'b', 'c']) // to set them required, but as I am setting defaults so its optional

        // options
        .help('h')
        .version(packageVersion)

        // aliases
        .alias('s', arg_keys.s)
        .alias('b', arg_keys.b)
        .alias('c', arg_keys.c)
        .alias('h', 'help')
        .alias('v', 'version')

        // defaults to alacritty old config if that exists or our own default
        .default(arg_keys.s, alacritty_old_config?.font?.size ?? default_values.s)
        .default(arg_keys.b, alacritty_old_config?.colors?.primary?.background ?? default_values.b)
        .default(arg_keys.c, alacritty_old_config?.colors?.primary?.foreground ?? default_values.c)

        // number of arguments
        .nargs({
            [arg_keys.s]: 1,
            [arg_keys.b]: 1,
            [arg_keys.c]: 1,
        })

        // description of options
        .describe(arg_keys.s, `Takes font size to be set in alacritty\t[default=${default_values.s}]`)
        .describe(arg_keys.b, `Takes primary background color in #ffffff or #fff or 0xfff or 0xffffff format\t[default=${default_values.b}]`)
        .describe(arg_keys.c, `Takes primary foreground color in #ffffff or #fff or 0xfff or 0xffffff format\t[default=${default_values.c}]`)

        // conditional checks
        .check((argv) => {
            // argv.anyproperty is a string and nothing else
            if (argv.s && (parseFloat(argv.s) <= 0.0 || parseFloat(argv.s) > 40.0)) {
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

            return true;
        })
        .argv;
}
