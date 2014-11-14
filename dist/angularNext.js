System.register("angularNext", [], function() {
  "use strict";
  var __moduleName = "angularNext";
  var Directive = System.get("directive").default;
  var Component = System.get("component").default;
  var directives = [];
  angular.register = function(directive) {
    directives.push(directive);
  };
  (function() {
    var app = angular.module('angularNext', []);
    app.config(function($compileProvider) {
      directives.forEach((function(directive) {
        if (directive.annotations) {
          var annotations = directive.annotations;
          for (var i = 0; i < annotations.length; i++) {
            if (annotations[i] instanceof Directive) {
              registerDirective($compileProvider, annotations[i], directive);
            }
          }
        }
      }));
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
  return {};
});

System.register("component", [], function() {
  "use strict";
  var __moduleName = "component";
  var Directive = System.get("directive").default;
  var Component = function Component(options) {
    $traceurRuntime.superCall(this, $Component.prototype, "constructor", [{selector: options.selector}]);
    this.template = options.template;
    this.templateUrl = options.templateUrl;
    this.controllerAs = options.controllerAs;
  };
  var $Component = Component;
  ($traceurRuntime.createClass)(Component, {}, {}, Directive);
  var $__default = Component;
  return {get default() {
      return $__default;
    }};
});

System.register("decorator", [], function() {
  "use strict";
  var __moduleName = "decorator";
  var Directive = System.get("directive").default;
  var Decorator = function Decorator(options) {
    $traceurRuntime.superCall(this, $Decorator.prototype, "constructor", [{selector: options.selector}]);
  };
  var $Decorator = Decorator;
  ($traceurRuntime.createClass)(Decorator, {}, {}, Directive);
  var $__default = Decorator;
  return {get default() {
      return $__default;
    }};
});

System.register("directive", [], function() {
  "use strict";
  var __moduleName = "directive";
  var Directive = function Directive(options) {
    this.selector = options.selector;
  };
  ($traceurRuntime.createClass)(Directive, {}, {});
  var $__default = Directive;
  return {get default() {
      return $__default;
    }};
});

System.register("template", [], function() {
  "use strict";
  var __moduleName = "template";
  var Directive = System.get("directive").default;
  var Template = function Template(options) {
    $traceurRuntime.superCall(this, $Template.prototype, "constructor", [{selector: options.selector}]);
  };
  var $Template = Template;
  ($traceurRuntime.createClass)(Template, {}, {}, Directive);
  var $__default = Template;
  return {get default() {
      return $__default;
    }};
});
System.get("angularNext" + "");