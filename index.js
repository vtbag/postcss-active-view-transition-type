/**
 * @type {import('postcss').PluginCreator}
 */
module.exports = (/*opts = {}*/) => {
  const rewrite = (selector) => {
    [...selector.matchAll(/:active-view-transition-type\(([^)]*)\)/g)].forEach(
      ([match, types]) => {
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
    Rule(rule) {
      rule.selectors = rule.selectors.map(rewrite);
    },
  };
};

module.exports.postcss = true;
