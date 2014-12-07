System.register("angular2Adapter", ["lib/assert", "./directive", "./component", "./core/ngElement", "./ng1/element"], function($__export) {
  "use strict";
  var __moduleName = "angular2Adapter";
  function require(path) {
    return $traceurRuntime.require("angular2Adapter", path);
  }
  var assert,
      Directive,
      Component,
      NgElement,
      $element,
      Angular2Adapter;
  return {
    setters: [function(m) {
      assert = m.assert;
    }, function(m) {
      Directive = m.default;
    }, function(m) {
      Component = m.default;
    }, function(m) {
      NgElement = m.default;
    }, function(m) {
      $element = m.default;
    }],
    execute: function() {
      Angular2Adapter = (function() {
        var Angular2Adapter = function Angular2Adapter($__3) {
          var $__5;
          var $__4 = $__3,
              moduleName = $__4.moduleName,
              logLevel = ($__5 = $__4.logLevel) === void 0 ? 0 : $__5;
          this.moduleName = moduleName;
          this.app = angular.module(moduleName);
          this.logLevel = logLevel;
        };
        return ($traceurRuntime.createClass)(Angular2Adapter, {
          bootstrapComponent: function(rootComponent) {
            var $__0 = this;
            assert.argumentTypes(rootComponent, Object);
            var rootComponentAnno;
            rootComponentAnno = this.getDirAnno(rootComponent);
            var rootElement = document.querySelector(rootComponentAnno.selector);
            angular.element(rootElement).ready((function() {
              $__0.registerDirectiveTree(rootComponent);
              angular.bootstrap(rootElement, [$__0.moduleName]);
            }));
          },
          registerDirectiveTree: function(dir) {
            var $__0 = this;
            var dirAnno = this.getDirAnno(dir);
            this.registerDirective(dir);
            if (dirAnno.template && dirAnno.template.directives) {
              dirAnno.template.directives.forEach((function(childDir) {
                $__0.registerDirectiveTree(childDir);
              }));
            }
          },
          registerDirective: function(dir) {
            var $__0 = this;
            dir = this.getDirWithInjectableServices(dir);
            this.setupModelDi(dir);
            var dirAnno = this.getDirAnno(dir);
            if (dirAnno.componentServices) {
              dirAnno.componentServices.forEach((function(serviceType) {
                $__0.setupModelDi(serviceType);
                $__0.app.service($__0.lowerCaseFirstLetter($__0.getFunctionName(serviceType)), serviceType);
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
            var scope = {};
            for (var key in dirAnno.bind) {
              if (dirAnno.bind.hasOwnProperty(key)) {
                scope[key] = '=' + dirAnno.bind[key];
              }
            }
            var ddo = {
              restrict: restrict,
              controller: dir,
              controllerAs: dirAnno.controllerAs || 'ctrl',
              scope: scope,
              bindToController: true
            };
            if (dirAnno.template && dirAnno.template.inline) {
              ddo.template = dirAnno.template.inline;
            }
            this.app.directive(camelDirectiveName, function() {
              return ddo;
            });
          },
          getDirWithInjectableServices: function(dirType) {
            var adapter = this;
            var retDirType = dirType;
            if (dirType.parameters) {
              var injectableServices = [];
              var nonInjectableParams = [];
              for (var i = 0; i < dirType.parameters.length; i++) {
                var curParamType = dirType.parameters[i][0];
                if (curParamType === NgElement || this.isDirClass(curParamType)) {
                  nonInjectableParams.push({
                    pos: i,
                    type: curParamType
                  });
                } else {
                  injectableServices.push(curParamType);
                }
              }
              if (nonInjectableParams.length) {
                retDirType = function(element) {
                  for (var args = [],
                      $__2 = 1; $__2 < arguments.length; $__2++)
                    args[$__2 - 1] = arguments[$__2];
                  var origDirParams = angular.copy(args);
                  nonInjectableParams.forEach((function(param) {
                    var model;
                    if (param.type === NgElement) {
                      model = new NgElement(element);
                    } else if (adapter.isDirClass(param.type)) {
                      var dirName = adapter.lowerCaseFirstLetter(adapter.getFunctionName(param.type));
                      model = element.inheritedData(("$" + dirName + "Controller"));
                    }
                    origDirParams.splice(param.pos, 0, model);
                  }));
                  dirType.apply(this, origDirParams);
                };
                retDirType.prototype = Object.create(dirType.prototype);
                retDirType.annotations = dirType.annotations;
                retDirType.parameters = $traceurRuntime.spread([[$element]], injectableServices.map((function(type) {
                  return [type];
                })));
              }
            }
            return retDirType;
          },
          setupModelDi: function(aClass) {
            var $__0 = this;
            if (aClass.parameters) {
              aClass.$inject = [];
              aClass.parameters.forEach((function(serviceType) {
                aClass.$inject.push($__0.lowerCaseFirstLetter($__0.getFunctionName(serviceType[0])));
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
          },
          isDirClass: function(obj) {
            return obj.annotations && obj.annotations.filter((function(anno) {
              return anno instanceof Directive;
            })).length;
          }
        }, {});
      }());
      Object.defineProperty(Angular2Adapter.prototype.bootstrapComponent, "parameters", {get: function() {
          return [[Object]];
        }});
      $__export('default', Angular2Adapter);
    }
  };
});

System.register("bootstrap", ["./angular2Adapter"], function($__export) {
  "use strict";
  var __moduleName = "bootstrap";
  function require(path) {
    return $traceurRuntime.require("bootstrap", path);
  }
  var Angular2Adapter;
  function bootstrap(component) {
    var config = arguments[1] !== (void 0) ? arguments[1] : {};
    var adapter = new Angular2Adapter(config);
    adapter.bootstrapComponent(component);
  }
  $__export("default", bootstrap);
  return {
    setters: [function(m) {
      Angular2Adapter = m.default;
    }],
    execute: function() {
      ;
    }
  };
});

System.register("component", ["lib/assert", "./directive", "./templateConfig"], function($__export) {
  "use strict";
  var __moduleName = "component";
  function require(path) {
    return $traceurRuntime.require("component", path);
  }
  var assert,
      Directive,
      TemplateConfig,
      Component,
      ComponentOptions;
  return {
    setters: [function(m) {
      assert = m.assert;
    }, function(m) {
      Directive = m.default;
    }, function(m) {
      TemplateConfig = m.default;
    }],
    execute: function() {
      Component = (function($__super) {
        var Component = function Component(options) {
          assert.argumentTypes(options, ComponentOptions);
          this.componentServices = options.componentServices;
          this.template = options.template;
          delete options.componentServices;
          delete options.template;
          $traceurRuntime.superConstructor(Component).call(this, options);
        };
        return ($traceurRuntime.createClass)(Component, {}, {}, $__super);
      }(Directive));
      Object.defineProperty(Component, "parameters", {get: function() {
          return [[ComponentOptions]];
        }});
      $__export('default', Component);
      ComponentOptions = assert.define('ComponentOptions', function(options) {
        assert(options).is(assert.structure({selector: assert.string}));
        if (options.componentServices) {
          assert(options.componentServices).is(assert.arrayOf(Object));
        }
      });
    }
  };
});

System.register("decorator", ["./directive"], function($__export) {
  "use strict";
  var __moduleName = "decorator";
  function require(path) {
    return $traceurRuntime.require("decorator", path);
  }
  var Directive,
      Decorator;
  return {
    setters: [function(m) {
      Directive = m.default;
    }],
    execute: function() {
      Decorator = (function($__super) {
        var Decorator = function Decorator(options) {
          $traceurRuntime.superConstructor(Decorator).call(this, options);
        };
        return ($traceurRuntime.createClass)(Decorator, {}, {}, $__super);
      }(Directive));
      $__export('default', Decorator);
    }
  };
});

System.register("directive", ["lib/assert"], function($__export) {
  "use strict";
  var __moduleName = "directive";
  function require(path) {
    return $traceurRuntime.require("directive", path);
  }
  var assert,
      Directive,
      DirectiveOptions;
  return {
    setters: [function(m) {
      assert = m.assert;
    }],
    execute: function() {
      Directive = (function() {
        var Directive = function Directive(options) {
          assert.argumentTypes(options, DirectiveOptions);
          this.selector = options.selector;
          this.bind = options.bind;
          this.controllerAs = options.controllerAs;
        };
        return ($traceurRuntime.createClass)(Directive, {}, {});
      }());
      Object.defineProperty(Directive, "parameters", {get: function() {
          return [[DirectiveOptions]];
        }});
      $__export('default', Directive);
      DirectiveOptions = assert.define('DirectiveOptions', function(options) {
        assert(options).is(assert.structure({selector: assert.string}));
        if (options.bind) {
          assert.type(options.bind, Object);
        }
        if (options.controllerAs) {
          assert.type(options.controllerAs, assert.string);
        }
        for (var key in options) {
          if (options.hasOwnProperty(key)) {
            if (key !== 'selector' && key !== 'bind' && key !== 'controllerAs') {
              assert.fail((key + " is not a valid directive field"));
            }
          }
        }
      });
    }
  };
});

System.register("template", ["./directive"], function($__export) {
  "use strict";
  var __moduleName = "template";
  function require(path) {
    return $traceurRuntime.require("template", path);
  }
  var Directive,
      Template;
  return {
    setters: [function(m) {
      Directive = m.default;
    }],
    execute: function() {
      Template = (function($__super) {
        var Template = function Template(options) {
          $traceurRuntime.superConstructor(Template).call(this, options);
        };
        return ($traceurRuntime.createClass)(Template, {}, {}, $__super);
      }(Directive));
      $__export('default', Template);
    }
  };
});

System.register("templateConfig", [], function($__export) {
  "use strict";
  var __moduleName = "templateConfig";
  function require(path) {
    return $traceurRuntime.require("templateConfig", path);
  }
  var TemplateConfig;
  return {
    setters: [],
    execute: function() {
      TemplateConfig = (function() {
        var TemplateConfig = function TemplateConfig(options) {
          this.inline = options.inline;
          this.directives = options.directives;
        };
        return ($traceurRuntime.createClass)(TemplateConfig, {}, {});
      }());
      $__export('default', TemplateConfig);
    }
  };
});

System.register("core/ngElement", [], function($__export) {
  "use strict";
  var __moduleName = "core/ngElement";
  function require(path) {
    return $traceurRuntime.require("core/ngElement", path);
  }
  var NgElement;
  return {
    setters: [],
    execute: function() {
      NgElement = (function() {
        var NgElement = function NgElement($element) {
          this.domElement = $element[0];
        };
        return ($traceurRuntime.createClass)(NgElement, {}, {});
      }());
      $__export('default', NgElement);
    }
  };
});

System.register("ng1/element", [], function($__export) {
  "use strict";
  var __moduleName = "ng1/element";
  function require(path) {
    return $traceurRuntime.require("ng1/element", path);
  }
  var $element;
  return {
    setters: [],
    execute: function() {
      $element = (function() {
        var $element = function $element() {};
        return ($traceurRuntime.createClass)($element, {}, {});
      }());
      $__export('default', $element);
    }
  };
});
