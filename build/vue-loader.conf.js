"use strict";
const utils = require("./utils");
const config = require("../config");
const isProduction = process.env.NODE_ENV === "production";
const sourceMapEnabled = isProduction
  ? config.build.productionSourceMap
  : config.dev.cssSourceMap;

const path = require("path");

module.exports = {
  chainWebpack: config => {
    config.resolve.alias.set(
      "vue$",
      // Or if using full build of Vue (runtime + compiler)
      path.resolve(__dirname, "node_modules/vue/dist/vue.esm.js")
    );
  }
};
module.exports = {
  loaders: utils.cssLoaders({
    sourceMap: sourceMapEnabled,
    extract: isProduction
  }),
  cssSourceMap: sourceMapEnabled,
  cacheBusting: config.dev.cacheBusting,
  transformToRequire: {
    video: ["src", "poster"],
    source: "src",
    img: "src",
    image: "xlink:href"
  }
};
