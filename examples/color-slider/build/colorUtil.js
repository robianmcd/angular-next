System.register("colorUtil", [], function($__export) {
  "use strict";
  var __moduleName = "colorUtil";
  function require(path) {
    return $traceurRuntime.require("colorUtil", path);
  }
  var ColorUtil;
  return {
    setters: [],
    execute: function() {
      ColorUtil = (function() {
        var ColorUtil = function ColorUtil() {};
        return ($traceurRuntime.createClass)(ColorUtil, {
          hslToRgb: function(h, s, l) {
            var r,
                g,
                b;
            if (s == 0) {
              r = g = b = l;
            } else {
              var hue2rgb = function(p, q, t) {
                if (t < 0)
                  t += 1;
                if (t > 1)
                  t -= 1;
                if (t < 1 / 6)
                  return p + (q - p) * 6 * t;
                if (t < 1 / 2)
                  return q;
                if (t < 2 / 3)
                  return p + (q - p) * (2 / 3 - t) * 6;
                return p;
              };
              var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
              var p = 2 * l - q;
              r = hue2rgb(p, q, h + 1 / 3);
              g = hue2rgb(p, q, h);
              b = hue2rgb(p, q, h - 1 / 3);
            }
            return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
          },
          hslToHash: function(h, s, l) {
            var $__1;
            return ($__1 = this).rgbToHash.apply($__1, $traceurRuntime.spread(this.hslToRgb(h, s, l)));
          },
          rgbToHash: function(r, g, b) {
            return ("#" + r.toString(16) + g.toString(16) + b.toString(16));
          }
        }, {});
      }());
      $__export('default', ColorUtil);
    }
  };
});
