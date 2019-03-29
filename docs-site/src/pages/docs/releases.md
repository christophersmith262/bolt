🎉 Major feature <br>
✨ Minor feature <br>
🔨 Refactoring / Maintenance <br>
🔧 Configuration <br>
🐛 Bugfix <br>
🐎 Performance <br>
📚 Documentation <br>
✅ Tests <br>
💥 Major breaking change <br>

---

# Bolt v2.2.x
Released: Nov 18, 2018

* 🐎 Updated the build tools to now run builds ~900% faster!
* ✨ Added new `align` option to the `<bolt-share>` component
* ✨ Updated Bolt’s utility classes to now support opacity 
* ✨ Added the new version selector to the docs site to help with QA and finding docs relating to  this also lays down the foundation for new upcoming `<bolt-select>` component.
* ✨ Added support for `contextually aware` behavior in Bolt components (ie. when applied, components nested inside other components can automatically adjust how they work / are configured)
* 🔨 Switched to using Google’s lit-html JavaScript library to significantly component rendering stability + improved cross-browser support.
* 🔧 Added support for configuring source maps in the @bolt/build-tools tools
* 🐛 Misc bug fixes for the Share component, List component, Navbar component, Grid component, Form / Form labels, cross browser polyfills in @bolt/core, and fixed a major cross-browser issue on the docs site impacting the testing / QA process.
* 🐛 Fixed an icon rendering bug in Safari causing certain icons to not display properly.
* 📚Updated the Drupal Lab + Bolt integration example; added the Bolt Button component as a reference.
* 📚Updated the onboarding docs for developers.
* 📚Added docs for the Grid component’s row_gutter and vinset config options

v2.2.0 Docs: https://v2-2-0.boltdesignsystem.com/ <br>
Full release notes: https://github.com/bolt-design-system/bolt/releases/tag/v2.2.0 

---

# Bolt v2.1.x
Released: October 10th, 2018

* 🎉 Added Jest testing coverage to DevOps
* 🎉 Component Rendering Service
* 🐛 Fix for **Band** component double rendering
* 🐛 Better Button Group / Card button rendering
* 🐛 Bolt List, Video, bug fixes

v2.1.0 Docs: https://v2-1-0.boltdesignsystem.com/ <br>
Full release notes: https://github.com/bolt-design-system/bolt/releases/tag/v2.1.0 

---

# Bolt v2.0.x Release
Released: September 27, 2018

* 🎉 Major overhaul of Bolt’s theming system! 
  * Through some automation magic, Bolt’s color theming system now works in older browsers that don’t support native CSS custom properties.
* 🎉 Added the new CSS Grid-based Grid component
* ✨ Updated the **Share** component to support new `size` and `opacity` options
* ✨ Updated the **Band** component to use the new **Grid** component internally. 
  * This adds new “pinned” regions to the Band, allowing for components to be placed before / after the main Band content area.
* 🔨 Refactored the **Copy To Clipboard** component to greatly improve flexibility & reuse + improve animations.
* ✨ Updated the **Navbar** component to support nesting additional components next to the main Navbar title.
* ✨ Updated the **Nav Priority** component’s dropdown to now animate individual items when opening / closing the menu.
* ✨ Updated the Build Tools to support ~hot module reloading~ + faster build times
* ✅ Added end-to-end integration tests for the **Video** component
* ✨ Updated the **Chip**, **Pagination**, and **Priority Nav** components to now fully support Bolt’s color ~theming system~.
* ✨ Updated the **Button** component to use the browser’s ~native <slot>s~ and ~Shadow DOM~ when supported
* 🐛 Fixed new Bolt **Text** component’s dynamic HTML tag
* 💥 Removed `medium` theme due to accessibility issues + need to refactor
* ✨ Shadow DOM component ~event binding~

v2.0.0 Docs: https://v2-0-0.boltdesignsystem.com/ <br>
Release notes: https://github.com/bolt-design-system/bolt/releases/tag/v2.0.0 
