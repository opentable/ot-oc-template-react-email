"use strict";

const async = require("async");
const compiler = require("oc-webpack").compiler;
const fs = require("fs-extra");
const hashBuilder = require("oc-hash-builder");
const MemoryFS = require("memory-fs");
const ocViewWrapper = require("oc-view-wrapper");
const path = require("path");
const reactComponentWrapper = require("oc-react-component-wrapper");
const strings = require("oc-templates-messages");

const webpackConfigurator = require("./to-abstract-base-template-utils/webpackConfigurator");
const fontFamilyUnicodeParser = require("./to-abstract-base-template-utils/font-family-unicode-parser");
const reactOCProviderTemplate = require("./reactOCProviderTemplate");
const viewTemplate = require("./viewTemplate");

module.exports = (options, callback) => {
  const viewFileName = options.componentPackage.oc.files.template.src;
  let viewPath = path.join(options.componentPath, viewFileName);
  if (process.platform === "win32") {
    viewPath = viewPath.split("\\").join("\\\\");
  }
  const publishPath = options.publishPath;
  const publishFileName = options.publishFileName || "template.js";
  const componentPackage = options.componentPackage;
  const { getInfo } = require("../index");
  const externals = getInfo().externals;
  const production = options.production;

  const reactOCProviderContent = reactOCProviderTemplate({ viewPath });
  const reactOCProviderName = "reactOCProvider.js";
  const reactOCProviderPath = path.join(
    publishPath,
    "temp",
    reactOCProviderName
  );

  const compile = (options, cb) => {
    const config = webpackConfigurator({
      viewPath: options.viewPath,
      externals: externals.reduce((externals, dep) => {
        externals[dep.name] = dep.global;
        return externals;
      }, {}),
      publishFileName,
      production,
      buildIncludes: componentPackage.oc.files.template.buildIncludes || []
    });
    compiler(config, (err, data) => {
      if (err) {
        return cb(err);
      }

      const memoryFs = new MemoryFS(data);
      const bundle = memoryFs.readFileSync(
        `/build/${config.output.filename}`,
        "UTF8"
      );

      const bundleHash = hashBuilder.fromString(bundle);
      const bundleName = "react-component";
      const bundlePath = path.join(publishPath, `${bundleName}.js`);
      const wrappedBundle = reactComponentWrapper(bundleHash, bundle);
      fs.outputFileSync(bundlePath, wrappedBundle);

      const reactRoot = `oc-reactRoot-${componentPackage.name}`;
      const templateString = viewTemplate({
        reactRoot,
        externals,
        bundleHash,
        bundleName
      });

      const viewTemplateCompressed = production
        ? templateString.replace(/\s+/g, " ")
        : templateString;
      const hash = hashBuilder.fromString(viewTemplateCompressed);
      const view = ocViewWrapper(hash, viewTemplateCompressed);
      return cb(null, {
        template: { view, hash },
        bundle: { hash: bundleHash }
      });
    });
  };

  async.waterfall(
    [
      next => fs.outputFile(reactOCProviderPath, reactOCProviderContent, next),
      next => compile({ viewPath: reactOCProviderPath }, next),
      (compiled, next) =>
        fs.remove(reactOCProviderPath, err => next(err, compiled)),
      (compiled, next) => fs.ensureDir(publishPath, err => next(err, compiled)),
      (compiled, next) =>
        fs.writeFile(
          path.join(publishPath, publishFileName),
          compiled.template.view,
          err => next(err, compiled)
        )
    ],
    (err, compiled) => {
      if (err) {
        return callback(strings.errors.compilationFailed(viewFileName, err));
      }
      callback(null, {
        template: {
          type: options.componentPackage.oc.files.template.type,
          hashKey: compiled.template.hash,
          src: publishFileName
        },
        bundle: { hashKey: compiled.bundle.hash }
      });
    }
  );
};
