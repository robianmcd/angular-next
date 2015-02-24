System.register(["angular2/angular2.js"], function($__export) {
  "use strict";
  var bootstrap,
      Component,
      Template,
      HelloComponent;
  function main() {
    angular.module('myApp', []);
    bootstrap(HelloComponent, {moduleName: 'myApp'});
  }
  $__export("main", main);
  return {
    setters: [function(m) {
      bootstrap = m.bootstrap;
      Component = m.Component;
      Template = m.Template;
    }],
    execute: function() {
      HelloComponent = (function() {
        var HelloComponent = function HelloComponent() {
          this.message = 'Hello World';
        };
        return ($traceurRuntime.createClass)(HelloComponent, {}, {});
      }());
      Object.defineProperty(HelloComponent, "annotations", {get: function() {
          return [new Component({selector: 'hello-component'}), new Template({inline: '<h1>{{ctrl.message}}</h1>'})];
        }});
    }
  };
});
