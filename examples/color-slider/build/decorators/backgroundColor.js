System.register("decorators/backgroundColor", ["assert", "core/core"], function($__export) {
  "use strict";
  var __moduleName = "decorators/backgroundColor";
  function require(path) {
    return $traceurRuntime.require("decorators/backgroundColor", path);
  }
  var assert,
      Decorator,
      NgElement,
      BackgroundColor;
  return {
    setters: [function(m) {
      assert = m.assert;
    }, function(m) {
      Decorator = m.Decorator;
      NgElement = m.NgElement;
    }],
    execute: function() {
      BackgroundColor = (function() {
        var BackgroundColor = function BackgroundColor(el) {
          assert.argumentTypes(el, NgElement);
          this.element = el;
          this.onColorChange(this.backgroundColor);
        };
        return ($traceurRuntime.createClass)(BackgroundColor, {onColorChange: function(newValue) {
            this.element.domElement.style['background-color'] = newValue;
          }}, {});
      }());
      Object.defineProperty(BackgroundColor, "annotations", {get: function() {
          return [new Decorator({
            selector: '[background-color]',
            bind: {'backgroundColor': 'backgroundColor'},
            observe: {'backgroundColor': 'onColorChange'}
          })];
        }});
      Object.defineProperty(BackgroundColor, "parameters", {get: function() {
          return [[NgElement]];
        }});
      $__export('default', BackgroundColor);
    }
  };
});
