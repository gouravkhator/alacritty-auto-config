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
node dist/bundle.mjs [options]=[values]
```
Or,
```sh
node dist/bundle.cjs [options]=[values]
```

The cjs and mjs files both work, after you have built the project.

### All bundles

- `dist/bundle.cjs` CommonJS module.
<!-- - `dist/cjs-compat/index.js` CommonJS module, transpiled for older browsers. -->
- `dist/bundle.mjs` EcmaScript module.
- `dist/bundle.min.mjs` Minified EcmaScript module.
<!-- - `dist/bundle.esm-compact.mjs` EcmaScript module, transpiled for older browsers. -->
<!-- - `dist/bundle.iife.min.js` Minified plain JS. -->
<!-- - `dist/bundle.iife-compact.js` As above, but transpiled for older browsers. -->
