/**
 * @type {import('postcss').PluginCreator}
 */

const { root } = require("postcss");

// mode: 'in-place' | 'append'
module.exports = (opts = { mode: "in-place" }) => {
  const { mode = "in-place" } = opts;
  
  let clone;
  let doAppend = false;

  const rewrite = (selector) => {
    [...selector.matchAll(/:active-view-transition-type\(([^)]*)\)/g)].forEach(
      ([match, types]) => {
        doAppend = true;
        selector = selector.replace(
          match,
          `:root${
            types.includes(",")
              ? `:is(${types
                  .split(",")
                  .map((type) => `.vtbag-vtt-${type.trim()}`)
                  .join(", ")})`
              : `.vtbag-vtt-${types.trim()}`
          }`
        );
      }
    );

    [...selector.matchAll(/:active-view-transition/g)].forEach(([match]) => {
      selector = selector.replace(match, `:root.vtbag-vtt-0`);
    });
    return selector;
  };

  return {
    postcssPlugin: "postcss-active-view-transition-type",
    Once(root) {
      clone = mode === "append" ? root.clone() : undefined;
    },
    Rule(rule) {
      rule.selectors = rule.selectors.map(rewrite);
    },
    OnceExit(root) {
      clone && doAppend &&
        clone.each((child) => {
          root.first.before(child);
        });
    },
  };
};

module.exports.postcss = true;
