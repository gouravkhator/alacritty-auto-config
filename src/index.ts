import path from "path";

// file extension is needed for local modules,
// but not needed for packages installed which have exports option
import { takeArgumentInputs } from "./argument_parser_util.js";
import {
  configInit,
  readOriginalConfig,
  editConfig,
} from "./autoconfig_api.js";
import { alacritty_config_structure } from "./config_object_structures.js";
import { isTheScriptRunFromCLI } from "./utils/internals.js";

/**
 * Main Function which is run from the command line
 */
function main() {
  console.log("----Alacritty Auto Config----\n");

  let original_config_path: string = "";

  try {
    original_config_path = configInit();

    let alacritty_config: alacritty_config_structure =
      readOriginalConfig(original_config_path);
    const original_config_path_dir: string = path.dirname(original_config_path);

    /*
    if the arguments are not passed, it will take the old config only, 
    and if config does not have that property, it will set defaults for that
    */
    let argumentInputs = takeArgumentInputs(alacritty_config);

    editConfig(
      alacritty_config,
      {
        // if they are string or number, convert that to string, then parse its numeric value
        fontsize: parseFloat("" + argumentInputs.s),
        primary_bgcolor: argumentInputs.b,
        primary_fgcolor: argumentInputs.c,
        selection_fgcolor: argumentInputs.t,
        cursor_style: argumentInputs.y,
        background_opacity: parseFloat("" + argumentInputs.o),
      },
      original_config_path_dir
    );
  } catch (err) {
    console.error("Error: " + err.message + "\n");
  }
}

if (isTheScriptRunFromCLI()) {
  main();
}

// export all the necessary api functions
export * from "./autoconfig_api.js";
export * from "./argument_parser_util.js";
