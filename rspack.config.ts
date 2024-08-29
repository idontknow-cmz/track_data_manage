import { defineConfig } from "@rspack/cli";
import { type RspackPluginFunction, rspack } from "@rspack/core";
import { VueLoaderPlugin } from "vue-loader";

import mockServer from "./mock";

const isMock = process.env.NODE_ENV === "development";

export default defineConfig({
  context: __dirname,
  entry: {
    main: "./src/index.ts",
  },
  devServer: {
    open: true,
    port: "3300",
    headers: {
      "Access-Control-Allow-Origin": "*", // 微服务跨域访问
    },
    historyApiFallback: true,
    setupMiddlewares: (middlewares, devServer) => {
      if (!devServer?.app) {
        throw new Error("devServer is not defined");
      }
      if (isMock) mockServer(devServer?.app);
      return middlewares;
    },
  },
  resolve: {
    extensions: ["...", ".ts", ".vue"],
    alias: {
      "@": require("path").resolve(__dirname, "./src"),
    },
  },
  plugins: [
    new VueLoaderPlugin() as RspackPluginFunction,
    new rspack.HtmlRspackPlugin({
      template: "./index.html",
    }),
    new rspack.DefinePlugin({
      __VUE_OPTIONS_API__: true,
      __VUE_PROD_DEVTOOLS__: false,
    }),
  ],
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: "vue-loader",
        options: {
          experimentalInlineMatchResource: true,
        },
      },
      {
        test: /\.(js|ts)$/,
        use: [
          {
            loader: "builtin:swc-loader",
            options: {
              sourceMap: true,
              jsc: {
                parser: {
                  syntax: "typescript",
                },
              },
              env: {
                targets: [
                  "chrome >= 87",
                  "edge >= 88",
                  "firefox >= 78",
                  "safari >= 14",
                ],
              },
            },
          },
        ],
      },
      {
        test: /\.svg/,
        type: "asset/resource",
      },
    ],
  },
  experiments: {
    css: true,
  },
});
