/**
 * Structure for the alacritty original config object in JSON format
 */
export type alacritty_config_structure = {
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
    style?: string; // the exact values checks are already in api
  };
};

/**
 * Summarized Structure for the alacritty config object which is used while taking inputs from user or for the API
 */
export type alacritty_summarized_config_structure = {
  fontsize?: number;
  primary_bgcolor?: string;
  primary_fgcolor?: string;
  selection_fgcolor?: string;
  background_opacity?: number;
  cursor_style?: "Block" | "Underline" | "Beam";
};
