# Alacritty Auto Config

This is a small npm library which is used to automatically configure Alacritty by providing functions. It provides both CLI option and the npm package to be used in any projects.

## NPM Package

### Install the npm package

Install the package globally:
```sh
npm install -g alacritty-auto-config
```
**Note: Run the above command with sudo if you are on mac or linux**

Install the package locally:
```sh
npm install alacritty-auto-config
```

### Run the package in CLI

**Before running anything, make sure your alacritty.yml file(if it exists) is backed up, as it may overwrite some configurations in the alacritty.yml file as per your inputs in the CLI/API.**

For global install:
```sh
alacritty-auto-config [options]=[values]
```

Or, 
```sh
aac [options]=[values]
```

For local install, just run the above commands on terminal with npx prefix. 

Ex-
```sh
npx alacritty-auto-config [options]=[values]
```

* Show Help:

```sh
aac -h
```

Or,

```sh
aac --help
```

* Options:

```sh
-s, --fontsize: Takes font size to be set in alacritty (default: 10)
-b, --bgcolor: Takes primary background color in '#xxxxxx' or '#xxx' or '0xfff' or '0xffffff' format (default='#333333')
-c, --fgcolor: Takes primary foreground color in '#xxxxxx' or '#xxx' or '0xfff' or '0xffffff' format (default='#ffffff')
-v, --version: Show version number
```

## Project Scripts

### Install and Build the project

```sh
npm install
npm run build
```

**Note: This will also build the binary files for each major OS platforms.** All the executables will be present in the dist/exec folder.

### Run the development watch mode

**This watch mode watches continuously for the typescript files**

```sh
npm run dev
```

## Project CLI Version

### Usage

The above options and values are also valid if you build the project yourself, and run the distribution file with those options.

Run the below scripts from the project root folder:
```sh
node dist/esm/bundle.mjs [options]=[values]
```
Or,
```sh
node dist/cjs/bundle.cjs [options]=[values]
```

The cjs and mjs files both work, after you have built the project.

### All bundles

- `dist/cjs/bundle.cjs` CommonJS module.
- `dist/esm/bundle.mjs` EcmaScript module.
- `dist/esm/bundle.min.mjs` Minified EcmaScript module.
<!-- - `dist/cjs-compat/index.js` CommonJS module, transpiled for older browsers. -->
<!-- - `dist/bundle.esm-compact.mjs` EcmaScript module, transpiled for older browsers. -->
<!-- - `dist/bundle.iife.min.js` Minified plain JS. -->
<!-- - `dist/bundle.iife-compact.js` As above, but transpiled for older browsers. -->

### package.json Explanation

* main - Describes the main script file
* type - Tells npm that nodejs should run any .js file as a module. For .mjs or .cjs, nodejs should choose their respesctive type (es module or commonjs). 
* exports - Tells that this package will export:
    * .mjs file if this package is imported as import
    * .cjs file if this package is imported as require statements
    * minified .mjs file elsewhere.
* bin - Gives cli commands and their respective js file to run when the particular command is invoked.
* pkg - An npm package which can generate executables out of npm packages. Here, we specify:
    * assets to be node_modules files
    * targets to be operating system environments
    * output path to be dist/exec folder for all generated executables.
* scripts - Normal NPM scripts.
    * prebuild - Runs before actual build script
    * build - Builds the folders for distribution
    * dev - Watch mode for typescript files
* keywords - Basic keywords for the npm package

Other things are normal for any npm package like repository for specifying remote git repository link, bugs for specifying remote git repository bugs and issues link, homepage for specifying either the README.md file link or the actual website link for the package homepage.
