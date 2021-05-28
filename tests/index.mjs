import {configInit, convertToHash} from "../dist/esm/index.mjs";

// basic testing would do full testing with test frameworks
console.log(configInit()+convertToHash('0xfff'));
