module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier"
  ],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  overrides: [],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    project: ["./src/client/tsconfig.json", "./src/server/tsconfig.json"]
  },
  rules: {
    "no-continue": "off",
    "no-console": "off"
  },
  ignorePatterns: [
    "__tests__/**",
    "dist/**",
    "src/**/*.test.js",
    "*.js",
    "public/**"
  ]
};
