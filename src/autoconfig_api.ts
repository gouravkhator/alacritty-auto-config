import os from "os";
import fs from "fs";
import path from "path";
import YAML from "yaml";
import { execSync } from "child_process";

import { convertToHex } from "./argument_parser_util.js";
import { capitaliseString } from "./utils/internals.js";

import {
  alacritty_summarized_config_structure,
  alacritty_config_structure,
} from "./config_object_structures.js";

/**
 * Checks if the alacritty is installed or not.
 *
 * Also checks for os type if its supported or not.
 *
 * If alacritty is installed and this api is supported on the current os, then make directory and file for its config if the folder or file does not exist.
 * @returns Alacritty config path
 * @throwsError when the alacritty program is not found in your path variable or not even installed in your system
 */
export function configInit(): string {
  let alacritty_install_checker_command: string = "which alacritty";
  let original_config_path: string = path.join(
    os.homedir(),
    ".config/alacritty/alacritty.yml"
  );

  // if os type is windows then change the install checker command and path directory for original config
  if (os.type() === "Windows_NT") {
    // The path for alacritty config is C:\Users\gourav\alacritty\alacritty.yml and homedir is C:\Users\gourav
    alacritty_install_checker_command = "where alacritty";
    original_config_path = path.join(os.homedir(), "AppData", "alacritty.yml");
  }

  // check if alacritty is installed or not
  try {
    execSync(alacritty_install_checker_command);
  } catch (err: any) {
    throw new Error(
      "Package Not Installed: alacritty is not installed in your system or it's path is not set in your PATH or environment variable. \nSo, we are sorry that you cannot use our library. \n\nPlease install alacritty and try again"
    );
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
export function readOriginalConfig(
  original_config_path: string
): alacritty_config_structure {
  let file_content: string;

  try {
    file_content = fs.readFileSync(original_config_path, "utf8"); // reads file
    let alacritty_config: any = YAML.parse(file_content); // parses the yaml and converts that to json format
    return alacritty_config;
  } catch (err: any) {
    if (file_content === undefined) {
      // if file does not exist, ..
      throw new Error(
        "Unable to read the newly-created/original alacritty config file from the default config path..\n\nPlease verify the file/folder permissions assigned to the alacritty's default config folder.."
      );
    } else {
      throw new Error(
        "Existing alacritty's config file cannot be parsed.\n\nPlease fix this YAML Parse Error and try again:\n" +
          err.message
      );
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
export function writeToConfigFile(
  alacritty_config_to_write: alacritty_config_structure,
  original_config_path_dir: string
) {
  try {
    const yml_file_path = path.resolve(
      original_config_path_dir,
      "alacritty.yml"
    );

    // mkdir recursively if it does not exists
    fs.mkdirSync(path.dirname(yml_file_path), { recursive: true });

    const yml_str = YAML.stringify(alacritty_config_to_write); // takes json and converts to yml format

    fs.writeFileSync(yml_file_path, yml_str, "utf-8"); // write the yml str to the file

    console.log(
      "Your configs will be applied..\nIn case, you did not see the new look in alacritty, we suggest to close and reopen all windows of alacritty"
    );
  } catch (err: any) {
    console.log(
      "Sorry, some error occurred while writing configurations to the alacritty.yml file"
    );
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
export function editConfig(
  alacritty_old_config: alacritty_config_structure = {},
  new_config: alacritty_summarized_config_structure,
  original_config_path_dir: string
): alacritty_config_structure {
  // if old configs are there, then take that else leave alacritty to its default
  let old_bgcolor = alacritty_old_config?.colors?.primary?.background ?? "";
  let old_fgcolor = alacritty_old_config?.colors?.primary?.foreground ?? "";
  let old_fontsize = alacritty_old_config?.font?.size ?? undefined;
  let old_selcolor = alacritty_old_config?.colors?.selection?.text ?? "";
  let old_cursor_style = alacritty_old_config?.cursor?.style ?? "Block";
  let old_background_opacity =
    alacritty_old_config?.background_opacity ?? undefined;

  // take all new config params, and fallback to old config if not provided
  let {
    primary_bgcolor = old_bgcolor,
    primary_fgcolor = old_fgcolor,
    fontsize = old_fontsize,
    selection_fgcolor = old_selcolor,
    cursor_style = old_cursor_style,
    background_opacity = old_background_opacity,
  } = new_config;

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
  if (
    cursor_style &&
    !["Block", "Underline", "Beam"].includes(capitaliseString(cursor_style))
  ) {
    throw new Error(
      "Cursor style provided is not in one of the 3 accepted styles"
    );
  }

  if (background_opacity < 0.0 || background_opacity > 1.0) {
    throw new Error(
      "Background opacity provided is not in the range 0.0 to 1.0"
    );
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
      selection: {
        text: selection_fgcolor,
      },
    },
    cursor: {
      style: cursor_style,
    },
    background_opacity: background_opacity,
  };

  // writing updated config to the original config path directory
  writeToConfigFile(alacritty_updated_config, original_config_path_dir);
  return alacritty_updated_config;
}
