System.register("angular2/angular2.js", ["./ng2/bootstrap.js", "./ng2/directive.js", "./ng2/component.js", "./ng2/decorator.js", "./ng2/template.js", "./ng2/ngElement.js", "./ngNext/injectNgOne.js", "./ngNext/angular2Adapter.js"], function($__export) {
  "use strict";
  var __moduleName = "angular2/angular2.js";
  var $__exportNames = {};
  var $__exportNames = {};
  var $__exportNames = {};
  var $__exportNames = {};
  var $__exportNames = {};
  var $__exportNames = {};
  var $__exportNames = {};
  var $__exportNames = {};
  return {
    setters: [function($__m) {
      Object.keys($__m).forEach(function(p) {
        if (!$__exportNames[p])
          $__export(p, $__m[p]);
      });
    }, function($__m) {
      Object.keys($__m).forEach(function(p) {
        if (!$__exportNames[p])
          $__export(p, $__m[p]);
      });
    }, function($__m) {
      Object.keys($__m).forEach(function(p) {
        if (!$__exportNames[p])
          $__export(p, $__m[p]);
      });
    }, function($__m) {
      Object.keys($__m).forEach(function(p) {
        if (!$__exportNames[p])
          $__export(p, $__m[p]);
      });
    }, function($__m) {
      Object.keys($__m).forEach(function(p) {
        if (!$__exportNames[p])
          $__export(p, $__m[p]);
      });
    }, function($__m) {
      Object.keys($__m).forEach(function(p) {
        if (!$__exportNames[p])
          $__export(p, $__m[p]);
      });
    }, function($__m) {
      Object.keys($__m).forEach(function(p) {
        if (!$__exportNames[p])
          $__export(p, $__m[p]);
      });
    }, function($__m) {
      Object.keys($__m).forEach(function(p) {
        if (!$__exportNames[p])
          $__export(p, $__m[p]);
      });
    }],
    execute: function() {}
  };
});

