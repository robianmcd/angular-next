System.register("app.js", ["angular2/angular2.js", "components/base/baseComponent.js"], function($__export) {
  "use strict";
  var __moduleName = "app.js";
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
//# sourceURL=app.js