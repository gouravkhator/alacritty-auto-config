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
    };
};
/**
 * Summarized Structure for the alacritty config object which is used while taking inputs from user or for the API
 */
export declare type alacritty_summarized_config_structure = {
    fontsize?: number;
    primary_bgcolor?: string;
    primary_fgcolor?: string;
};
//# sourceMappingURL=config_object_structures.d.ts.map