System.register("angular2/rtts-assert.js", [], function($__export) {
  "use strict";
  var __moduleName = "angular2/rtts-assert.js";
  var _global,
      POSITION_NAME,
      primitives,
      genericType,
      string,
      boolean,
      number,
      currentStack,
      prop;
  function argPositionName(i) {
    var position = (i / 2) + 1;
    return POSITION_NAME[position] || (position + 'th');
  }
  function proxy() {}
  function assertArgumentTypes() {
    for (var params = [],
        $__7 = 0; $__7 < arguments.length; $__7++)
      params[$__7] = arguments[$__7];
    var actual,
        type;
    var currentArgErrors;
    var errors = [];
    var msg;
    for (var i = 0,
        l = params.length; i < l; i = i + 2) {
      actual = params[i];
      type = params[i + 1];
      currentArgErrors = [];
      if (!isType(actual, type, currentArgErrors)) {
        errors.push(argPositionName(i) + ' argument has to be an instance of ' + prettyPrint(type) + ', got ' + prettyPrint(actual));
        if (currentArgErrors.length) {
          errors.push(currentArgErrors);
        }
      }
    }
    if (errors.length) {
      throw new Error('Invalid arguments given!\n' + formatErrors(errors));
    }
  }
  function prettyPrint(value) {
    if (typeof value === 'undefined') {
      return 'undefined';
    }
    if (typeof value === 'string') {
      return '"' + value + '"';
    }
    if (typeof value === 'boolean') {
      return value.toString();
    }
    if (value === null) {
      return 'null';
    }
    if (typeof value === 'object') {
      if (value.__assertName) {
        return value.__assertName;
      }
      if (value.map) {
        return '[' + value.map(prettyPrint).join(', ') + ']';
      }
      var properties = Object.keys(value);
      return '{' + properties.map((function(p) {
        return p + ': ' + prettyPrint(value[p]);
      })).join(', ') + '}';
    }
    return value.__assertName || value.name || value.toString();
  }
  function isType(value, T, errors) {
    if (T && T.type) {
      T = T.type;
    }
    if (T === primitives.void) {
      return typeof value === 'undefined';
    }
    if (_isProxy(value)) {
      return true;
    }
    if (T === primitives.any || value === null) {
      return true;
    }
    if (T === primitives.string) {
      return typeof value === 'string';
    }
    if (T === primitives.number) {
      return typeof value === 'number';
    }
    if (T === primitives.boolean) {
      return typeof value === 'boolean';
    }
    if (typeof T.assert === 'function') {
      var parentStack = currentStack;
      var isValid;
      currentStack = errors;
      try {
        isValid = T.assert(value);
      } catch (e) {
        fail(e.message);
        isValid = false;
      }
      currentStack = parentStack;
      if (typeof isValid === 'undefined') {
        isValid = errors.length === 0;
      }
      return isValid;
    }
    return value instanceof T;
  }
  function _isProxy(obj) {
    if (!obj || !obj.constructor || !obj.constructor.annotations)
      return false;
    return obj.constructor.annotations.filter((function(a) {
      return a instanceof proxy;
    })).length > 0;
  }
  function formatErrors(errors) {
    var indent = arguments[1] !== (void 0) ? arguments[1] : '  ';
    return errors.map((function(e) {
      if (typeof e === 'string')
        return indent + '- ' + e;
      return formatErrors(e, indent + '  ');
    })).join('\n');
  }
  function type(actual, T) {
    var errors = [];
    if (!isType(actual, T, errors)) {
      var msg = 'Expected an instance of ' + prettyPrint(T) + ', got ' + prettyPrint(actual) + '!';
      if (errors.length) {
        msg += '\n' + formatErrors(errors);
      }
      throw new Error(msg);
    }
    return actual;
  }
  function returnType(actual, T) {
    var errors = [];
    if (!isType(actual, T, errors)) {
      var msg = 'Expected to return an instance of ' + prettyPrint(T) + ', got ' + prettyPrint(actual) + '!';
      if (errors.length) {
        msg += '\n' + formatErrors(errors);
      }
      throw new Error(msg);
    }
    return actual;
  }
  function arrayOf() {
    for (var types = [],
        $__8 = 0; $__8 < arguments.length; $__8++)
      types[$__8] = arguments[$__8];
    return assert.define('array of ' + types.map(prettyPrint).join('/'), function(value) {
      var $__10;
      if (assert(value).is(Array)) {
        var $__3 = true;
        var $__4 = false;
        var $__5 = undefined;
        try {
          for (var $__1 = void 0,
              $__0 = (value)[$traceurRuntime.toProperty(Symbol.iterator)](); !($__3 = ($__1 = $__0.next()).done); $__3 = true) {
            var item = $__1.value;
            {
              ($__10 = assert(item)).is.apply($__10, $traceurRuntime.spread(types));
            }
          }
        } catch ($__6) {
          $__4 = true;
          $__5 = $__6;
        } finally {
          try {
            if (!$__3 && $__0.return != null) {
              $__0.return();
            }
          } finally {
            if ($__4) {
              throw $__5;
            }
          }
        }
      }
    });
  }
  function structure(definition) {
    var properties = Object.keys(definition);
    return assert.define('object with properties ' + properties.join(', '), function(value) {
      if (assert(value).is(Object)) {
        var $__3 = true;
        var $__4 = false;
        var $__5 = undefined;
        try {
          for (var $__1 = void 0,
              $__0 = (properties)[$traceurRuntime.toProperty(Symbol.iterator)](); !($__3 = ($__1 = $__0.next()).done); $__3 = true) {
            var property = $__1.value;
            {
              assert(value[property]).is(definition[property]);
            }
          }
        } catch ($__6) {
          $__4 = true;
          $__5 = $__6;
        } finally {
          try {
            if (!$__3 && $__0.return != null) {
              $__0.return();
            }
          } finally {
            if ($__4) {
              throw $__5;
            }
          }
        }
      }
    });
  }
  function fail(message) {
    currentStack.push(message);
  }
  function define(classOrName, check) {
    var cls = classOrName;
    if (typeof classOrName === 'string') {
      cls = function() {};
      cls.__assertName = classOrName;
    }
    cls.assert = function(value) {
      return check(value);
    };
    return cls;
  }
  function assert(value) {
    return {is: function is() {
        var $__10;
        for (var types = [],
            $__9 = 0; $__9 < arguments.length; $__9++)
          types[$__9] = arguments[$__9];
        var allErrors = [];
        var errors;
        var $__3 = true;
        var $__4 = false;
        var $__5 = undefined;
        try {
          for (var $__1 = void 0,
              $__0 = (types)[$traceurRuntime.toProperty(Symbol.iterator)](); !($__3 = ($__1 = $__0.next()).done); $__3 = true) {
            var type = $__1.value;
            {
              errors = [];
              if (isType(value, type, errors)) {
                return true;
              }
              allErrors.push(prettyPrint(value) + ' is not instance of ' + prettyPrint(type));
              if (errors.length) {
                allErrors.push(errors);
              }
            }
          }
        } catch ($__6) {
          $__4 = true;
          $__5 = $__6;
        } finally {
          try {
            if (!$__3 && $__0.return != null) {
              $__0.return();
            }
          } finally {
            if ($__4) {
              throw $__5;
            }
          }
        }
        ($__10 = currentStack).push.apply($__10, $traceurRuntime.spread(allErrors));
        return false;
      }};
  }
  $__export("proxy", proxy);
  return {
    setters: [],
    execute: function() {
      _global = typeof window === 'object' ? window : global;
      POSITION_NAME = ['', '1st', '2nd', '3rd'];
      if (typeof $traceurRuntime === 'object') {
        primitives = $traceurRuntime.type;
        genericType = $traceurRuntime.genericType;
      } else {
        primitives = {
          any: {name: 'any'},
          boolean: {name: 'boolean'},
          number: {name: 'number'},
          string: {name: 'string'},
          symbol: {name: 'symbol'},
          void: {name: 'void'}
        };
        genericType = function(type, args) {
          return {
            type: type,
            args: args
          };
        };
      }
      Object.keys(primitives).forEach(function(name) {
        primitives[name].__assertName = name;
      });
      string = type.string = define('string', function(value) {
        return typeof value === 'string';
      });
      boolean = type.boolean = define('boolean', function(value) {
        return typeof value === 'boolean';
      });
      number = type.number = define('number', function(value) {
        return typeof value === 'number';
      });
      currentStack = [];
      assert.type = type;
      for (prop in primitives) {
        assert.type[prop] = primitives[prop];
      }
      assert.genericType = genericType;
      assert.argumentTypes = assertArgumentTypes;
      assert.returnType = returnType;
      assert.define = define;
      assert.fail = fail;
      assert.string = string;
      assert.number = number;
      assert.boolean = boolean;
      assert.arrayOf = arrayOf;
      assert.structure = structure;
      $__export("assert", assert);
    }
  };
});

