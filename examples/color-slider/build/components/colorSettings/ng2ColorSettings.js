System.register("components/colorSettings/ng2ColorSettings.js", ["assert.js", "angular/angular.js", "decorators/backgroundColor.js", "services/colorUtil.js", "components/base/baseComponent.js"], function($__export) {
  "use strict";
  var __moduleName = "components/colorSettings/ng2ColorSettings.js";
  var assert,
      Component,
      TemplateConfig,
      InjectNgOne,
      BackgroundColor,
      ColorUtil,
      BaseComponent,
      Ng2ColorSettings;
  return {
    setters: [function(m) {
      assert = m.assert;
    }, function(m) {
      Component = m.Component;
      TemplateConfig = m.TemplateConfig;
      InjectNgOne = m.InjectNgOne;
    }, function(m) {
      BackgroundColor = m.default;
    }, function(m) {
      ColorUtil = m.default;
    }, function(m) {
      BaseComponent = m.default;
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
            return this.colorUtil.hslToHash(hue / 100, 0.8, 0.5);
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
              url: 'components/colorSettings/colorSettings.html',
              directives: [BackgroundColor]
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
//# sourceURL=components/colorSettings/ng2ColorSettings.js