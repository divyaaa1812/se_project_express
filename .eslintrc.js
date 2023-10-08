module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  // update the extensions
  extends: ["eslint:recommended", "airbnb-base", "prettier"],
  rules: {
    "no-underscore-dangle": "off",
  },
  overrides: [],
  parserOptions: {
    ecmaVersion: "latest",
  },
};
