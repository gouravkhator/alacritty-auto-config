import { realpathSync } from "fs";
import { pathToFileURL } from "url";

/**
 *
 * @param str String to capitalise
 * @returns Capitalised string
 */
export function capitaliseString(str: string): string | undefined {
  if (!!str) {
    return str[0].toUpperCase() + str.substring(1).toLowerCase();
  } else {
    return undefined;
  }
}

/**
 * Tells if the script is run from the cli or imported as a module..
 * @returns true if the script is run from the CLI, and false otherwise..
 */
export function isTheScriptRunFromCLI(): boolean {
  /*
    We use realpathSync to resolve symlinks, 
    as the cli scripts will often be executed from symlinks in the `node_modules/.bin` folder
    */

  /*
    Why we had process.argv[1]?
    > It is bcoz, even the npm bin commands are resolved to command: 
    `node <cjs/esm filename>.<cjs/esm>`.
  
    We want the real file path of the second argument in the resolved command, as mentioned above.
    */
  const realPath = realpathSync(process.argv[1]);

  // Convert the file-path to a file-url before comparing it
  const realPathAsUrl = pathToFileURL(realPath).href;

  /*
    if the script's import url is same as the path where the script is actually stored, 
    then it was run from the CLI itself
    */
  return import.meta.url === realPathAsUrl;
}
