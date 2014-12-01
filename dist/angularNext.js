System.register("angularNext", [], function() {
  "use strict";
  var __moduleName = "angularNext";
  var Directive = System.get("directive").default;
  var Component = System.get("component").default;
  var rootDir;
  window.bootstrap = (function(component, moduleName) {
    rootDir = component;
    var rootDirAnno = getDirAnno(rootDir);
    var rootElement = document.querySelector(rootDirAnno.selector);
    angular.element(rootElement).ready(function() {
      angular.bootstrap(rootElement, [moduleName]);
    });
  });
  var getDirAnno = function(directive) {
    var dirAnnos = directive.annotations.filter((function(annotation) {
      return annotation instanceof Directive;
    }));
    return dirAnnos.length ? dirAnnos[0] : undefined;
  };
  var app = angular.module('angularNext', []);
  app.config(function($compileProvider) {
    walkDependencies(rootDir, $compileProvider);
  });
  var walkDependencies = function(dir, $compileProvider) {
    var dirAnno = getDirAnno(dir);
    registerDirective($compileProvider, dirAnno, dir);
    if (dirAnno.directives) {
      dirAnno.directives.forEach((function(childDir) {
        walkDependencies(childDir, $compileProvider);
      }));
    }
  };
  var registerDirective = function($compileProvider, dirAnno, dir) {
    var restrict;
    var dashesDirectiveName;
    var match;
    if (match = dirAnno.selector.match(/^\[(.*)\]$/)) {
      restrict = 'A';
      dashesDirectiveName = match[1];
    } else if (match = dirAnno.selector.match(/^\.(.*)$/)) {
      restrict = 'C';
      dashesDirectiveName = match[1];
    } else {
      restrict = 'E';
      dashesDirectiveName = dirAnno.selector;
    }
    var camelDirectiveName = dashesDirectiveName.replace(/-([a-z])/g, (function(char) {
      return char[1].toUpperCase();
    }));
    $compileProvider.directive(camelDirectiveName, function() {
      return {
        restrict: restrict,
        template: dirAnno.template,
        controller: dir,
        controllerAs: dirAnno.controllerAs,
        scope: {}
      };
    });
  };
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
    this.directives = options.directives;
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