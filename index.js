/**
 * @type {import('postcss').PluginCreator}
 */

const { root } = require("postcss");

// mode: 'in-place' | 'append'
module.exports = (opts = { mode: "in-place" }) => {
  const { mode = "in-place" } = opts;

  let clone;
  let somethingToDo = false;

  const rewrite = (selector) => {
    [...selector.matchAll(/:active-view-transition-type\(([^)]*)\)/g)].forEach(
      ([match, types]) => {
        selector = selector.replace(
          match,
          `${mode === "append" ? "/*vtbag*/" : ""}:root:where(${types
            .split(",")
            .map((type) => `.vtbag-vtt-${type.trim()}`)
            .join(", ")})`
        );
      }
    );

    [...selector.matchAll(/:active-view-transition/g)].forEach(([match]) => {
      selector = selector.replace(match, `${mode === "append" ? "/*vtbag*/" : ""}:root:where(.vtbag-vtt-0)`);
    });
    return selector;
  };

  return {
    postcssPlugin: "postcss-active-view-transition-type",
    Once(root) {
      const text = root.toString();
      somethingToDo =
        text.includes(":active-view-transition") &&
        !text.includes("/*vtbag*/:root:where(.vtbag-vtt-"); /* already rewritten */
      clone = mode === "append" ? root.clone() : undefined;
    },
    Rule(rule) {
      if (somethingToDo) rule.selectors = rule.selectors.map(rewrite);
    },
    OnceExit(root) {
      clone && somethingToDo && root.first.before(clone);
    },
  };
};

module.exports.postcss = true;
