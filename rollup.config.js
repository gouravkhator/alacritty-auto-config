import json from "@rollup/plugin-json";
// import { terser } from "rollup-plugin-terser";

const dist_dir = 'dist';

export default {
    input: 'output_tsc/src/index.js',
    output: [
        {
            file: `${dist_dir}/bundle.cjs.js`,
            format: 'cjs',
        },
        // {
        //     file: `${dist_dir}/bundle.min.js`,
        //     format: 'iife',
        //     name: 'alacrittyCliConfig',
        //     external: ['yargs', 'yamljs', 'path', 'os', 'fs', 'child_process'],
        //     plugins: [terser()]
        // }
        // {
        //     dir: dist_dir,
        //     format: 'esm',
        // },
        // {
        //     name: 'alacritty-auto-config',
        //     dir: dist_dir,
        //     format: 'umd',
        // }
    ],
    plugins: [json()]
};
