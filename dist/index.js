var __createBinding = (undefined && undefined.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (undefined && undefined.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (undefined && undefined.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var path_1 = __importDefault(require("path"));
var argument_parser_util_1 = require("./argument_parser_util");
var autoconfig_api_1 = require("./autoconfig_api");
function main() {
    var original_config_path = "";
    try {
        original_config_path = autoconfig_api_1.configInit();
        var alacritty_config = autoconfig_api_1.readOriginalConfig(original_config_path);
        var original_config_path_dir = path_1["default"].dirname(original_config_path);
        var argumentInputs = argument_parser_util_1.takeArgumentInputs(alacritty_config);
        autoconfig_api_1.editConfig(alacritty_config, {
            fontsize: parseFloat(argumentInputs.s),
            primary_bgcolor: argumentInputs.b,
            primary_fgcolor: argumentInputs.c
        }, original_config_path_dir);
    }
    catch (err) {
        console.error(err);
    }
}
main();
__exportStar(require("./config_object_structures"), exports);
__exportStar(require("./autoconfig_api"), exports);