System.register("angular2/ng2/bootstrap.js", ["../ngNext/angular2Adapter.js"], function($__export) {
  "use strict";
  var __moduleName = "angular2/ng2/bootstrap.js";
  var Angular2Adapter;
  function bootstrap(component) {
    var config = arguments[1] !== (void 0) ? arguments[1] : {};
    var adapter = new Angular2Adapter(config);
    adapter.bootstrapComponent(component);
  }
  $__export("bootstrap", bootstrap);
  return {
    setters: [function($__m) {
      Angular2Adapter = $__m.Angular2Adapter;
    }],
    execute: function() {
      ;
    }
  };
});

System.register("angular2/ng2/component.js", ["angular2/rtts-assert.js", "./directive.js"], function($__export) {
  "use strict";
  var __moduleName = "angular2/ng2/component.js";
  var assert,
      Directive,
      Component,
      ComponentOptions,
      ComponentClass;
  return {
    setters: [function($__m) {
      assert = $__m.assert;
    }, function($__m) {
      Directive = $__m.Directive;
    }],
    execute: function() {
      Component = (function($__super) {
        var Component = function Component(options) {
          assert.argumentTypes(options, ComponentOptions);
          var componentServices = options.componentServices;
          delete options.componentServices;
          $traceurRuntime.superConstructor(Component).call(this, options);
          this.componentServices = componentServices;
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

System.register("angular2/ng2/decorator.js", ["angular2/rtts-assert.js", "./directive.js"], function($__export) {
  "use strict";
  var __moduleName = "angular2/ng2/decorator.js";
  var assert,
      Directive,
      Decorator,
      DecoratorClass;
  return {
    setters: [function($__m) {
      assert = $__m.assert;
    }, function($__m) {
      Directive = $__m.Directive;
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

System.register("angular2/ng2/directive.js", ["angular2/rtts-assert.js"], function($__export) {
  "use strict";
  var __moduleName = "angular2/ng2/directive.js";
  var assert,
      Directive,
      DirectiveOptions,
      DirectiveClass;
  return {
    setters: [function($__m) {
      assert = $__m.assert;
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

System.register("angular2/ng2/ngElement.js", [], function($__export) {
  "use strict";
  var __moduleName = "angular2/ng2/ngElement.js";
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

System.register("angular2/ng2/template.js", [], function($__export) {
  "use strict";
  var __moduleName = "angular2/ng2/template.js";
  var Template;
  return {
    setters: [],
    execute: function() {
      Template = (function() {
        var Template = function Template(options) {
          this.inline = options.inline;
          this.url = options.url;
          this.directives = options.directives;
        };
        return ($traceurRuntime.createClass)(Template, {}, {});
      }());
      $__export("Template", Template);
    }
  };
});

System.register("angular2/ngNext/angular2Adapter.js", ["angular2/rtts-assert.js", "../ng2/directive.js", "../ng2/component.js", "../ng2/template.js", "../ng2/ngElement.js", "./injectNgOne.js", "./polyfillPromise.js", "./registerNg2Directives.js"], function($__export) {
  "use strict";
  var __moduleName = "angular2/ngNext/angular2Adapter.js";
  var assert,
      Directive,
      DirectiveClass,
      Component,
      ComponentClass,
      Template,
      NgElement,
      InjectNgOne,
      polyfillPromise,
      registerNg2Directives,
      Angular2Adapter;
  return {
    setters: [function($__m) {
      assert = $__m.assert;
    }, function($__m) {
      Directive = $__m.Directive;
      DirectiveClass = $__m.DirectiveClass;
    }, function($__m) {
      Component = $__m.Component;
      ComponentClass = $__m.ComponentClass;
    }, function($__m) {
      Template = $__m.Template;
    }, function($__m) {
      NgElement = $__m.NgElement;
    }, function($__m) {
      InjectNgOne = $__m.InjectNgOne;
    }, function($__m) {
      polyfillPromise = $__m.default;
    }, function($__m) {
      registerNg2Directives = $__m.default;
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
          polyfillPromise(this.app);
          registerNg2Directives(this.app);
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
              return ;
            } else {
              this.registeredDirectives.add(dir);
            }
            this.registerDirective(dir);
            var templateAnno = this.getTemplateAnno(dir);
            if (templateAnno && templateAnno.directives) {
              templateAnno.directives.forEach((function(childDir) {
                $__0.registerDirectiveTree(childDir);
              }));
            }
          },
          registerDirective: function(dir) {
            assert.argumentTypes(dir, DirectiveClass);
            dir = this.wrapDir(dir);
            dir.$inject = this.getInjectArray(dir);
            this.registerComponentServices(dir);
            var dirInfo = this.getNg1DirectiveInfo(dir);
            this.app.directive(dirInfo.name, function() {
              return dirInfo.ddo;
            });
          },
          registerComponentServices: function(dir) {
            var $__0 = this;
            assert.argumentTypes(dir, DirectiveClass);
            var dirAnno = this.getDirAnno(dir);
            if (dirAnno.componentServices) {
              dirAnno.componentServices.forEach((function(serviceType) {
                serviceType.$inject = $__0.getInjectArray(serviceType);
                $__0.app.service($__0.lowerCaseFirstLetter($__0.getFunctionName(serviceType)), serviceType);
              }));
            }
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
            var templateAnno = this.getTemplateAnno(dir);
            if (templateAnno) {
              if (templateAnno.inline) {
                ddo.template = templateAnno.inline;
              } else if (templateAnno.url) {
                ddo.templateUrl = templateAnno.url;
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
          getInjectArray: function(aClass) {
            var $__0 = this;
            assert.argumentTypes(aClass, Function);
            var $inject = [];
            if (aClass.parameters) {
              aClass.parameters.forEach((function(paramAnnotations) {
                $inject.push($__0.getInjectStrFromParamAnnotations(paramAnnotations));
              }));
            }
            return $inject;
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
          getTemplateAnno: function(directive) {
            var dirAnnos = directive.annotations.filter((function(annotation) {
              return annotation instanceof Template;
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
      Object.defineProperty(Angular2Adapter.prototype.registerComponentServices, "parameters", {get: function() {
          return [[DirectiveClass]];
        }});
      Object.defineProperty(Angular2Adapter.prototype.getNg1DirectiveInfo, "parameters", {get: function() {
          return [[DirectiveClass]];
        }});
      Object.defineProperty(Angular2Adapter.prototype.wrapDir, "parameters", {get: function() {
          return [[DirectiveClass]];
        }});
      Object.defineProperty(Angular2Adapter.prototype.getInjectArray, "parameters", {get: function() {
          return [[Function]];
        }});
      Object.defineProperty(Angular2Adapter.prototype.getDirAnno, "parameters", {get: function() {
          return [[DirectiveClass]];
        }});
      Object.defineProperty(Angular2Adapter.prototype.getTemplateAnno, "parameters", {get: function() {
          return [[DirectiveClass]];
        }});
      Object.defineProperty(Angular2Adapter.prototype.getFunctionName, "parameters", {get: function() {
          return [[Function]];
        }});
      $__export("Angular2Adapter", Angular2Adapter);
    }
  };
});

System.register("angular2/ngNext/injectNgOne.js", ["angular2/rtts-assert.js"], function($__export) {
  "use strict";
  var __moduleName = "angular2/ngNext/injectNgOne.js";
  var assert,
      InjectNgOne;
  return {
    setters: [function($__m) {
      assert = $__m.assert;
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

System.register("angular2/ngNext/polyfillPromise.js", [], function($__export) {
  "use strict";
  var __moduleName = "angular2/ngNext/polyfillPromise.js";
  function polyfillPromise(ngModule) {
    ngModule.run(['$q', '$window', function($q, $window) {
      $window.Promise = function(executor) {
        return $q(executor);
      };
      $window.Promise.all = $q.all.bind($q);
      $window.Promise.reject = $q.reject.bind($q);
      $window.Promise.resolve = $q.when.bind($q);
      $window.Promise.race = function(promises) {
        var promiseMgr = $q.defer();
        for (var i = 0; i < promises.length; i++) {
          promises[i].then(function(result) {
            if (promiseMgr) {
              promiseMgr.resolve(result);
              promiseMgr = null;
            }
          });
          promises[i].catch(function(result) {
            if (promiseMgr) {
              promiseMgr.reject(result);
              promiseMgr = null;
            }
          });
        }
        return promiseMgr.promise;
      };
    }]);
    if (angular.isArray(ngModule._runBlocks)) {
      ngModule._runBlocks.unshift(ngModule._runBlocks.pop());
    }
  }
  $__export("default", polyfillPromise);
  return {
    setters: [],
    execute: function() {
    }
  };
});

System.register("angular2/ngNext/registerNg2Directives.js", [], function($__export) {
  "use strict";
  var __moduleName = "angular2/ngNext/registerNg2Directives.js";
  function registerPropertyDirectives(ngModule) {
    var ALL_PROPERTIES = ['abbr', 'accept', 'acceptCharset', 'accessKey', 'accessKeyLabel', 'action', 'allowfullscreen', 'alt', 'areas', 'async', 'attributes', 'audioTracks', 'autocomplete', 'autofocus', 'autoplay', 'baseURI', 'buffered', 'caption', 'cellIndex', 'cells', 'challenge', 'charset', 'checked', 'childElementCount', 'childNodes', 'children', 'cite', 'classList', 'className', 'clientHeight', 'clientLeft', 'clientTop', 'clientWidth', 'color', 'cols', 'colSpan', 'complete', 'content', 'contentDocument', 'contentEditable', 'contentWindow', 'contextMenu', 'control', 'controller', 'controls', 'coords', 'crossOrigin', 'currentSrc', 'currentTime', 'data', 'dataset', 'datetime', 'default', 'defaultChecked', 'defaultMuted', 'defaultPlaybackRate', 'defaultSelected', 'defaultValue', 'defer', 'dir', 'dirName', 'disabled', 'download', 'draggable', 'dropzone', 'duration', 'elements', 'encoding', 'enctype', 'ended', 'error', 'face', 'files', 'firstChild', 'firstElementChild', 'form', 'formAction', 'formEncType', 'formMethod', 'formNoValidate', 'formTarget', 'hash', 'headers', 'height', 'hidden', 'high', 'host', 'hostname', 'href', 'hreflang', 'htmlFor', 'httpEquiv', 'id', 'images', 'indeterminate', 'index', 'innerHTML', 'inputMode', 'isContentEditable', 'isMap', 'itemId', 'itemProp', 'itemRef', 'itemScope', 'itemType', 'itemValue', 'keySystem', 'keytype', 'kind', 'label', 'labels', 'lang', 'lastChild', 'lastElementChild', 'length', 'list', 'loop', 'low', 'max', 'maxLength', 'media', 'mediaGroup', 'menu', 'method', 'min', 'multiple', 'muted', 'name', 'naturalHeight', 'naturalWidth', 'networkState', 'nextElementSibling', 'nextSibling', 'nodeName', 'nodeType', 'nodeValue', 'noValidate', 'offsetHeight', 'offsetLeft', 'offsetParent', 'offsetTop', 'offsetWidth', 'optimum', 'options', 'origin', 'outerHTML', 'ownerDocument', 'parentElement', 'parentNode', 'password', 'pathname', 'pattern', 'paused', 'placeholder', 'playbackRate', 'played', 'port', 'position', 'poster', 'preload', 'previousElementSibling', 'previousSibling', 'properties', 'protocol', 'readOnly', 'readyState', 'rel', 'relList', 'required', 'reversed', 'rowIndex', 'rows', 'rowSpan', 'sandbox', 'scope', 'scoped', 'scrollHeight', 'scrollLeft', 'scrollTop', 'scrollWidth', 'seamless', 'search', 'sectionRowIndex', 'seekable', 'seeking', 'select', 'selected', 'selectedIndex', 'selectedOptions', 'selectionDirection', 'selectionEnd', 'selectionStart', 'shadowRoot', 'sheet', 'size', 'sizes', 'sortable', 'sorted', 'span', 'spellcheck', 'src', 'srcdoc', 'srclang', 'srcset', 'start', 'step', 'style', 'tabIndex', 'tagName', 'target', 'tBodies', 'text', 'textContent', 'textLength', 'textTracks', 'tFoot', 'tHead', 'title', 'track', 'translate', 'type', 'typeMustMatch', 'undoManager', 'undoScope', 'useMap', 'username', 'validationMessage', 'validity', 'value', 'valueAsDate', 'valueAsNumber', 'videoHeight', 'videoTracks', 'videoWidth', 'volume', 'width', 'willValidate', 'wrap'];
    angular.forEach(ALL_PROPERTIES, function(prop) {
      var directiveName = ("[" + prop + "]");
      ngModule.directive(directiveName, ['$parse', '$timeout', function($parse, $timeout) {
        return {
          restrict: 'A',
          link: function(scope, element, attrs) {
            var domElement = element[0];
            var bindExpression = $parse(attrs[directiveName]);
            var curValue = bindExpression(scope);
            if (curValue === undefined) {
              curValue = domElement[prop];
              if (curValue !== undefined) {
                bindExpression.assign(scope, curValue);
              }
            } else {
              domElement[prop] = curValue;
            }
            scope.$watch((function() {
              return domElement[prop];
            }), function(newValue) {
              if (newValue !== curValue) {
                curValue = newValue;
                bindExpression.assign(scope, newValue);
              }
            });
            scope.$watch(attrs[directiveName], function(newValue) {
              if (newValue !== curValue) {
                curValue = newValue;
                domElement[prop] = newValue;
              }
            });
            if (domElement.nodeName === 'INPUT' || domElement.nodeName === 'TEXTAREA') {
              domElement.addEventListener('input', function() {
                var newValue = domElement[prop];
                if (newValue !== curValue) {
                  curValue = newValue;
                  bindExpression.assign(scope, newValue);
                  scope.$apply();
                }
              });
            }
          }
        };
      }]);
    });
  }
  function registerEventDirectives(ngModule) {
    var forceAsyncEvents = {
      'blur': true,
      'focus': true
    };
    angular.forEach('click dblclick mousedown mouseup mouseover mouseout mousemove mouseenter mouseleave keydown keyup keypress submit focus blur copy cut paste'.split(' '), function(eventName) {
      var directiveName = ("(" + eventName + ")");
      ngModule.directive(directiveName, ['$parse', '$rootScope', function($parse, $rootScope) {
        return {
          restrict: 'A',
          compile: function($element, attr) {
            var fn = $parse(attr[directiveName], null, true);
            return function ngEventHandler(scope, element) {
              element.on(eventName, function(event) {
                var callback = function() {
                  fn(scope, {$event: event});
                };
                if (forceAsyncEvents[eventName] && $rootScope.$$phase) {
                  scope.$evalAsync(callback);
                } else {
                  scope.$apply(callback);
                }
              });
            };
          }
        };
      }]);
    });
  }
  return {
    setters: [],
    execute: function() {
      $__export('default', function(ngModule) {
        registerPropertyDirectives(ngModule);
        registerEventDirectives(ngModule);
      });
      ;
    }
  };
});
