System.register(["bootstrap", "component", "templateConfig"], function($__export) {
  "use strict";
  var bootstrap,
      Component,
      TemplateConfig,
      HelloComponent;
  function main() {
    angular.module('myApp', []);
    bootstrap(HelloComponent, {moduleName: 'myApp'});
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
      HelloComponent = (function() {
        var HelloComponent = function HelloComponent() {
          this.message = 'Hello World';
        };
        return ($traceurRuntime.createClass)(HelloComponent, {}, {});
      }());
      Object.defineProperty(HelloComponent, "annotations", {get: function() {
          return [new Component({
            selector: 'hello-component',
            template: new TemplateConfig({inline: '<h1>{{ctrl.message}}</h1>'})
          })];
        }});
    }
  };
});
