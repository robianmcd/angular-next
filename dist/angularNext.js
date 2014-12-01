System.register("angularNext", [], function() {
  "use strict";
  var __moduleName = "angularNext";
  function require(path) {
    return $traceurRuntime.require("angularNext", path);
  }
  var Directive = System.get("directive").default;
  var Component = System.get("component").default;
  var rootDir;
  var app;
  window.bootstrap = (function(component, moduleName) {
    rootDir = component;
    app = angular.module(moduleName);
    var rootDirAnno = getDirAnno(rootDir);
    var rootElement = document.querySelector(rootDirAnno.selector);
    angular.element(rootElement).ready(function() {
      walkDependencies(rootDir);
      angular.bootstrap(rootElement, [moduleName]);
    });
  });
  var getDirAnno = function(directive) {
    var dirAnnos = directive.annotations.filter((function(annotation) {
      return annotation instanceof Directive;
    }));
    return dirAnnos.length ? dirAnnos[0] : undefined;
  };
  var lowerCaseFirstLetter = function(str) {
    return str.charAt(0).toLowerCase() + str.slice(1);
  };
  var getFunctionName = function(func) {
    if (func.name) {
      return func.name;
    } else {
      var ret = func.toString();
      ret = ret.substr('function '.length);
      ret = ret.substr(0, ret.indexOf('('));
      return ret;
    }
  };
  var walkDependencies = function(dir) {
    var dirAnno = getDirAnno(dir);
    registerDirective(dir, dirAnno);
    if (dirAnno.componentServices) {
      dirAnno.componentServices.forEach((function(serviceType) {
        app.service(lowerCaseFirstLetter(getFunctionName(serviceType)), serviceType);
      }));
    }
    if (dir.parameters) {
      dir.$inject = [];
      dir.parameters.forEach((function(serviceType) {
        dir.$inject.push(lowerCaseFirstLetter(getFunctionName(serviceType)));
      }));
    }
    if (dirAnno.directives) {
      dirAnno.directives.forEach((function(childDir) {
        walkDependencies(childDir);
      }));
    }
  };
  var registerDirective = function(dir, dirAnno) {
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
    app.directive(camelDirectiveName, function() {
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
  function require(path) {
    return $traceurRuntime.require("component", path);
  }
  var Directive = System.get("directive").default;
  var Component = function Component(options) {
    $traceurRuntime.superConstructor($Component).call(this, {
      selector: options.selector,
      componentServices: options.componentServices
    });
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
  function require(path) {
    return $traceurRuntime.require("decorator", path);
  }
  var Directive = System.get("directive").default;
  var Decorator = function Decorator(options) {
    $traceurRuntime.superConstructor($Decorator).call(this, {selector: options.selector});
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
  function require(path) {
    return $traceurRuntime.require("directive", path);
  }
  var Directive = function Directive(options) {
    this.selector = options.selector;
    this.componentServices = options.componentServices;
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
  function require(path) {
    return $traceurRuntime.require("template", path);
  }
  var Directive = System.get("directive").default;
  var Template = function Template(options) {
    $traceurRuntime.superConstructor($Template).call(this, {selector: options.selector});
  };
  var $Template = Template;
  ($traceurRuntime.createClass)(Template, {}, {}, Directive);
  var $__default = Template;
  return {get default() {
      return $__default;
    }};
});
System.get("angularNext" + "");