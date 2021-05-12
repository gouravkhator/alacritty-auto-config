import { alacritty_config_structure } from "./config_object_structures";
export declare const hex_color_regex: RegExp;
export declare const hash_color_regex: RegExp;
export declare function convertShortToLongCode(color_code: string): string;
export declare function convertToHash(color_code: string | number): string | undefined;
export declare function convertToHex(color_code: string | number): string | undefined;
export declare function takeArgumentInputs(alacritty_config_object?: alacritty_config_structure): {
    [x: string]: string;
    _: (string | number)[];
    $0: string;
};
//# sourceMappingURL=argument_parser_util.d.ts.map