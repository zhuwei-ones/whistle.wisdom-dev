const Webpack = require("webpack");
const Path = require("path");
const sveltePreprocess = require("svelte-preprocess");
const pkg = require("./package.json");

module.exports = (_, argv) => {
  const isDev = argv.mode === "development";

  const plugins = [
    new Webpack.DefinePlugin({
      __VERSION__: JSON.stringify(pkg.version)
    })
  ];

  if (isDev) {
    plugins.push({
      apply: (compiler) => {
        compiler.hooks.done.tap("DeclarationEmitter", () => {
          //   execSync("npm run build:typings");
          console.log("ok");
        });
      }
    });
  }

  return {
    mode: argv.mode,
    devtool: false,
    entry: {
      index: Path.resolve(__dirname, "./src/client/index.ts")
    },
    target: ["web", "es5"],
    output: {
      path: Path.resolve(__dirname, "./dist/client"),
      filename: "wisdom-dev.min.js",
      library: {
        name: "wisdom-dev",
        type: "umd",
        umdNamedDefine: true,
        export: "default"
      },
      globalObject: "this || self"
    },
    resolve: {
      extensions: [".css", ".ts", ".js", ".html", ".less", ".mjs", ".svelte"],
      alias: {
        svelte: Path.resolve("node_modules", "svelte"),
        const: Path.resolve("src/client/const"),
        lib: Path.resolve("src/client/lib"),
        components: Path.resolve("src/client/components")
      },
      mainFields: ["svelte", "browser", "module", "main"]
    },
    module: {
      rules: [
        {
          test: /\.(js|ts)$/,
          use: [{ loader: "babel-loader" }]
        },
        {
          test: /\.(less|css)$/i,
          use: [
            {
              loader: "style-loader",
              options: { injectType: "lazyStyleTag" }
            },
            { loader: "css-loader" },
            {
              loader: "less-loader",
              options: {
                lessOptions: { math: "always" }
              }
            }
          ]
        },
        {
          test: /\.(svelte)$/,
          use: [
            "babel-loader",
            {
              loader: "svelte-loader",
              options: {
                preprocess: sveltePreprocess({
                  sourceMap: isDev
                }),
                compilerOptions: {
                  dev: isDev,
                  accessors: true
                },
                emitCss: true,
                hotReload: false
              }
            }
          ]
        },
        {
          // required to prevent errors from Svelte on Webpack 5+, omit on Webpack 4
          test: /node_modules[\\/]svelte[\\/].*\.m?js$/,
          resolve: {
            fullySpecified: false
          },
          use: ["babel-loader"]
        }
      ]
    },
    stats: {
      colors: true,
      errorDetails: true
    },
    optimization: {
      minimize: !isDev
    },
    watchOptions: {
      ignored: ["**/node_modules"]
    },
    plugins
  };
};
