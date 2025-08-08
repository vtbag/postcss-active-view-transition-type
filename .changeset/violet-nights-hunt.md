---
"postcss-active-view-transition-type": patch
---

Improves specificity and avoids multiple copies with mode === append

The `:active-view-transition...` selectors are now rewritten to `:root.where(...)`. This ensures that the rewritten selectors have the same specificity as the original selector.

When the plugin was repeatedly called with mode === "append" CSS could double each time. Now the plugin ignores stylesheets that already contain a `/*vtbag*/:root:where(` pattern, which is what the plugin emits when called in append mode. This way, plugin results won't be re-transformed when fed back to the plugin. 
