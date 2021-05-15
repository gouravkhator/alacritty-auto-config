import json from "@rollup/plugin-json";
// import resolve from '@rollup/plugin-node-resolve';
import { terser } from "rollup-plugin-terser";
import builtins from "builtin-modules"; // nodejs builtin modules like fs, os, child_process etc.

const dist_dir = 'dist';

export default {
    input: 'output_tsc/src/index.js',
    output: [
        {
            file: `${dist_dir}/bundle.cjs.js`,
            format: 'cjs',
        },
        {
            file: `${dist_dir}/bundle.esm.js`,
            format: 'esm',
        },
        {
            file: `${dist_dir}/bundle.esm.min.js`,
            format: 'esm',
            plugins:[ terser() ],
        },
        // {
        //     file: `${dist_dir}/bundle.min.js`,
        //     format: 'iife',
        //     name: 'alacrittyCliConfig',
        //     external: ['yargs', 'yamljs', 'path', 'os', 'fs', 'child_process'],
        //     plugins: [terser()]
        // }
        // {
        //     name: 'alacritty-auto-config',
        //     dir: dist_dir,
        //     format: 'umd',
        // }
    ],
    plugins: [ json() ],
    external: [...builtins, 'yargs/yargs','yargs/helpers', 'yamljs'], // builtin nodejs modules and other external modules
    context: 'globalThis', // this was written as undefined so setting context to globalThis
};
