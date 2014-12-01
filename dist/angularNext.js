System.register("angular2Adapter", [], function() {
  "use strict";
  var __moduleName = "angular2Adapter";
  function require(path) {
    return $traceurRuntime.require("angular2Adapter", path);
  }
  var Directive = System.get("directive").default;
  var Component = System.get("component").default;
  var Angular2Adapter = function Angular2Adapter($__4) {
    var $__6;
    var $__5 = $__4,
        moduleName = $__5.moduleName,
        logLevel = ($__6 = $__5.logLevel) === void 0 ? 0 : $__6;
    this.moduleName = moduleName;
    this.app = angular.module(moduleName);
    this.logLevel = logLevel;
  };
  ($traceurRuntime.createClass)(Angular2Adapter, {
    bootstrapComponent: function(rootComponent) {
      var $__2 = this;
      var rootComponentAnno = this.getDirAnno(rootComponent);
      var rootElement = document.querySelector(rootComponentAnno.selector);
      angular.element(rootElement).ready((function() {
        $__2.registerDirectiveTree(rootComponent);
        angular.bootstrap(rootElement, [$__2.moduleName]);
      }));
    },
    registerDirectiveTree: function(dir) {
      var $__2 = this;
      var dirAnno = this.getDirAnno(dir);
      this.registerDirective(dir, dirAnno);
      if (dirAnno.template.directives) {
        dirAnno.template.directives.forEach((function(childDir) {
          $__2.registerDirectiveTree(childDir);
        }));
      }
    },
    registerDirective: function(dir, dirAnno) {
      var $__2 = this;
      if (dirAnno.componentServices) {
        dirAnno.componentServices.forEach((function(serviceType) {
          $__2.app.service($__2.lowerCaseFirstLetter($__2.getFunctionName(serviceType)), serviceType);
        }));
      }
      if (dir.parameters) {
        dir.$inject = [];
        dir.parameters.forEach((function(serviceType) {
          dir.$inject.push($__2.lowerCaseFirstLetter($__2.getFunctionName(serviceType)));
        }));
      }
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
      this.app.directive(camelDirectiveName, function() {
        return {
          restrict: restrict,
          template: dirAnno.template.inline,
          controller: dir,
          controllerAs: dirAnno.controllerAs,
          scope: {}
        };
      });
    },
    getDirAnno: function(directive) {
      var dirAnnos = directive.annotations.filter((function(annotation) {
        return annotation instanceof Directive;
      }));
      return dirAnnos.length ? dirAnnos[0] : undefined;
    },
    lowerCaseFirstLetter: function(str) {
      return str.charAt(0).toLowerCase() + str.slice(1);
    },
    getFunctionName: function(func) {
      if (func.name) {
        return func.name;
      } else {
        var ret = func.toString();
        ret = ret.substr('function '.length);
        ret = ret.substr(0, ret.indexOf('('));
        return ret;
      }
    }
  }, {});
  var $__default = Angular2Adapter;
  return {get default() {
      return $__default;
    }};
});

System.register("angularNext", [], function() {
  "use strict";
  var __moduleName = "angularNext";
  function require(path) {
    return $traceurRuntime.require("angularNext", path);
  }
  var Angular2Adapter = System.get("angular2Adapter").default;
  window.bootstrap = (function(component) {
    var config = arguments[1] !== (void 0) ? arguments[1] : {};
    var adapter = new Angular2Adapter(config);
    adapter.bootstrapComponent(component);
  });
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

System.register("templateConfig", [], function() {
  "use strict";
  var __moduleName = "templateConfig";
  function require(path) {
    return $traceurRuntime.require("templateConfig", path);
  }
  var TemplateConfig = function TemplateConfig(options) {
    this.inline = options.inline;
    this.directives = options.directives;
  };
  ($traceurRuntime.createClass)(TemplateConfig, {}, {});
  var $__default = TemplateConfig;
  return {get default() {
      return $__default;
    }};
});
System.get("angularNext" + "");