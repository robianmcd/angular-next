System.register("app", ["core/core", "components/base/baseComponent"], function($__export) {
  "use strict";
  var __moduleName = "app";
  function require(path) {
    return $traceurRuntime.require("app", path);
  }
  var bootstrap,
      BaseComponent;
  function main() {
    bootstrap(BaseComponent, {moduleName: 'colorSlider'});
  }
  $__export("main", main);
  return {
    setters: [function(m) {
      bootstrap = m.bootstrap;
    }, function(m) {
      BaseComponent = m.default;
    }],
    execute: function() {
    }
  };
});
