import json from "@rollup/plugin-json";
// import resolve from '@rollup/plugin-node-resolve';
import replace from "@rollup/plugin-replace";
import { terser } from "rollup-plugin-terser";
import builtins from "builtin-modules"; // nodejs builtin modules like fs, os, child_process etc.

import { version as packageVersion } from './package.json';

const dist_dir = 'dist';

export default {
    input: 'output_tsc/index.js',
    output: [
        {
            file: `${dist_dir}/bundle.cjs`,
            format: 'cjs',
        },
        {
            file: `${dist_dir}/bundle.mjs`,
            format: 'esm',
        },
        {
            file: `${dist_dir}/bundle.min.mjs`,
            format: 'esm',
            plugins:[ terser() ], // terser is for minification of esm bundle
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
    plugins: [ 
        json(), 
        replace({
        //replace the version in the files, it will use as input or in the imported modules
        //the delimiters are important else it would replace all words named versions
        delimiters: ['{{', '}}'],
        version: packageVersion, 
        preventAssignment: true, 
        // prevents assignment of '{{version}}' to a variable when this string is followed by '=' sign
    }) ],

    external: [...builtins, 'yargs','yargs/helpers', 'yamljs'], // builtin nodejs modules and other external modules
    context: 'globalThis', // this was written as undefined so setting context to globalThis,
};
