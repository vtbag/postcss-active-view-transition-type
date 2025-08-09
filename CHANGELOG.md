# postcss-active-view-transition-type

## 0.0.6 - 2025-08-09

### Patch Changes

- befbf8d: Reduces the number of rules that get copied when setting mode to "append"

## 0.0.5 - 2025-08-08

### Patch Changes

- 44bdd4b: Improves specificity and avoids multiple copies with mode === append

  The `:active-view-transition...` selectors are now rewritten to `:root.where(...)`. This ensures that the rewritten selectors have the same specificity as the original selector.

  When the plugin was repeatedly called with mode === "append" CSS could double each time. Now the plugin ignores stylesheets that already contain a `/*vtbag*/:root:where(` pattern, which is what the plugin emits when called in append mode. This way, plugin results won't be re-transformed when fed back to the plugin.

## 0.0.4 - 2025-07-20

### Patch Changes

- 8464083: Adds a `mode: 'append'` option that appends the rewritten rules to the existing stylesheet instead of replacing the original rules.

## 0.0.3 - 2025-07-17

### Patch Changes

- 37867b4: Updated badges in README. Does not include any content changes to the code.

## 0.0.2 - 2025-07-16

### Patch Changes

- ab0d0f1: Provides name-spacing by prepending "vtbag-" to the class names.
- ab0d0f1: Adds `-vtt-` to class prefix and now also maps `:active-view-transition` to `vtbag-vtt-0`

## 0.0.1 - 2025-07-14

### Patch Changes

- 2da9d87: Initial revision
