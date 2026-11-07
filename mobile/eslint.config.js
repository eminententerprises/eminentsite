// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ["dist/*", ".expo/*", "node_modules/*"],
  },
  {
    rules: {
      // HTML-entity escaping is a DOM concern; apostrophes render fine in React Native <Text>.
      "react/no-unescaped-entities": "off",
    },
  },
]);
