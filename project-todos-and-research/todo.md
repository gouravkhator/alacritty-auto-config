# Todos

- [ ] Automate the CI part, so that when we change the version using `npm version patch/minor/major`, it should automatically run the `generate-binary` npm script, and then should stage and commit the new file changes, and also publish it to npm.
- [ ] If wrong param menu options are given, then throw an error to the end consumer of this package.
- [ ] Have to add a proper way to compile and test each functionality during development mode.
  - When we run `npm run dev`, our temp output `.js` files gets saved to `<project-root>/output-tsc` folder.
  - And the `types` for all such `.ts` files would go into `<project-root>/dist/types` folder.
  - Then, we would run the build command, which would minify those js files into esm and cjs files and save them in the `dist` folder. It would then copy the `.d.ts` files into one declaration file for each output type (like esm, cjs etc.), and would then remove `dist/types` folder.
- [ ] When doing `console.log` or using `yargs` logging, the words gets broken up, when the terminal column size does not fit it all. We should not do word-breaks in the output of our CLI tool, if that can be solved.
