import { alacritty_summarized_config_structure, alacritty_config_structure } from "./config_object_structures";
export declare function configInit(): string;
export declare function readOriginalConfig(original_config_path: string): alacritty_config_structure;
export declare function writeToConfigFile(alacritty_config_to_write: alacritty_config_structure, original_config_path_dir: string): void;
export declare function editConfig(alacritty_old_config: alacritty_config_structure, new_config: alacritty_summarized_config_structure, original_config_path_dir: string): alacritty_config_structure;
//# sourceMappingURL=autoconfig_api.d.ts.map