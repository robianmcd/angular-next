System.register("ng2ColorSettings", ["assert", "component", "templateConfig", "backgroundColor", "colorUtil", "baseComponent", "injectNgOne"], function($__export) {
  "use strict";
  var __moduleName = "ng2ColorSettings";
  function require(path) {
    return $traceurRuntime.require("ng2ColorSettings", path);
  }
  var assert,
      Component,
      TemplateConfig,
      BackgroundColor,
      ColorUtil,
      BaseComponent,
      InjectNgOne,
      Ng2ColorSettings;
  return {
    setters: [function(m) {
      assert = m.assert;
    }, function(m) {
      Component = m.Component;
    }, function(m) {
      TemplateConfig = m.default;
    }, function(m) {
      BackgroundColor = m.default;
    }, function(m) {
      ColorUtil = m.default;
    }, function(m) {
      BaseComponent = m.default;
    }, function(m) {
      InjectNgOne = m.default;
    }],
    execute: function() {
      Ng2ColorSettings = (function() {
        var Ng2ColorSettings = function Ng2ColorSettings(colorUtil, base, $log) {
          assert.argumentTypes(colorUtil, ColorUtil, base, BaseComponent, $log, $traceurRuntime.type.any);
          this.colorUtil = colorUtil;
          this.base = base;
          this.$log = $log;
          this.hue = 0;
        };
        return ($traceurRuntime.createClass)(Ng2ColorSettings, {
          hueToHash: function(hue) {
            return this.colorUtil.hslToHash(hue / 100, 0.7, 0.5);
          },
          setParentColor: function() {
            var hash = this.hueToHash(this.hue);
            this.$log.info(("setting the base component's background color to " + hash));
            this.base.setBackgroundColor(hash);
          }
        }, {});
      }());
      Object.defineProperty(Ng2ColorSettings, "annotations", {get: function() {
          return [new Component({
            selector: 'ng2-color-settings',
            template: new TemplateConfig({
              url: 'colorSettings.html',
              directives: []
            })
          })];
        }});
      Object.defineProperty(Ng2ColorSettings, "parameters", {get: function() {
          return [[ColorUtil], [BaseComponent], [new InjectNgOne('$log')]];
        }});
      $__export('default', Ng2ColorSettings);
    }
  };
});
