import path from "path";

export default {
    input: 'output_tsc/src/index.js',
    // rollup issues while building
    output: {
        dir: path.join(__dirname, "dist"),
    }
}
