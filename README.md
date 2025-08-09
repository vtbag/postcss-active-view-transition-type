# PostCSS active-view-transition-type

When used with [`mayStartViewTransition()`](https://vtbag.dev/tools/utensil-drawer/#maystartviewtransition) from `@vtbag/utensil-drawer`, this [PostCSS](https://github.com/postcss/postcss) plugin adds a polyfill for the view transition types defined by Level 2 of the View Transition API, letting you use them even when the browser lacks native support.


When used with mayStartViewTransition() from @vtbag/utensil-drawer, this PostCSS plugin adds a polyfill for the view transition types defined in Level 2 of the View Transition API, letting you use them even when the browser lacks native support.


![Build Status](https://github.com/vtbag/postcss-active-view-transition-type/actions/workflows/run-build.yml/badge.svg)
[![npm version](https://img.shields.io/npm/v/postcss-active-view-transition-type/latest)](
https://www.npmjs.com/package/postcss-active-view-transition-type)
![minzip](https://badgen.net/bundlephobia/minzip/postcss-active-view-transition-type)
[![NPM Downloads](https://img.shields.io/npm/dw/postcss-active-view-transition-type)](https://www.npmjs.com/package/postcss-active-view-transition-type)

This plugin makes it possible to use view transition types with browser versions that support Level 1 of the View Transition API, only, and do not natively support view transition types.

> Latest change: Reduces the number of rules copied when setting mode to append. See the [CHANGELOG](https://github.com/vtbag/postcss-active-view-transition-type/blob/main/CHANGELOG.md).

The plugin replaces `:active-view-transition-type(x)` pseudo class selectors with `:root:where(.vtbag-vtt-x)`, i.e. selectors that check for a CSS class named `vtbag-vtt-x` on the root element. The `vtbag-vtt-` prefix is added to avoid name clashes with regular CSS classes. Starting from version 0.0.5, the `:where()` pseudo class makes sure that the replacement keeps the specificity of the original selector. 

To automatically insert those CSS classes during same-document view transitions, replace calls to `document.startViewTransition()` with calls to [`mayStartViewTransition()`](https://vtbag.dev/tools/utensil-drawer/#maystartviewtransition) from the Bag's [`Utensil Drawer`](https://vtbag.dev/tools/utensil-drawer) and add the `useTypesPolyfill: "always"` (or `"auto"`) [extension](https://vtbag.dev/tools/utensil-drawer/#usetypespolyfill-always--auto--never).

The plugin can operate in two different modes:
* **in-place**: This is the default. Directly rewrites the selectors in place for `useTypesPolyfill: "always"`.
* **append**: Keeps the existing rules as is, and appends a transformed version of the stylesheet, if there is something to rewrite. This is for `useTypesPolyfill: "auto"`, where the polyfill executes only in browsers that do not support view transition types.

## Examples

### Rewrite Rules In-Place
To rewrite rules in place, call the plugin without parameters or use this options object: `{ mode: 'in-place'}`.

####  postcss.config.cjs
```js
postcss([
	require('postcss-active-view-transition-type')
])
```
#### :active-view-transition-type()
```css
/* Input example */
:active-view-transition-type(toggle-view) {
  #element {
    view-transition-name: element;
  }
}
```

```css
/* Output example */
:root:where(.vtbag-vtt-toggle-view) {
  #element {
    view-transition-name: element;
  }
}
```
#### :active-view-transition
```css
/* Input example */
:active-view-transition {
  #element {
    view-transition-name: element;
  }
}
```

```css
/* Output example */
:root:where(.vtbag-vtt-0) {
  #element {
    view-transition-name: element;
  }
}
```

### Append Rewritten Rules
To append the rewritten rules to the original stylesheet, call the plugin with this options object: `{ mode: 'append' }`.

####  postcss.config.cjs
```js
postcss([
	require('postcss-active-view-transition-type')({ mode:'append' })
])
```
#### :active-view-transition-type()
```css
/* Input example */
:active-view-transition-type(toggle-view) {
  #element {
    view-transition-name: element;
  }
}
```

```css
/* Output example */
:active-view-transition-type(toggle-view) {
  #element {
    view-transition-name: element;
  }
}
:root:where(.vtbag-vtt-toggle-view) {
  #element {
    view-transition-name: element;
  }
}
```
#### :active-view-transition
```css
/* Input example */
:active-view-transition {
  #element {
    view-transition-name: element;
  }
}
```

```css
/* Output example */
:active-view-transition {
  #element {
    view-transition-name: element;
  }
}
:root.where(.vtbag-vtt-0) {
  #element {
    view-transition-name: element;
  }
}
```

See [PostCSS](https://github.com/postcss/postcss) docs for examples for your environment.