module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  // update the extensions
  extends: ["eslint:recommended", "airbnb-base", "prettier"],
  rules: {
    "no-undersore-dangle": ["error", { allow: ["foo_", "_bar"] }],
  },
  overrides: [],
  parserOptions: {
    ecmaVersion: "latest",
  },
};
