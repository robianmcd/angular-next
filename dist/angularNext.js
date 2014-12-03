System.register("angular2Adapter", [], function() {
  "use strict";
  var __moduleName = "angular2Adapter";
  function require(path) {
    return $traceurRuntime.require("angular2Adapter", path);
  }
  var Directive = System.get("directive").default;
  var Component = System.get("component").default;
  var NgElement = System.get("core/ngElement").default;
  var $element = System.get("ng1/element").default;
  var Angular2Adapter = function Angular2Adapter($__7) {
    var $__9;
    var $__8 = $__7,
        moduleName = $__8.moduleName,
        logLevel = ($__9 = $__8.logLevel) === void 0 ? 0 : $__9;
    this.moduleName = moduleName;
    this.app = angular.module(moduleName);
    this.logLevel = logLevel;
  };
  ($traceurRuntime.createClass)(Angular2Adapter, {
    bootstrapComponent: function(rootComponent) {
      var $__4 = this;
      var rootComponentAnno = this.getDirAnno(rootComponent);
      var rootElement = document.querySelector(rootComponentAnno.selector);
      angular.element(rootElement).ready((function() {
        $__4.registerDirectiveTree(rootComponent);
        angular.bootstrap(rootElement, [$__4.moduleName]);
      }));
    },
    registerDirectiveTree: function(dir) {
      var $__4 = this;
      var dirAnno = this.getDirAnno(dir);
      this.registerDirective(dir);
      if (dirAnno.template.directives) {
        dirAnno.template.directives.forEach((function(childDir) {
          $__4.registerDirectiveTree(childDir);
        }));
      }
    },
    registerDirective: function(dir) {
      var $__4 = this;
      dir = this.getDirWithInjectableServices(dir);
      this.setupModelDi(dir);
      var dirAnno = this.getDirAnno(dir);
      if (dirAnno.componentServices) {
        dirAnno.componentServices.forEach((function(serviceType) {
          $__4.setupModelDi(serviceType);
          $__4.app.service($__4.lowerCaseFirstLetter($__4.getFunctionName(serviceType)), serviceType);
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
    getDirWithInjectableServices: function(dirType) {
      var retDirType = dirType;
      if (dirType.parameters) {
        var nonElementBasedServices = [];
        var ngElementPos = -1;
        for (var i = 0; i < dirType.parameters.length; i++) {
          var curParamType = dirType.parameters[i][0];
          if (curParamType === NgElement) {
            ngElementPos = i;
          } else {
            nonElementBasedServices.push(curParamType);
          }
        }
        if (ngElementPos !== -1) {
          retDirType = function(element) {
            for (var args = [],
                $__6 = 1; $__6 < arguments.length; $__6++)
              args[$__6 - 1] = arguments[$__6];
            var origDirParams = angular.copy(args);
            if (ngElementPos !== -1) {
              var ngElement = new NgElement(element);
              origDirParams.splice(ngElementPos, 0, ngElement);
            }
            dirType.apply(this, origDirParams);
          };
          retDirType.prototype = Object.create(dirType.prototype);
          retDirType.annotations = dirType.annotations;
          retDirType.parameters = [[$element]].concat(nonElementBasedServices.map((function(type) {
            return [type];
          })));
        }
      }
      return retDirType;
    },
    setupModelDi: function(aClass) {
      var $__4 = this;
      if (aClass.parameters) {
        aClass.$inject = [];
        aClass.parameters.forEach((function(serviceType) {
          aClass.$inject.push($__4.lowerCaseFirstLetter($__4.getFunctionName(serviceType[0])));
        }));
      }
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

System.register("core/ngElement", [], function() {
  "use strict";
  var __moduleName = "core/ngElement";
  function require(path) {
    return $traceurRuntime.require("core/ngElement", path);
  }
  var NgElement = function NgElement($element) {
    this.domElement = $element[0];
  };
  ($traceurRuntime.createClass)(NgElement, {}, {});
  var $__default = NgElement;
  return {get default() {
      return $__default;
    }};
});

System.register("ng1/element", [], function() {
  "use strict";
  var __moduleName = "ng1/element";
  function require(path) {
    return $traceurRuntime.require("ng1/element", path);
  }
  var $element = function $element() {};
  ($traceurRuntime.createClass)($element, {}, {});
  var $__default = $element;
  return {get default() {
      return $__default;
    }};
});
System.get("angularNext" + "");