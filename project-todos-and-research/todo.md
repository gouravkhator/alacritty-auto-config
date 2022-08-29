# Todos

- [ ] `background_opacity` field is deprecated from alacritty version `0.10.0`, so use below:

  ```yaml
  window:
    opacity: 1.0
  ```

  > Note: Due to this issue, our package is currently compatible with alacritty version `0.4.0`.

- [ ] If wrong param menu options are given, then error out.
- [ ] Have to add a proper way to compile and test each functionality during development mode.
  - When we run `npm run dev`, our temp output `.js` files gets saved to `<project-root>/output-tsc` folder.
  - And the `types` for all such `.ts` files would go into `<project-root>/dist/types` folder.
  - Then, we would run the build command, which would minify those js files into esm and cjs files and save them in the `dist` folder. It would then copy the `.d.ts` files into one declaration file for each output type (like esm, cjs etc.), and would then remove `dist/types` folder.
- [ ] When doing `console.log` or using `yargs` logging, the words gets broken up, when the terminal column size does not fit it all. We should not do word-breaks in the output of our CLI tool, if that can be solved.
