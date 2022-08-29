# Notes for Developers

## Development and Build Workflows

- When we run `npm run dev`, our temp output `.js` files gets saved to `<project-root>/output-tsc` folder.
- And the `types` for all such `.ts` files, would go into `<project-root>/dist/types` folder.
- Then, when we run the build command, which would minify those js files into esm and cjs files and save them in the `dist` folder. It would then copy the `.d.ts` files into one declaration file for each output type (like esm, cjs etc.), and would then remove `dist/types` folder.

## package.json Explanation

**Note: It may be outdated, so check the main package.json for latest configs**

- `main` - Path of the main script file (which will work as a fallback if exports field cannot be processed by the older nodejs)
- `module` - Path of the module script file (if exports field could not be processed and the package uses import statements).
- `exports` - Tells that this package will export:
  - ESM folder's file if this package is imported as import
  - CJS folder's file if this package is imported as require statements
- `types` - Tells npm to look for the type declarations at the given file path in types field.
- `bin` - Gives cli commands and their respective js file to run when the particular command is invoked.
- `pkg` - An npm package which can generate executables out of npm packages. Here, we specify:
  - `targets` to be operating system environments
  - output path to be dist/bin folder for all generated executables.
- `scripts` - Normal NPM scripts.
  - `prebuild` - Runs before actual build script
  - `build` - Builds the folders for distribution
  - `dev` - Watch mode for typescript files
  - `generate-binary` - Generates executables for major OS platforms.
  - `postbuild` - Clean up after running build script
- `keywords` - Basic keywords for the npm package

Other things are normal for any npm package like repository for specifying remote git repository link, bugs for specifying remote git repository bugs and issues link, homepage for specifying either the README.md file link or the actual website link for the package homepage.

## Publish this package to npm

For publishing patch, first check if the git working directory is clean and committed and not dirty or modified. Then run the below commands:

```sh
npm version patch
```

As the package uses rollup and shows version in the CLI, so it will have to be built to dist/ folder after version change in package.json. Run :

```sh
npm run generate-binary
```

This will build the project, and then generate the binary executables in the dist folder. Now, we can commit the changes and push to remote repo.
