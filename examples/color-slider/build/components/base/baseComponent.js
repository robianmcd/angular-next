System.register("components/base/baseComponent.js", ["angular2/angular2.js", "decorators/backgroundColor.js", "services/colorUtil.js", "components/colorSettings/ng2ColorSettings.js"], function($__export) {
  "use strict";
  var __moduleName = "components/base/baseComponent.js";
  var Component,
      Template,
      BackgroundColor,
      ColorUtil,
      Ng2ColorSettings,
      BaseComponent;
  return {
    setters: [function(m) {
      Component = m.Component;
      Template = m.Template;
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
            componentServices: [ColorUtil]
          }), new Template({
            url: 'components/base/baseComponent.html',
            directives: [BackgroundColor, Ng2ColorSettings]
          })];
        }});
      $__export('default', BaseComponent);
    }
  };
});
//# sourceURL=components/base/baseComponent.js