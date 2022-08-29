import yargs from "yargs";
// changed from yargs/yargs to yargs as yargs/yargs is only in commonjs format and not exported as es modules
import { hideBin } from "yargs/helpers";

import { alacritty_config_structure } from "./config_object_structures.js";
import { capitaliseString } from "./utils/internals.js";

export const hex_color_regex = /^0x([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/;
export const hash_color_regex = /^#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/;

// ! ISSUE: If wrong params like -z or -f etc. are given, then give error

/**
 * Converts short color codes in 3 letter format to long color codes in 6 letter format.
 *
 * @param color_code Color code in # or 0x format, without prefix. Ex:- for color '#fff', color_code will be passed as 'fff'
 * @returns Color code which is expanded to 6 digits, if it was initially 3 digits long
 * @throwsError if Color code is not provided in correct format
 */
export function convertShortToLongCode(color_code: string): string {
  color_code = color_code.trim();
  const color_code_regex = /^([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/;

  // if the color code is not 3 or 6 letters long, or if it has other characters than specified in regex, then throw error
  if (!color_code_regex.test(color_code)) {
    throw new Error(
      "Color code provided, is neither in 3 letter format nor in 6 letter format.."
    );
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
 * 3 or 6 letters color codes are accepted.
 * @returns 6 letter Color code with prefix as # in string format.
 * @returns undefined, if the provided color code is empty or undefined
 * @throwsError if Color code is not provided in correct format
 */
export function convertToHash(color_code: string): string | undefined {
  if (!color_code || (color_code && color_code.trim() === "")) {
    return undefined;
  }

  color_code = color_code.trim();

  if (hex_color_regex.test(color_code)) {
    // color_code was in hex(0x) and convert that to hash(#)
    return "#" + convertShortToLongCode(color_code.substring(2));
  } else if (hash_color_regex.test(color_code)) {
    // color_code was in hash(#) but can be in short (3 letter format), so convert that to long format
    return "#" + convertShortToLongCode(color_code.substring(1));
  } else {
    // neither in hash format nor in hex format
    throw new Error(
      "Color code is not provided in hex(0x) or hash(#) format.."
    );
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
export function convertToHex(color_code: string): string | undefined {
  if (!color_code || (color_code && color_code.trim() === "")) {
    return undefined;
  }

  color_code = color_code.trim();

  if (hash_color_regex.test(color_code)) {
    // color_code was in hash(#) and convert that to hex(0x)
    return "0x" + convertShortToLongCode(color_code.substring(1));
  } else if (hex_color_regex.test(color_code)) {
    // color_code was in hex(0x)
    return "0x" + convertShortToLongCode(color_code.substring(2));
  } else {
    // neither in hash format nor in hex format
    throw new Error(
      "Color code provided is invalid, as it either contains invalid values or it is not in hex(0x) or hash(#) format.."
    );
  }
}

/**
 * Takes argument inputs for the alacritty configuration.
 *
 * @param alacritty_old_config Alacritty old config object with params (if it exists)
 * @returns Argument Inputs object with all properties taken as input from the user
 */
export function takeArgumentInputs(
  alacritty_old_config: alacritty_config_structure = {}
): any {
  // for referring to options' longnames
  const arg_keys: {
    s: string;
    b: string;
    c: string;
    t: string;
    y: string;
    o: string;
  } = {
    s: "fontsize",
    b: "bgcolor",
    c: "fgcolor",
    t: "selcolor", // selection text color
    y: "cursor", // cursor style
    o: "opacity", // background opacity
  };

  // provide optional default values (for fields you want to provide)
  const default_values: {
    s?: number;
    b?: string;
    c?: string;
    t?: string;
    y?: string;
    o?: number;
  } = {
    s: 16,
    b: "#111122",
    c: "#ccccff",
    t: "#111122",
    y: "Block",
    o: 1.0,
  };

  return (
    yargs(hideBin(process.argv))
      .options({
        // adding type to each argument
        s: { type: "number" },
        b: { type: "string" },
        c: { type: "string" },
        t: { type: "string" },
        y: { type: "string" },
        o: { type: "number" },
      })
      .usage(
        "Usage: node <javascript-file-name> [options]=[values],\nif the file you ran is a javascript file..\n\nOr just, <executable-name> [options]=[values]\n\nThe options are not required fields. If you don't provide the options, we either load your previously set alacritty config, or we set our own defaults for those options."
      )

      /*
      to set the fields required we can use `demandOption`,
      but as I am setting defaults so so those fields are optional for my use case
      */
      // .demandOption(['s', 'b', 'c'])

      // options
      .help("h")
      .version("{{version}}") // the version is replaced in rollup build process

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
      .default(arg_keys.s, alacritty_old_config?.font?.size ?? default_values.s)
      .default(
        arg_keys.b,
        alacritty_old_config?.colors?.primary?.background ?? default_values.b
      )
      .default(
        arg_keys.c,
        alacritty_old_config?.colors?.primary?.foreground ?? default_values.c
      )
      .default(
        arg_keys.t,
        alacritty_old_config?.colors?.selection?.text ?? default_values.t
      )
      .default(
        arg_keys.y,
        alacritty_old_config?.cursor?.style ?? default_values.y
      )
      .default(
        arg_keys.o,
        alacritty_old_config?.background_opacity ?? default_values.o
      )

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
      .describe(
        arg_keys.s,
        `Takes font size to be set in alacritty [default=${default_values.s}]`
      )
      .describe(
        arg_keys.b,
        `Takes primary background color in #ffffff or #fff or 0xfff or 0xffffff format [default=${default_values.b}]`
      )
      .describe(
        arg_keys.c,
        `Takes primary foreground color in #ffffff or #fff or 0xfff or 0xffffff format [default=${default_values.c}]`
      )
      .describe(
        arg_keys.t,
        `Takes text color (when the area is selected) in #ffffff or #fff or 0xfff or 0xffffff format [default=${default_values.t}]`
      )
      .describe(
        arg_keys.y,
        `Takes cursor style that can be Block or Underline or Beam [default=${default_values.y}]`
      )
      .describe(
        arg_keys.o,
        `Takes background opacity which is between 0.0 (transparent) and 1.0 (opaque) [default=${default_values.o}]`
      )

      // conditional checks
      .check((argv) => {
        if (argv.s && (argv.s <= 0.0 || argv.s > 40.0)) {
          throw new Error(
            `Invalid Arguments: Provided font size \`${argv.s}\` is out of bounds of the display font range: 0.1 to 40.0!!`
          );
        }

        if (argv.b && convertToHex("" + argv.b) === undefined) {
          throw new Error(
            `Invalid Arguments: Provided background color \`${argv.b}\` is neither in hash nor in hex format!!`
          );
        }

        if (argv.c && convertToHex("" + argv.c) === undefined) {
          throw new Error(
            `Invalid Arguments: Provided font color \`${argv.c}\` is neither in hash nor in hex format!!`
          );
        }

        if (argv.t && convertToHex("" + argv.t) === undefined) {
          throw new Error(
            `Invalid Arguments: Provided selection text color \`${argv.t}\` is neither in hash nor in hex format!!`
          );
        }

        // here, we allow all case for the input of cursor style field (lowercase, uppercase or mixed-case)
        if (
          argv.y &&
          !["Block", "Underline", "Beam"].includes(
            capitaliseString("" + argv.y)
          )
        ) {
          throw new Error(
            `Invalid Arguments: Provided cursor style: \`${argv.y}\` is not one of the allowed cursor styles: { block, underline, beam }`
          );
        }

        if (argv.o && (argv.o < 0.0 || argv.o > 1.0)) {
          throw new Error(
            `Invalid Arguments: Provided background opacity \`${argv.o}\` is not in the range from 0.0 to 1.0!!`
          );
        }

        return true;
      }).argv
  );
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
export function oldConvertToHash(
  color_code: string | number
): string | undefined {
  // color code is normally provided in string, but if the hexadecimal is provided then its inputted as decimal number.
  if (typeof color_code === "string") {
    if (!color_code || (color_code && color_code.trim() === "")) {
      return undefined;
    }

    color_code = color_code.trim();

    if (hex_color_regex.test(color_code)) {
      // color_code was in hex(0x) and convert that to hash(#)
      return "#" + convertShortToLongCode(color_code.substring(2));
    } else if (hash_color_regex.test(color_code)) {
      // color_code was in hash(#) but can be in short (3 letter format), so convert that to long format
      return "#" + convertShortToLongCode(color_code.substring(1));
    } else {
      // neither in hash format nor in hex format
      throw new Error(
        "Color code is not provided in hex(0x) or hash(#) format.."
      );
    }
  } else if (typeof color_code === "number") {
    // color_code will be decimal format of hexadecimal number(which is also in 0x format but not a string)
    // if color code inputted was 0x1f2, then its decimal was saved in color_code variable, and toString(16) will get back the '1f2' part as string in temp_str
    let temp_str: string = color_code.toString(16);
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
export function oldConvertToHex(
  color_code: string | number
): string | undefined {
  // color code is normally provided in string, but if the hexadecimal is provided then its inputted as decimal number.

  if (typeof color_code === "string") {
    if (!color_code || (color_code && color_code.trim() === "")) {
      return undefined;
    }

    color_code = color_code.trim();

    if (hash_color_regex.test(color_code)) {
      // color_code was in hash(#) and convert that to hex(0x)
      return "0x" + convertShortToLongCode(color_code.substring(1));
    } else if (hex_color_regex.test(color_code)) {
      // color_code was in hex(0x)
      return "0x" + convertShortToLongCode(color_code.substring(2));
    } else {
      // neither in hash format nor in hex format
      throw new Error(
        "Color code is not provided in hex(0x) or hash(#) format.."
      );
    }
  } else if (typeof color_code === "number") {
    // color_code will be decimal format of hexadecimal number(which is also in 0x format but not a string)
    let temp_str: string = color_code.toString(16);

    return "0x" + convertShortToLongCode(temp_str);
  }
}
