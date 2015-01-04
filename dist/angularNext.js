System.register("core/core.js", ["ng2/bootstrap.js", "ng2/templateConfig.js", "ng2/directive.js", "ng2/component.js", "ng2/decorator.js", "ng2/template.js", "ng2/ngElement.js", "ngNext/injectNgOne.js", "ngNext/angular2Adapter.js"], function($__export) {
  "use strict";
  var __moduleName = "core/core.js";
  var $__exportNames = {};
  var $__exportNames = {};
  var $__exportNames = {};
  var $__exportNames = {};
  var $__exportNames = {};
  var $__exportNames = {};
  var $__exportNames = {};
  var $__exportNames = {};
  var $__exportNames = {};
  return {
    setters: [function(m) {
      Object.keys(m).forEach(function(p) {
        if (!$__exportNames[p])
          $__export(p, m[p]);
      });
    }, function(m) {
      Object.keys(m).forEach(function(p) {
        if (!$__exportNames[p])
          $__export(p, m[p]);
      });
    }, function(m) {
      Object.keys(m).forEach(function(p) {
        if (!$__exportNames[p])
          $__export(p, m[p]);
      });
    }, function(m) {
      Object.keys(m).forEach(function(p) {
        if (!$__exportNames[p])
          $__export(p, m[p]);
      });
    }, function(m) {
      Object.keys(m).forEach(function(p) {
        if (!$__exportNames[p])
          $__export(p, m[p]);
      });
    }, function(m) {
      Object.keys(m).forEach(function(p) {
        if (!$__exportNames[p])
          $__export(p, m[p]);
      });
    }, function(m) {
      Object.keys(m).forEach(function(p) {
        if (!$__exportNames[p])
          $__export(p, m[p]);
      });
    }, function(m) {
      Object.keys(m).forEach(function(p) {
        if (!$__exportNames[p])
          $__export(p, m[p]);
      });
    }, function(m) {
      Object.keys(m).forEach(function(p) {
        if (!$__exportNames[p])
          $__export(p, m[p]);
      });
    }],
    execute: function() {}
  };
});
//# sourceURL=core/core.js
System.register("ng2/bootstrap.js", ["ngNext/angular2Adapter.js"], function($__export) {
  "use strict";
  var __moduleName = "ng2/bootstrap.js";
  var Angular2Adapter;
  function bootstrap(component) {
    var config = arguments[1] !== (void 0) ? arguments[1] : {};
    var adapter = new Angular2Adapter(config);
    adapter.bootstrapComponent(component);
  }
  $__export("bootstrap", bootstrap);
  return {
    setters: [function(m) {
      Angular2Adapter = m.Angular2Adapter;
    }],
    execute: function() {
      ;
    }
  };
});
//# sourceURL=ng2/bootstrap.js
System.register("ng2/component.js", ["assert.js", "ng2/directive.js", "ng2/templateConfig.js"], function($__export) {
  "use strict";
  var __moduleName = "ng2/component.js";
  var assert,
      Directive,
      TemplateConfig,
      Component,
      ComponentOptions,
      ComponentClass;
  return {
    setters: [function(m) {
      assert = m.assert;
    }, function(m) {
      Directive = m.Directive;
    }, function(m) {
      TemplateConfig = m.TemplateConfig;
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
      ComponentOptions = assert.define('ComponentOptions', function(options) {
        assert(options).is(assert.structure({selector: assert.string}));
        if (options.componentServices) {
          assert(options.componentServices).is(assert.arrayOf(Object));
        }
      });
      ComponentClass = assert.define('ComponentClass', function(componentClass) {
        assert.type(componentClass, Object);
        var numDirAnnos;
        var numComponentAnnos;
        if (componentClass.annotations) {
          numDirAnnos = componentClass.annotations.filter((function(anno) {
            return anno instanceof Directive;
          })).length;
          numComponentAnnos = componentClass.annotations.filter((function(anno) {
            return anno instanceof Component;
          })).length;
        } else {
          numDirAnnos = 0;
          numComponentAnnos = 0;
        }
        if (numComponentAnnos === 0) {
          assert.fail('A ComponentClass must have a Component annotation');
        }
        if (numDirAnnos > 1) {
          asssert.fail('You cannot have more than one Directive annotations on a class.');
        }
      });
      $__export("Component", Component), $__export("ComponentOptions", ComponentOptions), $__export("ComponentClass", ComponentClass);
    }
  };
});
//# sourceURL=ng2/component.js
System.register("ng2/decorator.js", ["assert.js", "ng2/directive.js"], function($__export) {
  "use strict";
  var __moduleName = "ng2/decorator.js";
  var assert,
      Directive,
      Decorator,
      DecoratorClass;
  return {
    setters: [function(m) {
      assert = m.assert;
    }, function(m) {
      Directive = m.Directive;
    }],
    execute: function() {
      Decorator = (function($__super) {
        var Decorator = function Decorator(options) {
          assert.argumentTypes(options, Object);
          $traceurRuntime.superConstructor(Decorator).call(this, options);
        };
        return ($traceurRuntime.createClass)(Decorator, {}, {}, $__super);
      }(Directive));
      Object.defineProperty(Decorator, "parameters", {get: function() {
          return [[Object]];
        }});
      DecoratorClass = assert.define('DecoratorClass', function(decoratorClass) {
        assert.type(decoratorClass, Object);
        var numDirAnnos;
        var numComponentAnnos;
        if (decoratorClass.annotations) {
          numDirAnnos = decoratorClass.annotations.filter((function(anno) {
            return anno instanceof Directive;
          })).length;
          numComponentAnnos = decoratorClass.annotations.filter((function(anno) {
            return anno instanceof Decorator;
          })).length;
        } else {
          numDirAnnos = 0;
          numComponentAnnos = 0;
        }
        if (numComponentAnnos === 0) {
          assert.fail('A DecoratorClass must have a Decorator annotation');
        }
        if (numDirAnnos > 1) {
          asssert.fail('You cannot have more than one Directive annotations on a class.');
        }
      });
      $__export("Decorator", Decorator), $__export("DecoratorClass", DecoratorClass);
    }
  };
});
//# sourceURL=ng2/decorator.js
System.register("ng2/directive.js", ["assert.js"], function($__export) {
  "use strict";
  var __moduleName = "ng2/directive.js";
  var assert,
      Directive,
      DirectiveOptions,
      DirectiveClass;
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
          this.controllerAs = options.controllerAs || 'ctrl';
          this.observe = options.observe;
        };
        return ($traceurRuntime.createClass)(Directive, {}, {});
      }());
      Object.defineProperty(Directive, "parameters", {get: function() {
          return [[DirectiveOptions]];
        }});
      DirectiveOptions = assert.define('DirectiveOptions', function(options) {
        assert(options).is(assert.structure({selector: assert.string}));
        if (options.bind) {
          assert.type(options.bind, Object);
        }
        if (options.controllerAs) {
          assert.type(options.controllerAs, assert.string);
        }
        if (options.observe) {
          assert.type(options.observe, Object);
        }
        for (var key in options) {
          if (options.hasOwnProperty(key)) {
            if (key !== 'selector' && key !== 'bind' && key !== 'controllerAs' && key !== 'observe') {
              assert.fail((key + " is not a valid directive field"));
            }
          }
        }
      });
      DirectiveClass = assert.define('DirectiveClass', function(dirClass) {
        assert.type(dirClass, Object);
        var numDirAnnos;
        if (dirClass.annotations) {
          numDirAnnos = dirClass.annotations.filter((function(anno) {
            return anno instanceof Directive;
          })).length;
        } else {
          numDirAnnos = 0;
        }
        if (numDirAnnos === 0) {
          assert.fail('A DirectiveClass must have a Directive annotation');
        } else if (numDirAnnos > 1) {
          asssert.fail('You cannot have more than one Directive annotations on a class.');
        }
      });
      $__export("Directive", Directive), $__export("DirectiveOptions", DirectiveOptions), $__export("DirectiveClass", DirectiveClass);
    }
  };
});
//# sourceURL=ng2/directive.js
System.register("ng2/ngElement.js", [], function($__export) {
  "use strict";
  var __moduleName = "ng2/ngElement.js";
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
      $__export("NgElement", NgElement);
    }
  };
});
//# sourceURL=ng2/ngElement.js
System.register("ng2/template.js", ["ng2/directive.js"], function($__export) {
  "use strict";
  var __moduleName = "ng2/template.js";
  var Directive,
      Template;
  return {
    setters: [function(m) {
      Directive = m.Directive;
    }],
    execute: function() {
      Template = (function($__super) {
        var Template = function Template(options) {
          $traceurRuntime.superConstructor(Template).call(this, options);
        };
        return ($traceurRuntime.createClass)(Template, {}, {}, $__super);
      }(Directive));
      $__export("Template", Template);
    }
  };
});
//# sourceURL=ng2/template.js
System.register("ng2/templateConfig.js", [], function($__export) {
  "use strict";
  var __moduleName = "ng2/templateConfig.js";
  var TemplateConfig;
  return {
    setters: [],
    execute: function() {
      TemplateConfig = (function() {
        var TemplateConfig = function TemplateConfig(options) {
          this.inline = options.inline;
          this.url = options.url;
          this.directives = options.directives;
        };
        return ($traceurRuntime.createClass)(TemplateConfig, {}, {});
      }());
      $__export("TemplateConfig", TemplateConfig);
    }
  };
});
//# sourceURL=ng2/templateConfig.js
System.register("ngNext/angular2Adapter.js", ["assert.js", "ng2/directive.js", "ng2/component.js", "ng2/ngElement.js", "ngNext/injectNgOne.js"], function($__export) {
  "use strict";
  var __moduleName = "ngNext/angular2Adapter.js";
  var assert,
      Directive,
      DirectiveClass,
      Component,
      ComponentClass,
      NgElement,
      InjectNgOne,
      Angular2Adapter;
  return {
    setters: [function(m) {
      assert = m.assert;
    }, function(m) {
      Directive = m.Directive;
      DirectiveClass = m.DirectiveClass;
    }, function(m) {
      Component = m.Component;
      ComponentClass = m.ComponentClass;
    }, function(m) {
      NgElement = m.NgElement;
    }, function(m) {
      InjectNgOne = m.InjectNgOne;
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
          this.registeredDirectives = new Set();
        };
        return ($traceurRuntime.createClass)(Angular2Adapter, {
          bootstrapComponent: function(rootComponent) {
            var $__0 = this;
            assert.argumentTypes(rootComponent, ComponentClass);
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
            assert.argumentTypes(dir, DirectiveClass);
            if (this.registeredDirectives.has(dir)) {
              return;
            } else {
              this.registeredDirectives.add(dir);
            }
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
            assert.argumentTypes(dir, DirectiveClass);
            dir = this.wrapDir(dir);
            this.setupModelDi(dir);
            var dirAnno = this.getDirAnno(dir);
            if (dirAnno.componentServices) {
              dirAnno.componentServices.forEach((function(serviceType) {
                $__0.setupModelDi(serviceType);
                $__0.app.service($__0.lowerCaseFirstLetter($__0.getFunctionName(serviceType)), serviceType);
              }));
            }
            var dirInfo = this.getNg1DirectiveInfo(dir);
            this.app.directive(dirInfo.name, function() {
              return dirInfo.ddo;
            });
          },
          getNg1DirectiveInfo: function(dir) {
            var dirAnno = this.getDirAnno(dir);
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
            var scope = {};
            for (var key in dirAnno.bind) {
              if (dirAnno.bind.hasOwnProperty(key)) {
                scope[key] = '=' + dirAnno.bind[key];
              }
            }
            var ddo = {
              restrict: restrict,
              controller: dir,
              controllerAs: dirAnno.controllerAs,
              scope: scope,
              bindToController: true
            };
            if (dirAnno.template) {
              if (dirAnno.template.inline) {
                ddo.template = dirAnno.template.inline;
              } else if (dirAnno.template.url) {
                ddo.templateUrl = dirAnno.template.url;
              }
            }
            var name = dashesDirectiveName.replace(/-([a-z])/g, (function(char) {
              return char[1].toUpperCase();
            }));
            return {
              name: name,
              ddo: ddo
            };
          },
          wrapDir: function(dirType) {
            var adapter = this;
            var dirAnno = this.getDirAnno(dirType);
            var retDirType = dirType;
            if (dirType.parameters) {
              var injectableServices = [];
              var uninjectableParams = [];
              var requiresElement = false;
              var requiresScope = false;
              for (var i = 0; i < dirType.parameters.length; i++) {
                var curParamType = dirType.parameters[i][0];
                if (curParamType === NgElement || this.isDirClass(curParamType)) {
                  uninjectableParams.push({
                    pos: i,
                    type: curParamType
                  });
                  requiresElement = true;
                } else {
                  injectableServices.push(curParamType);
                }
              }
              if (dirAnno.observe) {
                requiresScope = true;
              }
              if (uninjectableParams.length || requiresElement || requiresScope) {
                retDirType = function() {
                  for (var args = [],
                      $__2 = 0; $__2 < arguments.length; $__2++)
                    args[$__2] = arguments[$__2];
                  var $__0 = this;
                  var element,
                      scope;
                  if (requiresScope) {
                    scope = args.pop();
                  }
                  if (requiresElement) {
                    element = args.pop();
                  }
                  var origDirParams = angular.copy(args);
                  uninjectableParams.forEach((function(param) {
                    var model;
                    if (param.type === NgElement) {
                      model = new NgElement(element);
                    } else if (adapter.isDirClass(param.type)) {
                      var dirName = adapter.lowerCaseFirstLetter(adapter.getFunctionName(param.type));
                      model = element.inheritedData(("$" + dirName + "Controller"));
                    }
                    origDirParams.splice(param.pos, 0, model);
                  }));
                  if (dirAnno.observe) {
                    var $__6 = function(key) {
                      if (dirAnno.observe.hasOwnProperty(key)) {
                        var functionName = dirAnno.observe[key];
                        scope.$watch((dirAnno.controllerAs + "." + key), (function(newValue, oldValue) {
                          if ($__0[functionName]) {
                            $__0[functionName](newValue, oldValue);
                          } else {
                            console.warn(("'" + key + "' has changed but observe function, '" + functionName + "' does not exist."));
                          }
                        }));
                      }
                    };
                    for (var key in dirAnno.observe) {
                      $__6(key);
                    }
                  }
                  dirType.apply(this, origDirParams);
                };
                retDirType.prototype = Object.create(dirType.prototype);
                retDirType.annotations = dirType.annotations;
                retDirType.parameters = injectableServices.map((function(type) {
                  return [type];
                }));
                if (requiresElement) {
                  retDirType.parameters.push([new InjectNgOne('$element')]);
                }
                if (requiresScope) {
                  retDirType.parameters.push([new InjectNgOne('$scope')]);
                }
              }
            }
            return retDirType;
          },
          setupModelDi: function(aClass) {
            var $__0 = this;
            assert.argumentTypes(aClass, Function);
            if (aClass.parameters) {
              aClass.$inject = [];
              aClass.parameters.forEach((function(paramAnnotations) {
                aClass.$inject.push($__0.getInjectStrFromParamAnnotations(paramAnnotations));
              }));
            }
          },
          getInjectStrFromParamAnnotations: function(paramAnnotations) {
            for (var i = 0; i < paramAnnotations.length; i++) {
              var paramAnno = paramAnnotations[i];
              if (paramAnno instanceof InjectNgOne) {
                return paramAnno.typeStr;
              } else if (paramAnno instanceof Function) {
                return this.lowerCaseFirstLetter(this.getFunctionName(paramAnno));
              }
            }
            if (paramAnnotations.length === 0) {
              throw "Could not inject parameter. You must either specify its type or annotate it with @InjectNgOne('...').";
            } else {
              throw ("Could not determine how to inject parameter with annotations: " + paramAnnotations);
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
            assert.argumentTypes(func, Function);
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
            return !!(obj.annotations && obj.annotations.filter((function(anno) {
              return anno instanceof Directive;
            })).length);
          }
        }, {});
      }());
      Object.defineProperty(Angular2Adapter.prototype.bootstrapComponent, "parameters", {get: function() {
          return [[ComponentClass]];
        }});
      Object.defineProperty(Angular2Adapter.prototype.registerDirectiveTree, "parameters", {get: function() {
          return [[DirectiveClass]];
        }});
      Object.defineProperty(Angular2Adapter.prototype.registerDirective, "parameters", {get: function() {
          return [[DirectiveClass]];
        }});
      Object.defineProperty(Angular2Adapter.prototype.getNg1DirectiveInfo, "parameters", {get: function() {
          return [[DirectiveClass]];
        }});
      Object.defineProperty(Angular2Adapter.prototype.wrapDir, "parameters", {get: function() {
          return [[DirectiveClass]];
        }});
      Object.defineProperty(Angular2Adapter.prototype.setupModelDi, "parameters", {get: function() {
          return [[Function]];
        }});
      Object.defineProperty(Angular2Adapter.prototype.getDirAnno, "parameters", {get: function() {
          return [[DirectiveClass]];
        }});
      Object.defineProperty(Angular2Adapter.prototype.getFunctionName, "parameters", {get: function() {
          return [[Function]];
        }});
      $__export("Angular2Adapter", Angular2Adapter);
    }
  };
});
//# sourceURL=ngNext/angular2Adapter.js
System.register("ngNext/injectNgOne.js", ["assert.js"], function($__export) {
  "use strict";
  var __moduleName = "ngNext/injectNgOne.js";
  var assert,
      InjectNgOne;
  return {
    setters: [function(m) {
      assert = m.assert;
    }],
    execute: function() {
      InjectNgOne = (function() {
        var InjectNgOne = function InjectNgOne(typeStr) {
          assert.argumentTypes(typeStr, assert.string);
          this.typeStr = typeStr;
        };
        return ($traceurRuntime.createClass)(InjectNgOne, {}, {});
      }());
      Object.defineProperty(InjectNgOne, "parameters", {get: function() {
          return [[assert.string]];
        }});
      $__export("InjectNgOne", InjectNgOne);
    }
  };
});
//# sourceURL=ngNext/injectNgOne.js