/**
 * @type {import('postcss').PluginCreator}
 */

// mode: 'in-place' | 'append'
module.exports = (opts = { mode: "in-place" }) => {
  const { mode = "in-place" } = opts;

  let map;

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
      selector = selector.replace(
        match,
        `${mode === "append" ? "/*vtbag*/" : ""}:root:where(.vtbag-vtt-0)`
      );
    });
    return selector;
  };

  return {
    postcssPlugin: "postcss-active-view-transition-type",
    Once(root) {
      map = root.toString().includes("/*vtbag*/:root:where(.vtbag-vtt-")
        ? null
        : new Map();
    },
    Rule(rule) {
      if (map) {
        const parentType = rule.parent.type;
        if (
          (parentType === "root" || parentType === "atrule") &&
          rule.toString().includes(":active-view-transition")
        )
          mode === "append" &&
            map.set(rule.toString(), { rule, clone: rule.clone() });

        rule.selectors = rule.selectors.map(rewrite);
      }
    },
    OnceExit() {
      map?.forEach((data) => data.rule.before(data.clone));
      map = undefined;
    },
  };
};

module.exports.postcss = true;
