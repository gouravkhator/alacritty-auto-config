# Alacritty Auto Config

This is a small npm library which is used to automatically configure Alacritty by providing functions. It provides both CLI option and the npm package to be used in any projects.

## Installation Script

```sh
npm install
```

## Build the Project

```sh
npm run build
```

## Run the development watch mode 

**This watch mode watches continuously for the typescript files**

```sh
npm run dev
```

## Run the CLI version

```sh
npm run cli
```

## CLI Version

### Usage

* Show Help:

```sh
node dist/index.js -h
```

Or,

```sh
node dist/index.js --help
```

* Options:

```sh
-s, --fontsize: Takes font size to be set in alacritty (default: 10)
-b, --bgcolor: Takes primary background color in '#xxxxxx' or '#xxx' or '0xfff' or '0xffffff' format (default='#333333')
-c, --fgcolor: Takes primary foreground color in '#xxxxxx' or '#xxx' or '0xfff' or '0xffffff' format (default='#ffffff')
-v, --version: Show version number
```

## NPM Package Usage

### Install the npm package

```sh
npm install alacritty-auto-config
```
