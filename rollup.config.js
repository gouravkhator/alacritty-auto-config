import json from "@rollup/plugin-json";
// import resolve from '@rollup/plugin-node-resolve';
import replace from "@rollup/plugin-replace";
import { terser } from "rollup-plugin-terser";
import dts from "rollup-plugin-dts"; // for bundling all d.ts types files to one type declaration files
import builtins from "builtin-modules"; // nodejs builtin modules like fs, os, child_process etc.

import { version as packageVersion } from './package.json';

const dist_dir = 'dist';
const shebang = '#!/usr/bin/env node';

export default [
    // for bundling javascript file and generating different module files (cjs, esm etc.)
    {
        input: 'output_tsc/index.js',
        output: [
            {
                file: `${dist_dir}/cjs/index.cjs`,
                format: 'cjs',
                banner: shebang,
            },
            {
                file: `${dist_dir}/esm/index.mjs`,
                format: 'esm',
                banner: shebang,
            },
            {
                file: `${dist_dir}/esm/index.min.mjs`,
                format: 'esm',
                plugins: [terser()], // terser is for minification of esm bundle
            },
            // {
            //     file: `${dist_dir}/bundle.min.js`,
            //     format: 'iife',
            //     name: 'alacrittyConfig',
            //     plugins: [terser()]
            // },
            // {
            //     name: 'alacrittyConfig',
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
                // Ex- let x = '{{version}}', then x will be {{version}} and not some version no.
            })],

        external: [...builtins, 'yargs', 'yargs/helpers', 'yamljs'], // builtin nodejs modules and other external modules
        context: 'globalThis', // this was written as undefined so setting context to globalThis,
    },
    // for bundling all d.ts types files to one type declaration files
    {
        input: "dist/types/index.d.ts",
        output: [
            { file: "dist/esm/index.d.ts", format: "es" },
            { file: "dist/cjs/index.d.ts", format: "es" },
        ],
        plugins: [dts()],
    },
];
