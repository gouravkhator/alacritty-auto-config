## Changes v1.x

- Project basic functionalities were developed with fontsize, background color, and text color to be changeable.
- Added Documentation.
- Fixed package so that it can be imported in both cjs and esm module style.
- Added executables export option.
- **v1.1.0 bump** - Added more options like background opacity, selection text color, and cursor style
- _Deprecated_ convertToHex and convertToHash methods and edited functionality in their method syntax. The deprecated methods are renamed as oldConvertToHex and oldConvertToHash methods.
- **v1.2.0 bump** - Removed execSync command and did json2yaml programmatically using npm package.
- **v1.3.0 bump** - Added windows support.
- **v1.3.1 bump** - Removed `yamljs` and `json2yaml` packages, and replace it with `yaml` npm package.
- **v1.3.2 bump** - Solved the bug: [No functionality triggered when running the binaries of npm packages, installed locally or globally](https://github.com/gouravkhator/alacritty-auto-config/issues/2).
- **v1.3.3 bump** - Updated the `background_opacity` field to `window.opacity`, thus solving the bug: [background_opacity field is deprecated from alacritty version 0.10.0](https://github.com/gouravkhator/alacritty-auto-config/issues/3).
