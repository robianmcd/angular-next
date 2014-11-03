"use strict";
var Directive = function Directive(options) {
  this.selector = options.selector;
};
($traceurRuntime.createClass)(Directive, {}, {});
var Component = function Component(options) {
  $traceurRuntime.superCall(this, $Component.prototype, "constructor", [{selector: options.selector}]);
  this.template = options.template;
  this.templateUrl = options.templateUrl;
  this.controllerAs = options.controllerAs;
};
var $Component = Component;
($traceurRuntime.createClass)(Component, {}, {}, Directive);
var Template = function Template(options) {
  $traceurRuntime.superCall(this, $Template.prototype, "constructor", [{selector: options.selector}]);
};
var $Template = Template;
($traceurRuntime.createClass)(Template, {}, {}, Directive);
var Decorator = function Decorator(options) {
  $traceurRuntime.superCall(this, $Decorator.prototype, "constructor", [{selector: options.selector}]);
};
var $Decorator = Decorator;
($traceurRuntime.createClass)(Decorator, {}, {}, Directive);
(function() {
  var app = angular.module('angularNext', []);
  app.config(function($compileProvider) {
    for (var key in window) {
      if (window[$traceurRuntime.toProperty(key)] && window[$traceurRuntime.toProperty(key)].annotations) {
        var annotations = window[$traceurRuntime.toProperty(key)].annotations;
        for (var i = 0; i < annotations.length; i++) {
          if (annotations[$traceurRuntime.toProperty(i)] instanceof Directive) {
            registerDirective($compileProvider, annotations[$traceurRuntime.toProperty(i)], window[$traceurRuntime.toProperty(key)]);
          }
        }
      }
    }
  });
  var registerDirective = function($compileProvider, directiveAnnotation, directiveClass) {
    var restrict;
    var dashesDirectiveName;
    var match;
    if (match = directiveAnnotation.selector.match(/^\[(.*)\]$/)) {
      restrict = 'A';
      dashesDirectiveName = match[1];
    } else if (match = directiveAnnotation.selector.match(/^\.(.*)$/)) {
      restrict = 'C';
      dashesDirectiveName = match[1];
    } else {
      restrict = 'E';
      dashesDirectiveName = directiveAnnotation.selector;
    }
    var camelDirectiveName = dashesDirectiveName.replace(/-([a-z])/g, (function(char) {
      return char[1].toUpperCase();
    }));
    $compileProvider.directive(camelDirectiveName, function() {
      return {
        restrict: restrict,
        template: directiveAnnotation.template,
        controller: directiveClass,
        controllerAs: directiveAnnotation.controllerAs
      };
    });
  };
})();
