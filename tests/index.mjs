import { configInit, convertToHash } from "../dist/esm/index.mjs";

// below is just basic testing, but I plan to do full testing using test frameworks like Mocha
console.log(configInit() + convertToHash("0xfff"));
