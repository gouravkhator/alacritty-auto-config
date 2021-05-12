import path from "path";

import { takeArgumentInputs } from "./argument_parser_util";
import { configInit, readOriginalConfig, editConfig } from "./autoconfig_api";
import { alacritty_config_structure } from "./config_object_structures";

/**
 * Main Function which is run from the command line
 */
function main(){
    let original_config_path: string = "";

    try {
        original_config_path = configInit();

        let alacritty_config: alacritty_config_structure = readOriginalConfig(original_config_path);
        const original_config_path_dir: string = path.dirname(original_config_path);

        let argumentInputs = takeArgumentInputs(alacritty_config); 
        // if the arguments are not passed, it will take the old config only, and if config does not have that property, it will set defaults for that

        editConfig(alacritty_config, {
            fontsize: parseFloat(argumentInputs.s),
            primary_bgcolor: argumentInputs.b,
            primary_fgcolor: argumentInputs.c,
        }, original_config_path_dir);

    } catch (err) {
        console.error(err);
    }
}

main();

// export all the structures/types to be used
export * from "./config_object_structures";
// export all the api functions
export * from "./autoconfig_api";
