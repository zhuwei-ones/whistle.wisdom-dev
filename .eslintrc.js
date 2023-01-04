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
  plugins: ["svelte3", "@typescript-eslint"],
  overrides: [
    {
      files: ["*.svelte"],
      processor: "svelte3/svelte3"
    }
  ],

  settings: {
    "svelte3/typescript": require("typescript"),
    // ignore style tags in Svelte because of Tailwind CSS
    // See https://github.com/sveltejs/eslint-plugin-svelte3/issues/70
    "svelte3/ignore-styles": () => true
  },
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
