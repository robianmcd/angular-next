System.register("baseComponent", ["component", "templateConfig", "backgroundColor", "colorUtil", "ng2ColorSettings"], function($__export) {
  "use strict";
  var __moduleName = "baseComponent";
  function require(path) {
    return $traceurRuntime.require("baseComponent", path);
  }
  var Component,
      TemplateConfig,
      BackgroundColor,
      ColorUtil,
      Ng2ColorSettings,
      BaseComponent;
  return {
    setters: [function(m) {
      Component = m.Component;
    }, function(m) {
      TemplateConfig = m.default;
    }, function(m) {
      BackgroundColor = m.default;
    }, function(m) {
      ColorUtil = m.default;
    }, function(m) {
      Ng2ColorSettings = m.default;
    }],
    execute: function() {
      BaseComponent = (function() {
        var BaseComponent = function BaseComponent() {
          this.backgroundColor = '#fff';
        };
        return ($traceurRuntime.createClass)(BaseComponent, {setBackgroundColor: function(hash) {
            this.backgroundColor = hash;
          }}, {});
      }());
      Object.defineProperty(BaseComponent, "annotations", {get: function() {
          return [new Component({
            selector: 'base-component',
            componentServices: [ColorUtil],
            template: new TemplateConfig({
              url: 'base.html',
              directives: [BackgroundColor, Ng2ColorSettings]
            })
          })];
        }});
      $__export('default', BaseComponent);
    }
  };
});
