/**
 * Structure for the alacritty original config object in JSON format
 */
export declare type alacritty_config_structure = {
    font?: {
        size?: number;
    };
    colors?: {
        primary?: {
            background?: string;
            foreground?: string;
        };
        selection?: {
            text?: string;
        };
    };
    background_opacity?: number;
    cursor?: {
        style?: string;
    };
};
/**
 * Summarized Structure for the alacritty config object which is used while taking inputs from user or for the API
 */
export declare type alacritty_summarized_config_structure = {
    fontsize?: number;
    primary_bgcolor?: string;
    primary_fgcolor?: string;
    selection_fgcolor?: string;
    background_opacity?: number;
    cursor_style?: "Block" | "Underline" | "Beam";
};
//# sourceMappingURL=config_object_structures.d.ts.map