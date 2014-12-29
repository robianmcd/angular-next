System.register("components/base/baseComponent", ["core/core", "decorators/backgroundColor", "services/colorUtil", "components/colorSettings/ng2ColorSettings"], function($__export) {
  "use strict";
  var __moduleName = "components/base/baseComponent";
  function require(path) {
    return $traceurRuntime.require("components/base/baseComponent", path);
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
      TemplateConfig = m.TemplateConfig;
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
              url: 'components/base/baseComponent.html',
              directives: [BackgroundColor, Ng2ColorSettings]
            })
          })];
        }});
      $__export('default', BaseComponent);
    }
  };
});
