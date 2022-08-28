# Alacritty Auto Config

This is a small npm library which is used to automatically configure Alacritty by providing functions. It provides both CLI option and the npm package to be used in any projects.

## NPM Package

### Install the npm package

**Sorry, but the global/local bin commands are having some issues, I am working on that. If you can contribute, it will be of great help to me. I accept PRs.**

For windows users, please run the package, to see if the configurations actually work or not. I am unable to test it out in windows.

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

- Show Help:

```sh
aac -h
```

Or,

```sh
aac --help
```

- Options:

```sh
-s, --fontsize: Takes font size to be set in alacritty (default=10)
-b, --bgcolor: Takes primary background color in '#xxxxxx' or '#xxx' or '0xfff' or '0xffffff' format (default='#333333')
-c, --fgcolor: Takes primary foreground color in '#xxxxxx' or '#xxx' or '0xfff' or '0xffffff' format (default='#ffffff')
-t, --selcolor: Takes text color (when the area is selected) in '#ffffff' or '#fff' or '0xfff' or '0xffffff' format (default='#111122')
-y, --cursor: Takes cursor style that can be Block or Underline or Beam (default=Block)
-o, --opacity: Takes background opacity which is between 0.0 (transparent) and 1.0 (opaque) (default=1)
-v, --version: Show version number
```

## Project Scripts

### Install and Build the project

```sh
npm install
npm run build
```

### Generate executables

```sh
npm run generate-binary
```

**The generate-binary script will build the dist folder and generate the binary files for each major OS platforms.** All the executables will be present in the dist/bin folder.

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
node dist/esm/index.mjs [options]=[values]
```

Or,

```sh
node dist/cjs/index.cjs [options]=[values]
```

### All bundles

- `dist/cjs/index.cjs` CommonJS module.
- `dist/esm/index.mjs` EcmaScript module.
- `dist/esm/index.min.mjs` Minified EcmaScript module.
  <!-- - `dist/cjs-compat/index.js` CommonJS module, transpiled for older browsers. -->
  <!-- - `dist/bundle.esm-compact.mjs` EcmaScript module, transpiled for older browsers. -->
  <!-- - `dist/bundle.iife.min.js` Minified plain JS. -->
  <!-- - `dist/bundle.iife-compact.js` As above, but transpiled for older browsers. -->

### package.json Explanation

**Note: It may be outdated, so check the main package.json for latest configs**

- main - Path of the main script file (which will work as a fallback if exports field cannot be processed by the older nodejs)
- module - Path of the module script file (if exports field could not be processed and the package uses import statements).
- exports - Tells that this package will export:
  - ESM folder's file if this package is imported as import
  - CJS folder's file if this package is imported as require statements
- types - Tells npm to look for the type declarations at the given file path in types field.
- bin - Gives cli commands and their respective js file to run when the particular command is invoked.
- pkg - An npm package which can generate executables out of npm packages. Here, we specify:
  - targets to be operating system environments
  - output path to be dist/bin folder for all generated executables.
- scripts - Normal NPM scripts.
  - prebuild - Runs before actual build script
  - build - Builds the folders for distribution
  - dev - Watch mode for typescript files
  - generate-binary - Generates executables for major OS platforms.
  - postbuild - Clean up after running build script
- keywords - Basic keywords for the npm package

Other things are normal for any npm package like repository for specifying remote git repository link, bugs for specifying remote git repository bugs and issues link, homepage for specifying either the README.md file link or the actual website link for the package homepage.

### Publish to npm

For publishing patch, first check if the git working directory is clean and committed and not dirty or modified. Then run the below commands:

```sh
npm version patch
```

As the package uses rollup and shows version in the CLI, so it will have to be built to dist/ folder after version change in package.json. Run :

```sh
npm run generate-binary
```

This will build the project, generate binary files in the dist folder. Now, commit the changes and push to remote repo.
