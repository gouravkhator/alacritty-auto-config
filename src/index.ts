import path from "path";
import { URL } from "url";

// file extension is needed for local modules, but not needed for packages installed which have exports option
import { takeArgumentInputs } from "./argument_parser_util.js";
import { configInit, readOriginalConfig, editConfig } from "./autoconfig_api.js";
import { alacritty_config_structure } from "./config_object_structures.js";

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

// Only run main() when the file is run from cli
const fileURL: URL = new URL(`file://${process.argv[1]}`); 
// converting the path to URL as this will make the valid url out of it, like replace space with %20, or some special characters with some codes

if (import.meta.url === fileURL.toString()){
    main();
}

// export all the api functions
export * from "./autoconfig_api.js";
export * from "./argument_parser_util.js";
