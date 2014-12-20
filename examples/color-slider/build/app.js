System.register("app", ["bootstrap", "component", "templateConfig"], function($__export) {
  "use strict";
  var __moduleName = "app";
  function require(path) {
    return $traceurRuntime.require("app", path);
  }
  var bootstrap,
      Component,
      TemplateConfig,
      BaseComponent;
  function main() {
    angular.module('colorSlider', []);
    bootstrap(BaseComponent, {moduleName: 'colorSlider'});
  }
  $__export("main", main);
  return {
    setters: [function(m) {
      bootstrap = m.default;
    }, function(m) {
      Component = m.Component;
    }, function(m) {
      TemplateConfig = m.default;
    }],
    execute: function() {
      BaseComponent = (function() {
        var BaseComponent = function BaseComponent() {};
        return ($traceurRuntime.createClass)(BaseComponent, {}, {});
      }());
      Object.defineProperty(BaseComponent, "annotations", {get: function() {
          return [new Component({
            selector: 'base-component',
            template: new TemplateConfig({url: 'base.html'})
          })];
        }});
    }
  };
});
