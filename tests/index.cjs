const { configInit, readOriginalConfig, takeArgumentInputs, editConfig } = require('../dist/bundle.cjs');
const path = require('path');

let original_config_path = "";
try {
    original_config_path = configInit();
    let alacritty_config = readOriginalConfig(original_config_path);
    const original_config_path_dir = path.dirname(original_config_path);
    let argumentInputs = takeArgumentInputs(alacritty_config);
    // if the arguments are not passed, it will take the old config only, and if config does not have that property, it will set defaults for that
    editConfig(alacritty_config, {
        fontsize: parseFloat(argumentInputs.s),
        primary_bgcolor: argumentInputs.b,
        primary_fgcolor: argumentInputs.c,
    }, original_config_path_dir);
}
catch (err) {
    console.error(err);
}