# PostCSS active-view-transition-type

In combination with [`mayStartViewTransition()`](https://vtbag.dev/tools/utensil-drawer/#maystartviewtransition) from `@vtbag/utensil-drawer`, this [PostCSS](https://github.com/postcss/postcss) plugin provides a polyfill for view transition types as defined by Level 2 of the View Transition API.

![Build Status](https://github.com/vtbag/postcss-active-view-transition-type/actions/workflows/run-build.yml/badge.svg)
[![npm version](https://img.shields.io/npm/v/postcss-active-view-transition-type/latest)](
https://www.npmjs.com/package/postcss-active-view-transition-type)
![minzip](https://badgen.net/bundlephobia/minzip/postcss-active-view-transition-type)
[![NPM Downloads](https://img.shields.io/npm/dw/postcss-active-view-transition-type)](https://www.npmjs.com/package/postcss-active-view-transition-type)

This makes it possible to use view transition types with browser versions that support Level 1 of the View Transition API, only.

The plugin replaces `:active-view-transition-type(x)` pseudo class selectors with `:root.vtbag-vtt-x`, i.e. selectors that check for a CSS class named `vtbag-vtt-x` on the root element. The `vtbag-vtt-` prefix is added to avoid name clashes with regular CSS classes.

To automatically insert those CSS classes during same-document view transitions, replace calls to `document.startViewTransition()` with calls to [`mayStartViewTransition()`](https://vtbag.dev/tools/utensil-drawer/#maystartviewtransition) from the Bag's [`utensil-drawer`](https://vtbag.dev/tools/utensil-drawer) and add the [`useTypesPolyfill: "always"`](https://vtbag.dev/tools/utensil-drawer/#usetypespolyfill-always--auto--never) extension.

The plugin can operate in two different modes:
* **in-place**: This is the default. Directly rewrites the selectors in place.
* **append**: Keeps the existing rules as is, but appends a copy with rewritten selectors. (If rules were rewritten).

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
:root.vtbag-vtt-toggle-view {
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
:root.vtbag-vtt-0 {
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
:root.vtbag-vtt-toggle-view {
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
:root.vtbag-vtt-0 {
  #element {
    view-transition-name: element;
  }
}
```

See [PostCSS](https://github.com/postcss/postcss) docs for examples for your environment.