(function(global) {
  'use strict';
  if (global.$traceurRuntime) {
    return;
  }
  var $Object = Object;
  var $TypeError = TypeError;
  var $create = $Object.create;
  var $defineProperties = $Object.defineProperties;
  var $defineProperty = $Object.defineProperty;
  var $freeze = $Object.freeze;
  var $getOwnPropertyDescriptor = $Object.getOwnPropertyDescriptor;
  var $getOwnPropertyNames = $Object.getOwnPropertyNames;
  var $keys = $Object.keys;
  var $hasOwnProperty = $Object.prototype.hasOwnProperty;
  var $toString = $Object.prototype.toString;
  var $preventExtensions = Object.preventExtensions;
  var $seal = Object.seal;
  var $isExtensible = Object.isExtensible;
  function nonEnum(value) {
    return {
      configurable: true,
      enumerable: false,
      value: value,
      writable: true
    };
  }
  var method = nonEnum;
  var counter = 0;
  function newUniqueString() {
    return '__$' + Math.floor(Math.random() * 1e9) + '$' + ++counter + '$__';
  }
  var symbolInternalProperty = newUniqueString();
  var symbolDescriptionProperty = newUniqueString();
  var symbolDataProperty = newUniqueString();
  var symbolValues = $create(null);
  var privateNames = $create(null);
  function isPrivateName(s) {
    return privateNames[s];
  }
  function createPrivateName() {
    var s = newUniqueString();
    privateNames[s] = true;
    return s;
  }
  function isShimSymbol(symbol) {
    return typeof symbol === 'object' && symbol instanceof SymbolValue;
  }
  function typeOf(v) {
    if (isShimSymbol(v))
      return 'symbol';
    return typeof v;
  }
  function Symbol(description) {
    var value = new SymbolValue(description);
    if (!(this instanceof Symbol))
      return value;
    throw new TypeError('Symbol cannot be new\'ed');
  }
  $defineProperty(Symbol.prototype, 'constructor', nonEnum(Symbol));
  $defineProperty(Symbol.prototype, 'toString', method(function() {
    var symbolValue = this[symbolDataProperty];
    if (!getOption('symbols'))
      return symbolValue[symbolInternalProperty];
    if (!symbolValue)
      throw TypeError('Conversion from symbol to string');
    var desc = symbolValue[symbolDescriptionProperty];
    if (desc === undefined)
      desc = '';
    return 'Symbol(' + desc + ')';
  }));
  $defineProperty(Symbol.prototype, 'valueOf', method(function() {
    var symbolValue = this[symbolDataProperty];
    if (!symbolValue)
      throw TypeError('Conversion from symbol to string');
    if (!getOption('symbols'))
      return symbolValue[symbolInternalProperty];
    return symbolValue;
  }));
  function SymbolValue(description) {
    var key = newUniqueString();
    $defineProperty(this, symbolDataProperty, {value: this});
    $defineProperty(this, symbolInternalProperty, {value: key});
    $defineProperty(this, symbolDescriptionProperty, {value: description});
    freeze(this);
    symbolValues[key] = this;
  }
  $defineProperty(SymbolValue.prototype, 'constructor', nonEnum(Symbol));
  $defineProperty(SymbolValue.prototype, 'toString', {
    value: Symbol.prototype.toString,
    enumerable: false
  });
  $defineProperty(SymbolValue.prototype, 'valueOf', {
    value: Symbol.prototype.valueOf,
    enumerable: false
  });
  var hashProperty = createPrivateName();
  var hashPropertyDescriptor = {value: undefined};
  var hashObjectProperties = {
    hash: {value: undefined},
    self: {value: undefined}
  };
  var hashCounter = 0;
  function getOwnHashObject(object) {
    var hashObject = object[hashProperty];
    if (hashObject && hashObject.self === object)
      return hashObject;
    if ($isExtensible(object)) {
      hashObjectProperties.hash.value = hashCounter++;
      hashObjectProperties.self.value = object;
      hashPropertyDescriptor.value = $create(null, hashObjectProperties);
      $defineProperty(object, hashProperty, hashPropertyDescriptor);
      return hashPropertyDescriptor.value;
    }
    return undefined;
  }
  function freeze(object) {
    getOwnHashObject(object);
    return $freeze.apply(this, arguments);
  }
  function preventExtensions(object) {
    getOwnHashObject(object);
    return $preventExtensions.apply(this, arguments);
  }
  function seal(object) {
    getOwnHashObject(object);
    return $seal.apply(this, arguments);
  }
  freeze(SymbolValue.prototype);
  function isSymbolString(s) {
    return symbolValues[s] || privateNames[s];
  }
  function toProperty(name) {
    if (isShimSymbol(name))
      return name[symbolInternalProperty];
    return name;
  }
  function removeSymbolKeys(array) {
    var rv = [];
    for (var i = 0; i < array.length; i++) {
      if (!isSymbolString(array[i])) {
        rv.push(array[i]);
      }
    }
    return rv;
  }
  function getOwnPropertyNames(object) {
    return removeSymbolKeys($getOwnPropertyNames(object));
  }
  function keys(object) {
    return removeSymbolKeys($keys(object));
  }
  function getOwnPropertySymbols(object) {
    var rv = [];
    var names = $getOwnPropertyNames(object);
    for (var i = 0; i < names.length; i++) {
      var symbol = symbolValues[names[i]];
      if (symbol) {
        rv.push(symbol);
      }
    }
    return rv;
  }
  function getOwnPropertyDescriptor(object, name) {
    return $getOwnPropertyDescriptor(object, toProperty(name));
  }
  function hasOwnProperty(name) {
    return $hasOwnProperty.call(this, toProperty(name));
  }
  function getOption(name) {
    return global.traceur && global.traceur.options[name];
  }
  function defineProperty(object, name, descriptor) {
    if (isShimSymbol(name)) {
      name = name[symbolInternalProperty];
    }
    $defineProperty(object, name, descriptor);
    return object;
  }
  function polyfillObject(Object) {
    $defineProperty(Object, 'defineProperty', {value: defineProperty});
    $defineProperty(Object, 'getOwnPropertyNames', {value: getOwnPropertyNames});
    $defineProperty(Object, 'getOwnPropertyDescriptor', {value: getOwnPropertyDescriptor});
    $defineProperty(Object.prototype, 'hasOwnProperty', {value: hasOwnProperty});
    $defineProperty(Object, 'freeze', {value: freeze});
    $defineProperty(Object, 'preventExtensions', {value: preventExtensions});
    $defineProperty(Object, 'seal', {value: seal});
    $defineProperty(Object, 'keys', {value: keys});
  }
  function exportStar(object) {
    for (var i = 1; i < arguments.length; i++) {
      var names = $getOwnPropertyNames(arguments[i]);
      for (var j = 0; j < names.length; j++) {
        var name = names[j];
        if (isSymbolString(name))
          continue;
        (function(mod, name) {
          $defineProperty(object, name, {
            get: function() {
              return mod[name];
            },
            enumerable: true
          });
        })(arguments[i], names[j]);
      }
    }
    return object;
  }
  function isObject(x) {
    return x != null && (typeof x === 'object' || typeof x === 'function');
  }
  function toObject(x) {
    if (x == null)
      throw $TypeError();
    return $Object(x);
  }
  function checkObjectCoercible(argument) {
    if (argument == null) {
      throw new TypeError('Value cannot be converted to an Object');
    }
    return argument;
  }
  function polyfillSymbol(global, Symbol) {
    if (!global.Symbol) {
      global.Symbol = Symbol;
      Object.getOwnPropertySymbols = getOwnPropertySymbols;
    }
    if (!global.Symbol.iterator) {
      global.Symbol.iterator = Symbol('Symbol.iterator');
    }
  }
  function setupGlobals(global) {
    polyfillSymbol(global, Symbol);
    global.Reflect = global.Reflect || {};
    global.Reflect.global = global.Reflect.global || global;
    polyfillObject(global.Object);
  }
  setupGlobals(global);
  global.$traceurRuntime = {
    checkObjectCoercible: checkObjectCoercible,
    createPrivateName: createPrivateName,
    defineProperties: $defineProperties,
    defineProperty: $defineProperty,
    exportStar: exportStar,
    getOwnHashObject: getOwnHashObject,
    getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
    getOwnPropertyNames: $getOwnPropertyNames,
    isObject: isObject,
    isPrivateName: isPrivateName,
    isSymbolString: isSymbolString,
    keys: $keys,
    setupGlobals: setupGlobals,
    toObject: toObject,
    toProperty: toProperty,
    typeof: typeOf
  };
})(typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : this);
(function() {
  'use strict';
  var path;
  function relativeRequire(callerPath, requiredPath) {
    path = path || typeof require !== 'undefined' && require('path');
    function isDirectory(path) {
      return path.slice(-1) === '/';
    }
    function isAbsolute(path) {
      return path[0] === '/';
    }
    function isRelative(path) {
      return path[0] === '.';
    }
    if (isDirectory(requiredPath) || isAbsolute(requiredPath))
      return;
    return isRelative(requiredPath) ? require(path.resolve(path.dirname(callerPath), requiredPath)) : require(requiredPath);
  }
  $traceurRuntime.require = relativeRequire;
})();
(function() {
  'use strict';
  function spread() {
    var rv = [],
        j = 0,
        iterResult;
    for (var i = 0; i < arguments.length; i++) {
      var valueToSpread = $traceurRuntime.checkObjectCoercible(arguments[i]);
      if (typeof valueToSpread[$traceurRuntime.toProperty(Symbol.iterator)] !== 'function') {
        throw new TypeError('Cannot spread non-iterable object.');
      }
      var iter = valueToSpread[$traceurRuntime.toProperty(Symbol.iterator)]();
      while (!(iterResult = iter.next()).done) {
        rv[j++] = iterResult.value;
      }
    }
    return rv;
  }
  $traceurRuntime.spread = spread;
})();
(function() {
  'use strict';
  var $Object = Object;
  var $TypeError = TypeError;
  var $create = $Object.create;
  var $defineProperties = $traceurRuntime.defineProperties;
  var $defineProperty = $traceurRuntime.defineProperty;
  var $getOwnPropertyDescriptor = $traceurRuntime.getOwnPropertyDescriptor;
  var $getOwnPropertyNames = $traceurRuntime.getOwnPropertyNames;
  var $getPrototypeOf = Object.getPrototypeOf;
  var $__0 = Object,
      getOwnPropertyNames = $__0.getOwnPropertyNames,
      getOwnPropertySymbols = $__0.getOwnPropertySymbols;
  function superDescriptor(homeObject, name) {
    var proto = $getPrototypeOf(homeObject);
    do {
      var result = $getOwnPropertyDescriptor(proto, name);
      if (result)
        return result;
      proto = $getPrototypeOf(proto);
    } while (proto);
    return undefined;
  }
  function superConstructor(ctor) {
    return ctor.__proto__;
  }
  function superCall(self, homeObject, name, args) {
    return superGet(self, homeObject, name).apply(self, args);
  }
  function superGet(self, homeObject, name) {
    var descriptor = superDescriptor(homeObject, name);
    if (descriptor) {
      if (!descriptor.get)
        return descriptor.value;
      return descriptor.get.call(self);
    }
    return undefined;
  }
  function superSet(self, homeObject, name, value) {
    var descriptor = superDescriptor(homeObject, name);
    if (descriptor && descriptor.set) {
      descriptor.set.call(self, value);
      return value;
    }
    throw $TypeError(("super has no setter '" + name + "'."));
  }
  function getDescriptors(object) {
    var descriptors = {};
    var names = getOwnPropertyNames(object);
    for (var i = 0; i < names.length; i++) {
      var name = names[i];
      descriptors[name] = $getOwnPropertyDescriptor(object, name);
    }
    var symbols = getOwnPropertySymbols(object);
    for (var i = 0; i < symbols.length; i++) {
      var symbol = symbols[i];
      descriptors[$traceurRuntime.toProperty(symbol)] = $getOwnPropertyDescriptor(object, $traceurRuntime.toProperty(symbol));
    }
    return descriptors;
  }
  function createClass(ctor, object, staticObject, superClass) {
    $defineProperty(object, 'constructor', {
      value: ctor,
      configurable: true,
      enumerable: false,
      writable: true
    });
    if (arguments.length > 3) {
      if (typeof superClass === 'function')
        ctor.__proto__ = superClass;
      ctor.prototype = $create(getProtoParent(superClass), getDescriptors(object));
    } else {
      ctor.prototype = object;
    }
    $defineProperty(ctor, 'prototype', {
      configurable: false,
      writable: false
    });
    return $defineProperties(ctor, getDescriptors(staticObject));
  }
  function getProtoParent(superClass) {
    if (typeof superClass === 'function') {
      var prototype = superClass.prototype;
      if ($Object(prototype) === prototype || prototype === null)
        return superClass.prototype;
      throw new $TypeError('super prototype must be an Object or null');
    }
    if (superClass === null)
      return null;
    throw new $TypeError(("Super expression must either be null or a function, not " + typeof superClass + "."));
  }
  function defaultSuperCall(self, homeObject, args) {
    if ($getPrototypeOf(homeObject) !== null)
      superCall(self, homeObject, 'constructor', args);
  }
  $traceurRuntime.createClass = createClass;
  $traceurRuntime.defaultSuperCall = defaultSuperCall;
  $traceurRuntime.superCall = superCall;
  $traceurRuntime.superConstructor = superConstructor;
  $traceurRuntime.superGet = superGet;
  $traceurRuntime.superSet = superSet;
})();
(function() {
  'use strict';
  if (typeof $traceurRuntime !== 'object') {
    throw new Error('traceur runtime not found.');
  }
  var createPrivateName = $traceurRuntime.createPrivateName;
  var $defineProperties = $traceurRuntime.defineProperties;
  var $defineProperty = $traceurRuntime.defineProperty;
  var $create = Object.create;
  var $TypeError = TypeError;
  function nonEnum(value) {
    return {
      configurable: true,
      enumerable: false,
      value: value,
      writable: true
    };
  }
  var ST_NEWBORN = 0;
  var ST_EXECUTING = 1;
  var ST_SUSPENDED = 2;
  var ST_CLOSED = 3;
  var END_STATE = -2;
  var RETHROW_STATE = -3;
  function getInternalError(state) {
    return new Error('Traceur compiler bug: invalid state in state machine: ' + state);
  }
  function GeneratorContext() {
    this.state = 0;
    this.GState = ST_NEWBORN;
    this.storedException = undefined;
    this.finallyFallThrough = undefined;
    this.sent_ = undefined;
    this.returnValue = undefined;
    this.tryStack_ = [];
  }
  GeneratorContext.prototype = {
    pushTry: function(catchState, finallyState) {
      if (finallyState !== null) {
        var finallyFallThrough = null;
        for (var i = this.tryStack_.length - 1; i >= 0; i--) {
          if (this.tryStack_[i].catch !== undefined) {
            finallyFallThrough = this.tryStack_[i].catch;
            break;
          }
        }
        if (finallyFallThrough === null)
          finallyFallThrough = RETHROW_STATE;
        this.tryStack_.push({
          finally: finallyState,
          finallyFallThrough: finallyFallThrough
        });
      }
      if (catchState !== null) {
        this.tryStack_.push({catch: catchState});
      }
    },
    popTry: function() {
      this.tryStack_.pop();
    },
    get sent() {
      this.maybeThrow();
      return this.sent_;
    },
    set sent(v) {
      this.sent_ = v;
    },
    get sentIgnoreThrow() {
      return this.sent_;
    },
    maybeThrow: function() {
      if (this.action === 'throw') {
        this.action = 'next';
        throw this.sent_;
      }
    },
    end: function() {
      switch (this.state) {
        case END_STATE:
          return this;
        case RETHROW_STATE:
          throw this.storedException;
        default:
          throw getInternalError(this.state);
      }
    },
    handleException: function(ex) {
      this.GState = ST_CLOSED;
      this.state = END_STATE;
      throw ex;
    }
  };
  function nextOrThrow(ctx, moveNext, action, x) {
    switch (ctx.GState) {
      case ST_EXECUTING:
        throw new Error(("\"" + action + "\" on executing generator"));
      case ST_CLOSED:
        if (action == 'next') {
          return {
            value: undefined,
            done: true
          };
        }
        throw x;
      case ST_NEWBORN:
        if (action === 'throw') {
          ctx.GState = ST_CLOSED;
          throw x;
        }
        if (x !== undefined)
          throw $TypeError('Sent value to newborn generator');
      case ST_SUSPENDED:
        ctx.GState = ST_EXECUTING;
        ctx.action = action;
        ctx.sent = x;
        var value = moveNext(ctx);
        var done = value === ctx;
        if (done)
          value = ctx.returnValue;
        ctx.GState = done ? ST_CLOSED : ST_SUSPENDED;
        return {
          value: value,
          done: done
        };
    }
  }
  var ctxName = createPrivateName();
  var moveNextName = createPrivateName();
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}
  GeneratorFunction.prototype = GeneratorFunctionPrototype;
  $defineProperty(GeneratorFunctionPrototype, 'constructor', nonEnum(GeneratorFunction));
  GeneratorFunctionPrototype.prototype = {
    constructor: GeneratorFunctionPrototype,
    next: function(v) {
      return nextOrThrow(this[ctxName], this[moveNextName], 'next', v);
    },
    throw: function(v) {
      return nextOrThrow(this[ctxName], this[moveNextName], 'throw', v);
    }
  };
  $defineProperties(GeneratorFunctionPrototype.prototype, {
    constructor: {enumerable: false},
    next: {enumerable: false},
    throw: {enumerable: false}
  });
  Object.defineProperty(GeneratorFunctionPrototype.prototype, Symbol.iterator, nonEnum(function() {
    return this;
  }));
  function createGeneratorInstance(innerFunction, functionObject, self) {
    var moveNext = getMoveNext(innerFunction, self);
    var ctx = new GeneratorContext();
    var object = $create(functionObject.prototype);
    object[ctxName] = ctx;
    object[moveNextName] = moveNext;
    return object;
  }
  function initGeneratorFunction(functionObject) {
    functionObject.prototype = $create(GeneratorFunctionPrototype.prototype);
    functionObject.__proto__ = GeneratorFunctionPrototype;
    return functionObject;
  }
  function AsyncFunctionContext() {
    GeneratorContext.call(this);
    this.err = undefined;
    var ctx = this;
    ctx.result = new Promise(function(resolve, reject) {
      ctx.resolve = resolve;
      ctx.reject = reject;
    });
  }
  AsyncFunctionContext.prototype = $create(GeneratorContext.prototype);
  AsyncFunctionContext.prototype.end = function() {
    switch (this.state) {
      case END_STATE:
        this.resolve(this.returnValue);
        break;
      case RETHROW_STATE:
        this.reject(this.storedException);
        break;
      default:
        this.reject(getInternalError(this.state));
    }
  };
  AsyncFunctionContext.prototype.handleException = function() {
    this.state = RETHROW_STATE;
  };
  function asyncWrap(innerFunction, self) {
    var moveNext = getMoveNext(innerFunction, self);
    var ctx = new AsyncFunctionContext();
    ctx.createCallback = function(newState) {
      return function(value) {
        ctx.state = newState;
        ctx.value = value;
        moveNext(ctx);
      };
    };
    ctx.errback = function(err) {
      handleCatch(ctx, err);
      moveNext(ctx);
    };
    moveNext(ctx);
    return ctx.result;
  }
  function getMoveNext(innerFunction, self) {
    return function(ctx) {
      while (true) {
        try {
          return innerFunction.call(self, ctx);
        } catch (ex) {
          handleCatch(ctx, ex);
        }
      }
    };
  }
  function handleCatch(ctx, ex) {
    ctx.storedException = ex;
    var last = ctx.tryStack_[ctx.tryStack_.length - 1];
    if (!last) {
      ctx.handleException(ex);
      return;
    }
    ctx.state = last.catch !== undefined ? last.catch : last.finally;
    if (last.finallyFallThrough !== undefined)
      ctx.finallyFallThrough = last.finallyFallThrough;
  }
  $traceurRuntime.asyncWrap = asyncWrap;
  $traceurRuntime.initGeneratorFunction = initGeneratorFunction;
  $traceurRuntime.createGeneratorInstance = createGeneratorInstance;
})();
(function() {
  function buildFromEncodedParts(opt_scheme, opt_userInfo, opt_domain, opt_port, opt_path, opt_queryData, opt_fragment) {
    var out = [];
    if (opt_scheme) {
      out.push(opt_scheme, ':');
    }
    if (opt_domain) {
      out.push('//');
      if (opt_userInfo) {
        out.push(opt_userInfo, '@');
      }
      out.push(opt_domain);
      if (opt_port) {
        out.push(':', opt_port);
      }
    }
    if (opt_path) {
      out.push(opt_path);
    }
    if (opt_queryData) {
      out.push('?', opt_queryData);
    }
    if (opt_fragment) {
      out.push('#', opt_fragment);
    }
    return out.join('');
  }
  ;
  var splitRe = new RegExp('^' + '(?:' + '([^:/?#.]+)' + ':)?' + '(?://' + '(?:([^/?#]*)@)?' + '([\\w\\d\\-\\u0100-\\uffff.%]*)' + '(?::([0-9]+))?' + ')?' + '([^?#]+)?' + '(?:\\?([^#]*))?' + '(?:#(.*))?' + '$');
  var ComponentIndex = {
    SCHEME: 1,
    USER_INFO: 2,
    DOMAIN: 3,
    PORT: 4,
    PATH: 5,
    QUERY_DATA: 6,
    FRAGMENT: 7
  };
  function split(uri) {
    return (uri.match(splitRe));
  }
  function removeDotSegments(path) {
    if (path === '/')
      return '/';
    var leadingSlash = path[0] === '/' ? '/' : '';
    var trailingSlash = path.slice(-1) === '/' ? '/' : '';
    var segments = path.split('/');
    var out = [];
    var up = 0;
    for (var pos = 0; pos < segments.length; pos++) {
      var segment = segments[pos];
      switch (segment) {
        case '':
        case '.':
          break;
        case '..':
          if (out.length)
            out.pop();
          else
            up++;
          break;
        default:
          out.push(segment);
      }
    }
    if (!leadingSlash) {
      while (up-- > 0) {
        out.unshift('..');
      }
      if (out.length === 0)
        out.push('.');
    }
    return leadingSlash + out.join('/') + trailingSlash;
  }
  function joinAndCanonicalizePath(parts) {
    var path = parts[ComponentIndex.PATH] || '';
    path = removeDotSegments(path);
    parts[ComponentIndex.PATH] = path;
    return buildFromEncodedParts(parts[ComponentIndex.SCHEME], parts[ComponentIndex.USER_INFO], parts[ComponentIndex.DOMAIN], parts[ComponentIndex.PORT], parts[ComponentIndex.PATH], parts[ComponentIndex.QUERY_DATA], parts[ComponentIndex.FRAGMENT]);
  }
  function canonicalizeUrl(url) {
    var parts = split(url);
    return joinAndCanonicalizePath(parts);
  }
  function resolveUrl(base, url) {
    var parts = split(url);
    var baseParts = split(base);
    if (parts[ComponentIndex.SCHEME]) {
      return joinAndCanonicalizePath(parts);
    } else {
      parts[ComponentIndex.SCHEME] = baseParts[ComponentIndex.SCHEME];
    }
    for (var i = ComponentIndex.SCHEME; i <= ComponentIndex.PORT; i++) {
      if (!parts[i]) {
        parts[i] = baseParts[i];
      }
    }
    if (parts[ComponentIndex.PATH][0] == '/') {
      return joinAndCanonicalizePath(parts);
    }
    var path = baseParts[ComponentIndex.PATH];
    var index = path.lastIndexOf('/');
    path = path.slice(0, index + 1) + parts[ComponentIndex.PATH];
    parts[ComponentIndex.PATH] = path;
    return joinAndCanonicalizePath(parts);
  }
  function isAbsolute(name) {
    if (!name)
      return false;
    if (name[0] === '/')
      return true;
    var parts = split(name);
    if (parts[ComponentIndex.SCHEME])
      return true;
    return false;
  }
  $traceurRuntime.canonicalizeUrl = canonicalizeUrl;
  $traceurRuntime.isAbsolute = isAbsolute;
  $traceurRuntime.removeDotSegments = removeDotSegments;
  $traceurRuntime.resolveUrl = resolveUrl;
})();
(function() {
  'use strict';
  var types = {
    any: {name: 'any'},
    boolean: {name: 'boolean'},
    number: {name: 'number'},
    string: {name: 'string'},
    symbol: {name: 'symbol'},
    void: {name: 'void'}
  };
  var GenericType = function GenericType(type, argumentTypes) {
    this.type = type;
    this.argumentTypes = argumentTypes;
  };
  ($traceurRuntime.createClass)(GenericType, {}, {});
  var typeRegister = Object.create(null);
  function genericType(type) {
    for (var argumentTypes = [],
        $__1 = 1; $__1 < arguments.length; $__1++)
      argumentTypes[$__1 - 1] = arguments[$__1];
    var typeMap = typeRegister;
    var key = $traceurRuntime.getOwnHashObject(type).hash;
    if (!typeMap[key]) {
      typeMap[key] = Object.create(null);
    }
    typeMap = typeMap[key];
    for (var i = 0; i < argumentTypes.length - 1; i++) {
      key = $traceurRuntime.getOwnHashObject(argumentTypes[i]).hash;
      if (!typeMap[key]) {
        typeMap[key] = Object.create(null);
      }
      typeMap = typeMap[key];
    }
    var tail = argumentTypes[argumentTypes.length - 1];
    key = $traceurRuntime.getOwnHashObject(tail).hash;
    if (!typeMap[key]) {
      typeMap[key] = new GenericType(type, argumentTypes);
    }
    return typeMap[key];
  }
  $traceurRuntime.GenericType = GenericType;
  $traceurRuntime.genericType = genericType;
  $traceurRuntime.type = types;
})();
(function(global) {
  'use strict';
  var $__2 = $traceurRuntime,
      canonicalizeUrl = $__2.canonicalizeUrl,
      resolveUrl = $__2.resolveUrl,
      isAbsolute = $__2.isAbsolute;
  var moduleInstantiators = Object.create(null);
  var baseURL;
  if (global.location && global.location.href)
    baseURL = resolveUrl(global.location.href, './');
  else
    baseURL = '';
  var UncoatedModuleEntry = function UncoatedModuleEntry(url, uncoatedModule) {
    this.url = url;
    this.value_ = uncoatedModule;
  };
  ($traceurRuntime.createClass)(UncoatedModuleEntry, {}, {});
  var ModuleEvaluationError = function ModuleEvaluationError(erroneousModuleName, cause) {
    this.message = this.constructor.name + ': ' + this.stripCause(cause) + ' in ' + erroneousModuleName;
    if (!(cause instanceof $ModuleEvaluationError) && cause.stack)
      this.stack = this.stripStack(cause.stack);
    else
      this.stack = '';
  };
  var $ModuleEvaluationError = ModuleEvaluationError;
  ($traceurRuntime.createClass)(ModuleEvaluationError, {
    stripError: function(message) {
      return message.replace(/.*Error:/, this.constructor.name + ':');
    },
    stripCause: function(cause) {
      if (!cause)
        return '';
      if (!cause.message)
        return cause + '';
      return this.stripError(cause.message);
    },
    loadedBy: function(moduleName) {
      this.stack += '\n loaded by ' + moduleName;
    },
    stripStack: function(causeStack) {
      var stack = [];
      causeStack.split('\n').some((function(frame) {
        if (/UncoatedModuleInstantiator/.test(frame))
          return true;
        stack.push(frame);
      }));
      stack[0] = this.stripError(stack[0]);
      return stack.join('\n');
    }
  }, {}, Error);
  function beforeLines(lines, number) {
    var result = [];
    var first = number - 3;
    if (first < 0)
      first = 0;
    for (var i = first; i < number; i++) {
      result.push(lines[i]);
    }
    return result;
  }
  function afterLines(lines, number) {
    var last = number + 1;
    if (last > lines.length - 1)
      last = lines.length - 1;
    var result = [];
    for (var i = number; i <= last; i++) {
      result.push(lines[i]);
    }
    return result;
  }
  function columnSpacing(columns) {
    var result = '';
    for (var i = 0; i < columns - 1; i++) {
      result += '-';
    }
    return result;
  }
  var UncoatedModuleInstantiator = function UncoatedModuleInstantiator(url, func) {
    $traceurRuntime.superConstructor($UncoatedModuleInstantiator).call(this, url, null);
    this.func = func;
  };
  var $UncoatedModuleInstantiator = UncoatedModuleInstantiator;
  ($traceurRuntime.createClass)(UncoatedModuleInstantiator, {getUncoatedModule: function() {
      if (this.value_)
        return this.value_;
      try {
        var relativeRequire;
        if (typeof $traceurRuntime !== undefined) {
          relativeRequire = $traceurRuntime.require.bind(null, this.url);
        }
        return this.value_ = this.func.call(global, relativeRequire);
      } catch (ex) {
        if (ex instanceof ModuleEvaluationError) {
          ex.loadedBy(this.url);
          throw ex;
        }
        if (ex.stack) {
          var lines = this.func.toString().split('\n');
          var evaled = [];
          ex.stack.split('\n').some(function(frame) {
            if (frame.indexOf('UncoatedModuleInstantiator.getUncoatedModule') > 0)
              return true;
            var m = /(at\s[^\s]*\s).*>:(\d*):(\d*)\)/.exec(frame);
            if (m) {
              var line = parseInt(m[2], 10);
              evaled = evaled.concat(beforeLines(lines, line));
              evaled.push(columnSpacing(m[3]) + '^');
              evaled = evaled.concat(afterLines(lines, line));
              evaled.push('= = = = = = = = =');
            } else {
              evaled.push(frame);
            }
          });
          ex.stack = evaled.join('\n');
        }
        throw new ModuleEvaluationError(this.url, ex);
      }
    }}, {}, UncoatedModuleEntry);
  function getUncoatedModuleInstantiator(name) {
    if (!name)
      return;
    var url = ModuleStore.normalize(name);
    return moduleInstantiators[url];
  }
  ;
  var moduleInstances = Object.create(null);
  var liveModuleSentinel = {};
  function Module(uncoatedModule) {
    var isLive = arguments[1];
    var coatedModule = Object.create(null);
    Object.getOwnPropertyNames(uncoatedModule).forEach((function(name) {
      var getter,
          value;
      if (isLive === liveModuleSentinel) {
        var descr = Object.getOwnPropertyDescriptor(uncoatedModule, name);
        if (descr.get)
          getter = descr.get;
      }
      if (!getter) {
        value = uncoatedModule[name];
        getter = function() {
          return value;
        };
      }
      Object.defineProperty(coatedModule, name, {
        get: getter,
        enumerable: true
      });
    }));
    Object.preventExtensions(coatedModule);
    return coatedModule;
  }
  var ModuleStore = {
    normalize: function(name, refererName, refererAddress) {
      if (typeof name !== 'string')
        throw new TypeError('module name must be a string, not ' + typeof name);
      if (isAbsolute(name))
        return canonicalizeUrl(name);
      if (/[^\.]\/\.\.\//.test(name)) {
        throw new Error('module name embeds /../: ' + name);
      }
      if (name[0] === '.' && refererName)
        return resolveUrl(refererName, name);
      return canonicalizeUrl(name);
    },
    get: function(normalizedName) {
      var m = getUncoatedModuleInstantiator(normalizedName);
      if (!m)
        return undefined;
      var moduleInstance = moduleInstances[m.url];
      if (moduleInstance)
        return moduleInstance;
      moduleInstance = Module(m.getUncoatedModule(), liveModuleSentinel);
      return moduleInstances[m.url] = moduleInstance;
    },
    set: function(normalizedName, module) {
      normalizedName = String(normalizedName);
      moduleInstantiators[normalizedName] = new UncoatedModuleInstantiator(normalizedName, (function() {
        return module;
      }));
      moduleInstances[normalizedName] = module;
    },
    get baseURL() {
      return baseURL;
    },
    set baseURL(v) {
      baseURL = String(v);
    },
    registerModule: function(name, deps, func) {
      var normalizedName = ModuleStore.normalize(name);
      if (moduleInstantiators[normalizedName])
        throw new Error('duplicate module named ' + normalizedName);
      moduleInstantiators[normalizedName] = new UncoatedModuleInstantiator(normalizedName, func);
    },
    bundleStore: Object.create(null),
    register: function(name, deps, func) {
      if (!deps || !deps.length && !func.length) {
        this.registerModule(name, deps, func);
      } else {
        this.bundleStore[name] = {
          deps: deps,
          execute: function() {
            var $__0 = arguments;
            var depMap = {};
            deps.forEach((function(dep, index) {
              return depMap[dep] = $__0[index];
            }));
            var registryEntry = func.call(this, depMap);
            registryEntry.execute.call(this);
            return registryEntry.exports;
          }
        };
      }
    },
    getAnonymousModule: function(func) {
      return new Module(func.call(global), liveModuleSentinel);
    },
    getForTesting: function(name) {
      var $__0 = this;
      if (!this.testingPrefix_) {
        Object.keys(moduleInstances).some((function(key) {
          var m = /(traceur@[^\/]*\/)/.exec(key);
          if (m) {
            $__0.testingPrefix_ = m[1];
            return true;
          }
        }));
      }
      return this.get(this.testingPrefix_ + name);
    }
  };
  var moduleStoreModule = new Module({ModuleStore: ModuleStore});
  ModuleStore.set('@traceur/src/runtime/ModuleStore', moduleStoreModule);
  ModuleStore.set('@traceur/src/runtime/ModuleStore.js', moduleStoreModule);
  var setupGlobals = $traceurRuntime.setupGlobals;
  $traceurRuntime.setupGlobals = function(global) {
    setupGlobals(global);
  };
  $traceurRuntime.ModuleStore = ModuleStore;
  global.System = {
    register: ModuleStore.register.bind(ModuleStore),
    registerModule: ModuleStore.registerModule.bind(ModuleStore),
    get: ModuleStore.get,
    set: ModuleStore.set,
    normalize: ModuleStore.normalize
  };
  $traceurRuntime.getModuleImpl = function(name) {
    var instantiator = getUncoatedModuleInstantiator(name);
    return instantiator && instantiator.getUncoatedModule();
  };
})(typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : this);
System.registerModule("traceur-runtime@0.0.79/src/runtime/polyfills/utils.js", [], function() {
  "use strict";
  var __moduleName = "traceur-runtime@0.0.79/src/runtime/polyfills/utils.js";
  var $ceil = Math.ceil;
  var $floor = Math.floor;
  var $isFinite = isFinite;
  var $isNaN = isNaN;
  var $pow = Math.pow;
  var $min = Math.min;
  var toObject = $traceurRuntime.toObject;
  function toUint32(x) {
    return x >>> 0;
  }
  function isObject(x) {
    return x && (typeof x === 'object' || typeof x === 'function');
  }
  function isCallable(x) {
    return typeof x === 'function';
  }
  function isNumber(x) {
    return typeof x === 'number';
  }
  function toInteger(x) {
    x = +x;
    if ($isNaN(x))
      return 0;
    if (x === 0 || !$isFinite(x))
      return x;
    return x > 0 ? $floor(x) : $ceil(x);
  }
  var MAX_SAFE_LENGTH = $pow(2, 53) - 1;
  function toLength(x) {
    var len = toInteger(x);
    return len < 0 ? 0 : $min(len, MAX_SAFE_LENGTH);
  }
  function checkIterable(x) {
    return !isObject(x) ? undefined : x[Symbol.iterator];
  }
  function isConstructor(x) {
    return isCallable(x);
  }
  function createIteratorResultObject(value, done) {
    return {
      value: value,
      done: done
    };
  }
  function maybeDefine(object, name, descr) {
    if (!(name in object)) {
      Object.defineProperty(object, name, descr);
    }
  }
  function maybeDefineMethod(object, name, value) {
    maybeDefine(object, name, {
      value: value,
      configurable: true,
      enumerable: false,
      writable: true
    });
  }
  function maybeDefineConst(object, name, value) {
    maybeDefine(object, name, {
      value: value,
      configurable: false,
      enumerable: false,
      writable: false
    });
  }
  function maybeAddFunctions(object, functions) {
    for (var i = 0; i < functions.length; i += 2) {
      var name = functions[i];
      var value = functions[i + 1];
      maybeDefineMethod(object, name, value);
    }
  }
  function maybeAddConsts(object, consts) {
    for (var i = 0; i < consts.length; i += 2) {
      var name = consts[i];
      var value = consts[i + 1];
      maybeDefineConst(object, name, value);
    }
  }
  function maybeAddIterator(object, func, Symbol) {
    if (!Symbol || !Symbol.iterator || object[Symbol.iterator])
      return;
    if (object['@@iterator'])
      func = object['@@iterator'];
    Object.defineProperty(object, Symbol.iterator, {
      value: func,
      configurable: true,
      enumerable: false,
      writable: true
    });
  }
  var polyfills = [];
  function registerPolyfill(func) {
    polyfills.push(func);
  }
  function polyfillAll(global) {
    polyfills.forEach((function(f) {
      return f(global);
    }));
  }
  return {
    get toObject() {
      return toObject;
    },
    get toUint32() {
      return toUint32;
    },
    get isObject() {
      return isObject;
    },
    get isCallable() {
      return isCallable;
    },
    get isNumber() {
      return isNumber;
    },
    get toInteger() {
      return toInteger;
    },
    get toLength() {
      return toLength;
    },
    get checkIterable() {
      return checkIterable;
    },
    get isConstructor() {
      return isConstructor;
    },
    get createIteratorResultObject() {
      return createIteratorResultObject;
    },
    get maybeDefine() {
      return maybeDefine;
    },
    get maybeDefineMethod() {
      return maybeDefineMethod;
    },
    get maybeDefineConst() {
      return maybeDefineConst;
    },
    get maybeAddFunctions() {
      return maybeAddFunctions;
    },
    get maybeAddConsts() {
      return maybeAddConsts;
    },
    get maybeAddIterator() {
      return maybeAddIterator;
    },
    get registerPolyfill() {
      return registerPolyfill;
    },
    get polyfillAll() {
      return polyfillAll;
    }
  };
});
System.registerModule("traceur-runtime@0.0.79/src/runtime/polyfills/Map.js", [], function() {
  "use strict";
  var __moduleName = "traceur-runtime@0.0.79/src/runtime/polyfills/Map.js";
  var $__0 = System.get("traceur-runtime@0.0.79/src/runtime/polyfills/utils.js"),
      isObject = $__0.isObject,
      maybeAddIterator = $__0.maybeAddIterator,
      registerPolyfill = $__0.registerPolyfill;
  var getOwnHashObject = $traceurRuntime.getOwnHashObject;
  var $hasOwnProperty = Object.prototype.hasOwnProperty;
  var deletedSentinel = {};
  function lookupIndex(map, key) {
    if (isObject(key)) {
      var hashObject = getOwnHashObject(key);
      return hashObject && map.objectIndex_[hashObject.hash];
    }
    if (typeof key === 'string')
      return map.stringIndex_[key];
    return map.primitiveIndex_[key];
  }
  function initMap(map) {
    map.entries_ = [];
    map.objectIndex_ = Object.create(null);
    map.stringIndex_ = Object.create(null);
    map.primitiveIndex_ = Object.create(null);
    map.deletedCount_ = 0;
  }
  var Map = function Map() {
    var iterable = arguments[0];
    if (!isObject(this))
      throw new TypeError('Map called on incompatible type');
    if ($hasOwnProperty.call(this, 'entries_')) {
      throw new TypeError('Map can not be reentrantly initialised');
    }
    initMap(this);
    if (iterable !== null && iterable !== undefined) {
      for (var $__2 = iterable[$traceurRuntime.toProperty(Symbol.iterator)](),
          $__3; !($__3 = $__2.next()).done; ) {
        var $__4 = $__3.value,
            key = $__4[0],
            value = $__4[1];
        {
          this.set(key, value);
        }
      }
    }
  };
  ($traceurRuntime.createClass)(Map, {
    get size() {
      return this.entries_.length / 2 - this.deletedCount_;
    },
    get: function(key) {
      var index = lookupIndex(this, key);
      if (index !== undefined)
        return this.entries_[index + 1];
    },
    set: function(key, value) {
      var objectMode = isObject(key);
      var stringMode = typeof key === 'string';
      var index = lookupIndex(this, key);
      if (index !== undefined) {
        this.entries_[index + 1] = value;
      } else {
        index = this.entries_.length;
        this.entries_[index] = key;
        this.entries_[index + 1] = value;
        if (objectMode) {
          var hashObject = getOwnHashObject(key);
          var hash = hashObject.hash;
          this.objectIndex_[hash] = index;
        } else if (stringMode) {
          this.stringIndex_[key] = index;
        } else {
          this.primitiveIndex_[key] = index;
        }
      }
      return this;
    },
    has: function(key) {
      return lookupIndex(this, key) !== undefined;
    },
    delete: function(key) {
      var objectMode = isObject(key);
      var stringMode = typeof key === 'string';
      var index;
      var hash;
      if (objectMode) {
        var hashObject = getOwnHashObject(key);
        if (hashObject) {
          index = this.objectIndex_[hash = hashObject.hash];
          delete this.objectIndex_[hash];
        }
      } else if (stringMode) {
        index = this.stringIndex_[key];
        delete this.stringIndex_[key];
      } else {
        index = this.primitiveIndex_[key];
        delete this.primitiveIndex_[key];
      }
      if (index !== undefined) {
        this.entries_[index] = deletedSentinel;
        this.entries_[index + 1] = undefined;
        this.deletedCount_++;
        return true;
      }
      return false;
    },
    clear: function() {
      initMap(this);
    },
    forEach: function(callbackFn) {
      var thisArg = arguments[1];
      for (var i = 0; i < this.entries_.length; i += 2) {
        var key = this.entries_[i];
        var value = this.entries_[i + 1];
        if (key === deletedSentinel)
          continue;
        callbackFn.call(thisArg, value, key, this);
      }
    },
    entries: $traceurRuntime.initGeneratorFunction(function $__5() {
      var i,
          key,
          value;
      return $traceurRuntime.createGeneratorInstance(function($ctx) {
        while (true)
          switch ($ctx.state) {
            case 0:
              i = 0;
              $ctx.state = 12;
              break;
            case 12:
              $ctx.state = (i < this.entries_.length) ? 8 : -2;
              break;
            case 4:
              i += 2;
              $ctx.state = 12;
              break;
            case 8:
              key = this.entries_[i];
              value = this.entries_[i + 1];
              $ctx.state = 9;
              break;
            case 9:
              $ctx.state = (key === deletedSentinel) ? 4 : 6;
              break;
            case 6:
              $ctx.state = 2;
              return [key, value];
            case 2:
              $ctx.maybeThrow();
              $ctx.state = 4;
              break;
            default:
              return $ctx.end();
          }
      }, $__5, this);
    }),
    keys: $traceurRuntime.initGeneratorFunction(function $__6() {
      var i,
          key,
          value;
      return $traceurRuntime.createGeneratorInstance(function($ctx) {
        while (true)
          switch ($ctx.state) {
            case 0:
              i = 0;
              $ctx.state = 12;
              break;
            case 12:
              $ctx.state = (i < this.entries_.length) ? 8 : -2;
              break;
            case 4:
              i += 2;
              $ctx.state = 12;
              break;
            case 8:
              key = this.entries_[i];
              value = this.entries_[i + 1];
              $ctx.state = 9;
              break;
            case 9:
              $ctx.state = (key === deletedSentinel) ? 4 : 6;
              break;
            case 6:
              $ctx.state = 2;
              return key;
            case 2:
              $ctx.maybeThrow();
              $ctx.state = 4;
              break;
            default:
              return $ctx.end();
          }
      }, $__6, this);
    }),
    values: $traceurRuntime.initGeneratorFunction(function $__7() {
      var i,
          key,
          value;
      return $traceurRuntime.createGeneratorInstance(function($ctx) {
        while (true)
          switch ($ctx.state) {
            case 0:
              i = 0;
              $ctx.state = 12;
              break;
            case 12:
              $ctx.state = (i < this.entries_.length) ? 8 : -2;
              break;
            case 4:
              i += 2;
              $ctx.state = 12;
              break;
            case 8:
              key = this.entries_[i];
              value = this.entries_[i + 1];
              $ctx.state = 9;
              break;
            case 9:
              $ctx.state = (key === deletedSentinel) ? 4 : 6;
              break;
            case 6:
              $ctx.state = 2;
              return value;
            case 2:
              $ctx.maybeThrow();
              $ctx.state = 4;
              break;
            default:
              return $ctx.end();
          }
      }, $__7, this);
    })
  }, {});
  Object.defineProperty(Map.prototype, Symbol.iterator, {
    configurable: true,
    writable: true,
    value: Map.prototype.entries
  });
  function polyfillMap(global) {
    var $__4 = global,
        Object = $__4.Object,
        Symbol = $__4.Symbol;
    if (!global.Map)
      global.Map = Map;
    var mapPrototype = global.Map.prototype;
    if (mapPrototype.entries === undefined)
      global.Map = Map;
    if (mapPrototype.entries) {
      maybeAddIterator(mapPrototype, mapPrototype.entries, Symbol);
      maybeAddIterator(Object.getPrototypeOf(new global.Map().entries()), function() {
        return this;
      }, Symbol);
    }
  }
  registerPolyfill(polyfillMap);
  return {
    get Map() {
      return Map;
    },
    get polyfillMap() {
      return polyfillMap;
    }
  };
});
System.get("traceur-runtime@0.0.79/src/runtime/polyfills/Map.js" + '');
System.registerModule("traceur-runtime@0.0.79/src/runtime/polyfills/Set.js", [], function() {
  "use strict";
  var __moduleName = "traceur-runtime@0.0.79/src/runtime/polyfills/Set.js";
  var $__0 = System.get("traceur-runtime@0.0.79/src/runtime/polyfills/utils.js"),
      isObject = $__0.isObject,
      maybeAddIterator = $__0.maybeAddIterator,
      registerPolyfill = $__0.registerPolyfill;
  var Map = System.get("traceur-runtime@0.0.79/src/runtime/polyfills/Map.js").Map;
  var getOwnHashObject = $traceurRuntime.getOwnHashObject;
  var $hasOwnProperty = Object.prototype.hasOwnProperty;
  function initSet(set) {
    set.map_ = new Map();
  }
  var Set = function Set() {
    var iterable = arguments[0];
    if (!isObject(this))
      throw new TypeError('Set called on incompatible type');
    if ($hasOwnProperty.call(this, 'map_')) {
      throw new TypeError('Set can not be reentrantly initialised');
    }
    initSet(this);
    if (iterable !== null && iterable !== undefined) {
      for (var $__4 = iterable[$traceurRuntime.toProperty(Symbol.iterator)](),
          $__5; !($__5 = $__4.next()).done; ) {
        var item = $__5.value;
        {
          this.add(item);
        }
      }
    }
  };
  ($traceurRuntime.createClass)(Set, {
    get size() {
      return this.map_.size;
    },
    has: function(key) {
      return this.map_.has(key);
    },
    add: function(key) {
      this.map_.set(key, key);
      return this;
    },
    delete: function(key) {
      return this.map_.delete(key);
    },
    clear: function() {
      return this.map_.clear();
    },
    forEach: function(callbackFn) {
      var thisArg = arguments[1];
      var $__2 = this;
      return this.map_.forEach((function(value, key) {
        callbackFn.call(thisArg, key, key, $__2);
      }));
    },
    values: $traceurRuntime.initGeneratorFunction(function $__7() {
      var $__8,
          $__9;
      return $traceurRuntime.createGeneratorInstance(function($ctx) {
        while (true)
          switch ($ctx.state) {
            case 0:
              $__8 = this.map_.keys()[Symbol.iterator]();
              $ctx.sent = void 0;
              $ctx.action = 'next';
              $ctx.state = 12;
              break;
            case 12:
              $__9 = $__8[$ctx.action]($ctx.sentIgnoreThrow);
              $ctx.state = 9;
              break;
            case 9:
              $ctx.state = ($__9.done) ? 3 : 2;
              break;
            case 3:
              $ctx.sent = $__9.value;
              $ctx.state = -2;
              break;
            case 2:
              $ctx.state = 12;
              return $__9.value;
            default:
              return $ctx.end();
          }
      }, $__7, this);
    }),
    entries: $traceurRuntime.initGeneratorFunction(function $__10() {
      var $__11,
          $__12;
      return $traceurRuntime.createGeneratorInstance(function($ctx) {
        while (true)
          switch ($ctx.state) {
            case 0:
              $__11 = this.map_.entries()[Symbol.iterator]();
              $ctx.sent = void 0;
              $ctx.action = 'next';
              $ctx.state = 12;
              break;
            case 12:
              $__12 = $__11[$ctx.action]($ctx.sentIgnoreThrow);
              $ctx.state = 9;
              break;
            case 9:
              $ctx.state = ($__12.done) ? 3 : 2;
              break;
            case 3:
              $ctx.sent = $__12.value;
              $ctx.state = -2;
              break;
            case 2:
              $ctx.state = 12;
              return $__12.value;
            default:
              return $ctx.end();
          }
      }, $__10, this);
    })
  }, {});
  Object.defineProperty(Set.prototype, Symbol.iterator, {
    configurable: true,
    writable: true,
    value: Set.prototype.values
  });
  Object.defineProperty(Set.prototype, 'keys', {
    configurable: true,
    writable: true,
    value: Set.prototype.values
  });
  function polyfillSet(global) {
    var $__6 = global,
        Object = $__6.Object,
        Symbol = $__6.Symbol;
    if (!global.Set)
      global.Set = Set;
    var setPrototype = global.Set.prototype;
    if (setPrototype.values) {
      maybeAddIterator(setPrototype, setPrototype.values, Symbol);
      maybeAddIterator(Object.getPrototypeOf(new global.Set().values()), function() {
        return this;
      }, Symbol);
    }
  }
  registerPolyfill(polyfillSet);
  return {
    get Set() {
      return Set;
    },
    get polyfillSet() {
      return polyfillSet;
    }
  };
});
System.get("traceur-runtime@0.0.79/src/runtime/polyfills/Set.js" + '');
System.registerModule("traceur-runtime@0.0.79/node_modules/rsvp/lib/rsvp/asap.js", [], function() {
  "use strict";
  var __moduleName = "traceur-runtime@0.0.79/node_modules/rsvp/lib/rsvp/asap.js";
  var len = 0;
  function asap(callback, arg) {
    queue[len] = callback;
    queue[len + 1] = arg;
    len += 2;
    if (len === 2) {
      scheduleFlush();
    }
  }
  var $__default = asap;
  var browserGlobal = (typeof window !== 'undefined') ? window : {};
  var BrowserMutationObserver = browserGlobal.MutationObserver || browserGlobal.WebKitMutationObserver;
  var isWorker = typeof Uint8ClampedArray !== 'undefined' && typeof importScripts !== 'undefined' && typeof MessageChannel !== 'undefined';
  function useNextTick() {
    return function() {
      process.nextTick(flush);
    };
  }
  function useMutationObserver() {
    var iterations = 0;
    var observer = new BrowserMutationObserver(flush);
    var node = document.createTextNode('');
    observer.observe(node, {characterData: true});
    return function() {
      node.data = (iterations = ++iterations % 2);
    };
  }
  function useMessageChannel() {
    var channel = new MessageChannel();
    channel.port1.onmessage = flush;
    return function() {
      channel.port2.postMessage(0);
    };
  }
  function useSetTimeout() {
    return function() {
      setTimeout(flush, 1);
    };
  }
  var queue = new Array(1000);
  function flush() {
    for (var i = 0; i < len; i += 2) {
      var callback = queue[i];
      var arg = queue[i + 1];
      callback(arg);
      queue[i] = undefined;
      queue[i + 1] = undefined;
    }
    len = 0;
  }
  var scheduleFlush;
  if (typeof process !== 'undefined' && {}.toString.call(process) === '[object process]') {
    scheduleFlush = useNextTick();
  } else if (BrowserMutationObserver) {
    scheduleFlush = useMutationObserver();
  } else if (isWorker) {
    scheduleFlush = useMessageChannel();
  } else {
    scheduleFlush = useSetTimeout();
  }
  return {get default() {
      return $__default;
    }};
});
System.registerModule("traceur-runtime@0.0.79/src/runtime/polyfills/Promise.js", [], function() {
  "use strict";
  var __moduleName = "traceur-runtime@0.0.79/src/runtime/polyfills/Promise.js";
  var async = System.get("traceur-runtime@0.0.79/node_modules/rsvp/lib/rsvp/asap.js").default;
  var registerPolyfill = System.get("traceur-runtime@0.0.79/src/runtime/polyfills/utils.js").registerPolyfill;
  var promiseRaw = {};
  function isPromise(x) {
    return x && typeof x === 'object' && x.status_ !== undefined;
  }
  function idResolveHandler(x) {
    return x;
  }
  function idRejectHandler(x) {
    throw x;
  }
  function chain(promise) {
    var onResolve = arguments[1] !== (void 0) ? arguments[1] : idResolveHandler;
    var onReject = arguments[2] !== (void 0) ? arguments[2] : idRejectHandler;
    var deferred = getDeferred(promise.constructor);
    switch (promise.status_) {
      case undefined:
        throw TypeError;
      case 0:
        promise.onResolve_.push(onResolve, deferred);
        promise.onReject_.push(onReject, deferred);
        break;
      case +1:
        promiseEnqueue(promise.value_, [onResolve, deferred]);
        break;
      case -1:
        promiseEnqueue(promise.value_, [onReject, deferred]);
        break;
    }
    return deferred.promise;
  }
  function getDeferred(C) {
    if (this === $Promise) {
      var promise = promiseInit(new $Promise(promiseRaw));
      return {
        promise: promise,
        resolve: (function(x) {
          promiseResolve(promise, x);
        }),
        reject: (function(r) {
          promiseReject(promise, r);
        })
      };
    } else {
      var result = {};
      result.promise = new C((function(resolve, reject) {
        result.resolve = resolve;
        result.reject = reject;
      }));
      return result;
    }
  }
  function promiseSet(promise, status, value, onResolve, onReject) {
    promise.status_ = status;
    promise.value_ = value;
    promise.onResolve_ = onResolve;
    promise.onReject_ = onReject;
    return promise;
  }
  function promiseInit(promise) {
    return promiseSet(promise, 0, undefined, [], []);
  }
  var Promise = function Promise(resolver) {
    if (resolver === promiseRaw)
      return;
    if (typeof resolver !== 'function')
      throw new TypeError;
    var promise = promiseInit(this);
    try {
      resolver((function(x) {
        promiseResolve(promise, x);
      }), (function(r) {
        promiseReject(promise, r);
      }));
    } catch (e) {
      promiseReject(promise, e);
    }
  };
  ($traceurRuntime.createClass)(Promise, {
    catch: function(onReject) {
      return this.then(undefined, onReject);
    },
    then: function(onResolve, onReject) {
      if (typeof onResolve !== 'function')
        onResolve = idResolveHandler;
      if (typeof onReject !== 'function')
        onReject = idRejectHandler;
      var that = this;
      var constructor = this.constructor;
      return chain(this, function(x) {
        x = promiseCoerce(constructor, x);
        return x === that ? onReject(new TypeError) : isPromise(x) ? x.then(onResolve, onReject) : onResolve(x);
      }, onReject);
    }
  }, {
    resolve: function(x) {
      if (this === $Promise) {
        if (isPromise(x)) {
          return x;
        }
        return promiseSet(new $Promise(promiseRaw), +1, x);
      } else {
        return new this(function(resolve, reject) {
          resolve(x);
        });
      }
    },
    reject: function(r) {
      if (this === $Promise) {
        return promiseSet(new $Promise(promiseRaw), -1, r);
      } else {
        return new this((function(resolve, reject) {
          reject(r);
        }));
      }
    },
    all: function(values) {
      var deferred = getDeferred(this);
      var resolutions = [];
      try {
        var count = values.length;
        if (count === 0) {
          deferred.resolve(resolutions);
        } else {
          for (var i = 0; i < values.length; i++) {
            this.resolve(values[i]).then(function(i, x) {
              resolutions[i] = x;
              if (--count === 0)
                deferred.resolve(resolutions);
            }.bind(undefined, i), (function(r) {
              deferred.reject(r);
            }));
          }
        }
      } catch (e) {
        deferred.reject(e);
      }
      return deferred.promise;
    },
    race: function(values) {
      var deferred = getDeferred(this);
      try {
        for (var i = 0; i < values.length; i++) {
          this.resolve(values[i]).then((function(x) {
            deferred.resolve(x);
          }), (function(r) {
            deferred.reject(r);
          }));
        }
      } catch (e) {
        deferred.reject(e);
      }
      return deferred.promise;
    }
  });
  var $Promise = Promise;
  var $PromiseReject = $Promise.reject;
  function promiseResolve(promise, x) {
    promiseDone(promise, +1, x, promise.onResolve_);
  }
  function promiseReject(promise, r) {
    promiseDone(promise, -1, r, promise.onReject_);
  }
  function promiseDone(promise, status, value, reactions) {
    if (promise.status_ !== 0)
      return;
    promiseEnqueue(value, reactions);
    promiseSet(promise, status, value);
  }
  function promiseEnqueue(value, tasks) {
    async((function() {
      for (var i = 0; i < tasks.length; i += 2) {
        promiseHandle(value, tasks[i], tasks[i + 1]);
      }
    }));
  }
  function promiseHandle(value, handler, deferred) {
    try {
      var result = handler(value);
      if (result === deferred.promise)
        throw new TypeError;
      else if (isPromise(result))
        chain(result, deferred.resolve, deferred.reject);
      else
        deferred.resolve(result);
    } catch (e) {
      try {
        deferred.reject(e);
      } catch (e) {}
    }
  }
  var thenableSymbol = '@@thenable';
  function isObject(x) {
    return x && (typeof x === 'object' || typeof x === 'function');
  }
  function promiseCoerce(constructor, x) {
    if (!isPromise(x) && isObject(x)) {
      var then;
      try {
        then = x.then;
      } catch (r) {
        var promise = $PromiseReject.call(constructor, r);
        x[thenableSymbol] = promise;
        return promise;
      }
      if (typeof then === 'function') {
        var p = x[thenableSymbol];
        if (p) {
          return p;
        } else {
          var deferred = getDeferred(constructor);
          x[thenableSymbol] = deferred.promise;
          try {
            then.call(x, deferred.resolve, deferred.reject);
          } catch (r) {
            deferred.reject(r);
          }
          return deferred.promise;
        }
      }
    }
    return x;
  }
  function polyfillPromise(global) {
    if (!global.Promise)
      global.Promise = Promise;
  }
  registerPolyfill(polyfillPromise);
  return {
    get Promise() {
      return Promise;
    },
    get polyfillPromise() {
      return polyfillPromise;
    }
  };
});
System.get("traceur-runtime@0.0.79/src/runtime/polyfills/Promise.js" + '');
System.registerModule("traceur-runtime@0.0.79/src/runtime/polyfills/StringIterator.js", [], function() {
  "use strict";
  var $__2;
  var __moduleName = "traceur-runtime@0.0.79/src/runtime/polyfills/StringIterator.js";
  var $__0 = System.get("traceur-runtime@0.0.79/src/runtime/polyfills/utils.js"),
      createIteratorResultObject = $__0.createIteratorResultObject,
      isObject = $__0.isObject;
  var toProperty = $traceurRuntime.toProperty;
  var hasOwnProperty = Object.prototype.hasOwnProperty;
  var iteratedString = Symbol('iteratedString');
  var stringIteratorNextIndex = Symbol('stringIteratorNextIndex');
  var StringIterator = function StringIterator() {};
  ($traceurRuntime.createClass)(StringIterator, ($__2 = {}, Object.defineProperty($__2, "next", {
    value: function() {
      var o = this;
      if (!isObject(o) || !hasOwnProperty.call(o, iteratedString)) {
        throw new TypeError('this must be a StringIterator object');
      }
      var s = o[toProperty(iteratedString)];
      if (s === undefined) {
        return createIteratorResultObject(undefined, true);
      }
      var position = o[toProperty(stringIteratorNextIndex)];
      var len = s.length;
      if (position >= len) {
        o[toProperty(iteratedString)] = undefined;
        return createIteratorResultObject(undefined, true);
      }
      var first = s.charCodeAt(position);
      var resultString;
      if (first < 0xD800 || first > 0xDBFF || position + 1 === len) {
        resultString = String.fromCharCode(first);
      } else {
        var second = s.charCodeAt(position + 1);
        if (second < 0xDC00 || second > 0xDFFF) {
          resultString = String.fromCharCode(first);
        } else {
          resultString = String.fromCharCode(first) + String.fromCharCode(second);
        }
      }
      o[toProperty(stringIteratorNextIndex)] = position + resultString.length;
      return createIteratorResultObject(resultString, false);
    },
    configurable: true,
    enumerable: true,
    writable: true
  }), Object.defineProperty($__2, Symbol.iterator, {
    value: function() {
      return this;
    },
    configurable: true,
    enumerable: true,
    writable: true
  }), $__2), {});
  function createStringIterator(string) {
    var s = String(string);
    var iterator = Object.create(StringIterator.prototype);
    iterator[toProperty(iteratedString)] = s;
    iterator[toProperty(stringIteratorNextIndex)] = 0;
    return iterator;
  }
  return {get createStringIterator() {
      return createStringIterator;
    }};
});
System.registerModule("traceur-runtime@0.0.79/src/runtime/polyfills/String.js", [], function() {
  "use strict";
  var __moduleName = "traceur-runtime@0.0.79/src/runtime/polyfills/String.js";
  var createStringIterator = System.get("traceur-runtime@0.0.79/src/runtime/polyfills/StringIterator.js").createStringIterator;
  var $__1 = System.get("traceur-runtime@0.0.79/src/runtime/polyfills/utils.js"),
      maybeAddFunctions = $__1.maybeAddFunctions,
      maybeAddIterator = $__1.maybeAddIterator,
      registerPolyfill = $__1.registerPolyfill;
  var $toString = Object.prototype.toString;
  var $indexOf = String.prototype.indexOf;
  var $lastIndexOf = String.prototype.lastIndexOf;
  function startsWith(search) {
    var string = String(this);
    if (this == null || $toString.call(search) == '[object RegExp]') {
      throw TypeError();
    }
    var stringLength = string.length;
    var searchString = String(search);
    var searchLength = searchString.length;
    var position = arguments.length > 1 ? arguments[1] : undefined;
    var pos = position ? Number(position) : 0;
    if (isNaN(pos)) {
      pos = 0;
    }
    var start = Math.min(Math.max(pos, 0), stringLength);
    return $indexOf.call(string, searchString, pos) == start;
  }
  function endsWith(search) {
    var string = String(this);
    if (this == null || $toString.call(search) == '[object RegExp]') {
      throw TypeError();
    }
    var stringLength = string.length;
    var searchString = String(search);
    var searchLength = searchString.length;
    var pos = stringLength;
    if (arguments.length > 1) {
      var position = arguments[1];
      if (position !== undefined) {
        pos = position ? Number(position) : 0;
        if (isNaN(pos)) {
          pos = 0;
        }
      }
    }
    var end = Math.min(Math.max(pos, 0), stringLength);
    var start = end - searchLength;
    if (start < 0) {
      return false;
    }
    return $lastIndexOf.call(string, searchString, start) == start;
  }
  function includes(search) {
    if (this == null) {
      throw TypeError();
    }
    var string = String(this);
    if (search && $toString.call(search) == '[object RegExp]') {
      throw TypeError();
    }
    var stringLength = string.length;
    var searchString = String(search);
    var searchLength = searchString.length;
    var position = arguments.length > 1 ? arguments[1] : undefined;
    var pos = position ? Number(position) : 0;
    if (pos != pos) {
      pos = 0;
    }
    var start = Math.min(Math.max(pos, 0), stringLength);
    if (searchLength + start > stringLength) {
      return false;
    }
    return $indexOf.call(string, searchString, pos) != -1;
  }
  function repeat(count) {
    if (this == null) {
      throw TypeError();
    }
    var string = String(this);
    var n = count ? Number(count) : 0;
    if (isNaN(n)) {
      n = 0;
    }
    if (n < 0 || n == Infinity) {
      throw RangeError();
    }
    if (n == 0) {
      return '';
    }
    var result = '';
    while (n--) {
      result += string;
    }
    return result;
  }
  function codePointAt(position) {
    if (this == null) {
      throw TypeError();
    }
    var string = String(this);
    var size = string.length;
    var index = position ? Number(position) : 0;
    if (isNaN(index)) {
      index = 0;
    }
    if (index < 0 || index >= size) {
      return undefined;
    }
    var first = string.charCodeAt(index);
    var second;
    if (first >= 0xD800 && first <= 0xDBFF && size > index + 1) {
      second = string.charCodeAt(index + 1);
      if (second >= 0xDC00 && second <= 0xDFFF) {
        return (first - 0xD800) * 0x400 + second - 0xDC00 + 0x10000;
      }
    }
    return first;
  }
  function raw(callsite) {
    var raw = callsite.raw;
    var len = raw.length >>> 0;
    if (len === 0)
      return '';
    var s = '';
    var i = 0;
    while (true) {
      s += raw[i];
      if (i + 1 === len)
        return s;
      s += arguments[++i];
    }
  }
  function fromCodePoint() {
    var codeUnits = [];
    var floor = Math.floor;
    var highSurrogate;
    var lowSurrogate;
    var index = -1;
    var length = arguments.length;
    if (!length) {
      return '';
    }
    while (++index < length) {
      var codePoint = Number(arguments[index]);
      if (!isFinite(codePoint) || codePoint < 0 || codePoint > 0x10FFFF || floor(codePoint) != codePoint) {
        throw RangeError('Invalid code point: ' + codePoint);
      }
      if (codePoint <= 0xFFFF) {
        codeUnits.push(codePoint);
      } else {
        codePoint -= 0x10000;
        highSurrogate = (codePoint >> 10) + 0xD800;
        lowSurrogate = (codePoint % 0x400) + 0xDC00;
        codeUnits.push(highSurrogate, lowSurrogate);
      }
    }
    return String.fromCharCode.apply(null, codeUnits);
  }
  function stringPrototypeIterator() {
    var o = $traceurRuntime.checkObjectCoercible(this);
    var s = String(o);
    return createStringIterator(s);
  }
  function polyfillString(global) {
    var String = global.String;
    maybeAddFunctions(String.prototype, ['codePointAt', codePointAt, 'endsWith', endsWith, 'includes', includes, 'repeat', repeat, 'startsWith', startsWith]);
    maybeAddFunctions(String, ['fromCodePoint', fromCodePoint, 'raw', raw]);
    maybeAddIterator(String.prototype, stringPrototypeIterator, Symbol);
  }
  registerPolyfill(polyfillString);
  return {
    get startsWith() {
      return startsWith;
    },
    get endsWith() {
      return endsWith;
    },
    get includes() {
      return includes;
    },
    get repeat() {
      return repeat;
    },
    get codePointAt() {
      return codePointAt;
    },
    get raw() {
      return raw;
    },
    get fromCodePoint() {
      return fromCodePoint;
    },
    get stringPrototypeIterator() {
      return stringPrototypeIterator;
    },
    get polyfillString() {
      return polyfillString;
    }
  };
});
System.get("traceur-runtime@0.0.79/src/runtime/polyfills/String.js" + '');
System.registerModule("traceur-runtime@0.0.79/src/runtime/polyfills/ArrayIterator.js", [], function() {
  "use strict";
  var $__2;
  var __moduleName = "traceur-runtime@0.0.79/src/runtime/polyfills/ArrayIterator.js";
  var $__0 = System.get("traceur-runtime@0.0.79/src/runtime/polyfills/utils.js"),
      toObject = $__0.toObject,
      toUint32 = $__0.toUint32,
      createIteratorResultObject = $__0.createIteratorResultObject;
  var ARRAY_ITERATOR_KIND_KEYS = 1;
  var ARRAY_ITERATOR_KIND_VALUES = 2;
  var ARRAY_ITERATOR_KIND_ENTRIES = 3;
  var ArrayIterator = function ArrayIterator() {};
  ($traceurRuntime.createClass)(ArrayIterator, ($__2 = {}, Object.defineProperty($__2, "next", {
    value: function() {
      var iterator = toObject(this);
      var array = iterator.iteratorObject_;
      if (!array) {
        throw new TypeError('Object is not an ArrayIterator');
      }
      var index = iterator.arrayIteratorNextIndex_;
      var itemKind = iterator.arrayIterationKind_;
      var length = toUint32(array.length);
      if (index >= length) {
        iterator.arrayIteratorNextIndex_ = Infinity;
        return createIteratorResultObject(undefined, true);
      }
      iterator.arrayIteratorNextIndex_ = index + 1;
      if (itemKind == ARRAY_ITERATOR_KIND_VALUES)
        return createIteratorResultObject(array[index], false);
      if (itemKind == ARRAY_ITERATOR_KIND_ENTRIES)
        return createIteratorResultObject([index, array[index]], false);
      return createIteratorResultObject(index, false);
    },
    configurable: true,
    enumerable: true,
    writable: true
  }), Object.defineProperty($__2, Symbol.iterator, {
    value: function() {
      return this;
    },
    configurable: true,
    enumerable: true,
    writable: true
  }), $__2), {});
  function createArrayIterator(array, kind) {
    var object = toObject(array);
    var iterator = new ArrayIterator;
    iterator.iteratorObject_ = object;
    iterator.arrayIteratorNextIndex_ = 0;
    iterator.arrayIterationKind_ = kind;
    return iterator;
  }
  function entries() {
    return createArrayIterator(this, ARRAY_ITERATOR_KIND_ENTRIES);
  }
  function keys() {
    return createArrayIterator(this, ARRAY_ITERATOR_KIND_KEYS);
  }
  function values() {
    return createArrayIterator(this, ARRAY_ITERATOR_KIND_VALUES);
  }
  return {
    get entries() {
      return entries;
    },
    get keys() {
      return keys;
    },
    get values() {
      return values;
    }
  };
});
System.registerModule("traceur-runtime@0.0.79/src/runtime/polyfills/Array.js", [], function() {
  "use strict";
  var __moduleName = "traceur-runtime@0.0.79/src/runtime/polyfills/Array.js";
  var $__0 = System.get("traceur-runtime@0.0.79/src/runtime/polyfills/ArrayIterator.js"),
      entries = $__0.entries,
      keys = $__0.keys,
      values = $__0.values;
  var $__1 = System.get("traceur-runtime@0.0.79/src/runtime/polyfills/utils.js"),
      checkIterable = $__1.checkIterable,
      isCallable = $__1.isCallable,
      isConstructor = $__1.isConstructor,
      maybeAddFunctions = $__1.maybeAddFunctions,
      maybeAddIterator = $__1.maybeAddIterator,
      registerPolyfill = $__1.registerPolyfill,
      toInteger = $__1.toInteger,
      toLength = $__1.toLength,
      toObject = $__1.toObject;
  function from(arrLike) {
    var mapFn = arguments[1];
    var thisArg = arguments[2];
    var C = this;
    var items = toObject(arrLike);
    var mapping = mapFn !== undefined;
    var k = 0;
    var arr,
        len;
    if (mapping && !isCallable(mapFn)) {
      throw TypeError();
    }
    if (checkIterable(items)) {
      arr = isConstructor(C) ? new C() : [];
      for (var $__2 = items[$traceurRuntime.toProperty(Symbol.iterator)](),
          $__3; !($__3 = $__2.next()).done; ) {
        var item = $__3.value;
        {
          if (mapping) {
            arr[k] = mapFn.call(thisArg, item, k);
          } else {
            arr[k] = item;
          }
          k++;
        }
      }
      arr.length = k;
      return arr;
    }
    len = toLength(items.length);
    arr = isConstructor(C) ? new C(len) : new Array(len);
    for (; k < len; k++) {
      if (mapping) {
        arr[k] = typeof thisArg === 'undefined' ? mapFn(items[k], k) : mapFn.call(thisArg, items[k], k);
      } else {
        arr[k] = items[k];
      }
    }
    arr.length = len;
    return arr;
  }
  function of() {
    for (var items = [],
        $__4 = 0; $__4 < arguments.length; $__4++)
      items[$__4] = arguments[$__4];
    var C = this;
    var len = items.length;
    var arr = isConstructor(C) ? new C(len) : new Array(len);
    for (var k = 0; k < len; k++) {
      arr[k] = items[k];
    }
    arr.length = len;
    return arr;
  }
  function fill(value) {
    var start = arguments[1] !== (void 0) ? arguments[1] : 0;
    var end = arguments[2];
    var object = toObject(this);
    var len = toLength(object.length);
    var fillStart = toInteger(start);
    var fillEnd = end !== undefined ? toInteger(end) : len;
    fillStart = fillStart < 0 ? Math.max(len + fillStart, 0) : Math.min(fillStart, len);
    fillEnd = fillEnd < 0 ? Math.max(len + fillEnd, 0) : Math.min(fillEnd, len);
    while (fillStart < fillEnd) {
      object[fillStart] = value;
      fillStart++;
    }
    return object;
  }
  function find(predicate) {
    var thisArg = arguments[1];
    return findHelper(this, predicate, thisArg);
  }
  function findIndex(predicate) {
    var thisArg = arguments[1];
    return findHelper(this, predicate, thisArg, true);
  }
  function findHelper(self, predicate) {
    var thisArg = arguments[2];
    var returnIndex = arguments[3] !== (void 0) ? arguments[3] : false;
    var object = toObject(self);
    var len = toLength(object.length);
    if (!isCallable(predicate)) {
      throw TypeError();
    }
    for (var i = 0; i < len; i++) {
      var value = object[i];
      if (predicate.call(thisArg, value, i, object)) {
        return returnIndex ? i : value;
      }
    }
    return returnIndex ? -1 : undefined;
  }
  function polyfillArray(global) {
    var $__5 = global,
        Array = $__5.Array,
        Object = $__5.Object,
        Symbol = $__5.Symbol;
    maybeAddFunctions(Array.prototype, ['entries', entries, 'keys', keys, 'values', values, 'fill', fill, 'find', find, 'findIndex', findIndex]);
    maybeAddFunctions(Array, ['from', from, 'of', of]);
    maybeAddIterator(Array.prototype, values, Symbol);
    maybeAddIterator(Object.getPrototypeOf([].values()), function() {
      return this;
    }, Symbol);
  }
  registerPolyfill(polyfillArray);
  return {
    get from() {
      return from;
    },
    get of() {
      return of;
    },
    get fill() {
      return fill;
    },
    get find() {
      return find;
    },
    get findIndex() {
      return findIndex;
    },
    get polyfillArray() {
      return polyfillArray;
    }
  };
});
System.get("traceur-runtime@0.0.79/src/runtime/polyfills/Array.js" + '');
System.registerModule("traceur-runtime@0.0.79/src/runtime/polyfills/Object.js", [], function() {
  "use strict";
  var __moduleName = "traceur-runtime@0.0.79/src/runtime/polyfills/Object.js";
  var $__0 = System.get("traceur-runtime@0.0.79/src/runtime/polyfills/utils.js"),
      maybeAddFunctions = $__0.maybeAddFunctions,
      registerPolyfill = $__0.registerPolyfill;
  var $__1 = $traceurRuntime,
      defineProperty = $__1.defineProperty,
      getOwnPropertyDescriptor = $__1.getOwnPropertyDescriptor,
      getOwnPropertyNames = $__1.getOwnPropertyNames,
      isPrivateName = $__1.isPrivateName,
      keys = $__1.keys;
  function is(left, right) {
    if (left === right)
      return left !== 0 || 1 / left === 1 / right;
    return left !== left && right !== right;
  }
  function assign(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      var props = source == null ? [] : keys(source);
      var p,
          length = props.length;
      for (p = 0; p < length; p++) {
        var name = props[p];
        if (isPrivateName(name))
          continue;
        target[name] = source[name];
      }
    }
    return target;
  }
  function mixin(target, source) {
    var props = getOwnPropertyNames(source);
    var p,
        descriptor,
        length = props.length;
    for (p = 0; p < length; p++) {
      var name = props[p];
      if (isPrivateName(name))
        continue;
      descriptor = getOwnPropertyDescriptor(source, props[p]);
      defineProperty(target, props[p], descriptor);
    }
    return target;
  }
  function polyfillObject(global) {
    var Object = global.Object;
    maybeAddFunctions(Object, ['assign', assign, 'is', is, 'mixin', mixin]);
  }
  registerPolyfill(polyfillObject);
  return {
    get is() {
      return is;
    },
    get assign() {
      return assign;
    },
    get mixin() {
      return mixin;
    },
    get polyfillObject() {
      return polyfillObject;
    }
  };
});
System.get("traceur-runtime@0.0.79/src/runtime/polyfills/Object.js" + '');
System.registerModule("traceur-runtime@0.0.79/src/runtime/polyfills/Number.js", [], function() {
  "use strict";
  var __moduleName = "traceur-runtime@0.0.79/src/runtime/polyfills/Number.js";
  var $__0 = System.get("traceur-runtime@0.0.79/src/runtime/polyfills/utils.js"),
      isNumber = $__0.isNumber,
      maybeAddConsts = $__0.maybeAddConsts,
      maybeAddFunctions = $__0.maybeAddFunctions,
      registerPolyfill = $__0.registerPolyfill,
      toInteger = $__0.toInteger;
  var $abs = Math.abs;
  var $isFinite = isFinite;
  var $isNaN = isNaN;
  var MAX_SAFE_INTEGER = Math.pow(2, 53) - 1;
  var MIN_SAFE_INTEGER = -Math.pow(2, 53) + 1;
  var EPSILON = Math.pow(2, -52);
  function NumberIsFinite(number) {
    return isNumber(number) && $isFinite(number);
  }
  ;
  function isInteger(number) {
    return NumberIsFinite(number) && toInteger(number) === number;
  }
  function NumberIsNaN(number) {
    return isNumber(number) && $isNaN(number);
  }
  ;
  function isSafeInteger(number) {
    if (NumberIsFinite(number)) {
      var integral = toInteger(number);
      if (integral === number)
        return $abs(integral) <= MAX_SAFE_INTEGER;
    }
    return false;
  }
  function polyfillNumber(global) {
    var Number = global.Number;
    maybeAddConsts(Number, ['MAX_SAFE_INTEGER', MAX_SAFE_INTEGER, 'MIN_SAFE_INTEGER', MIN_SAFE_INTEGER, 'EPSILON', EPSILON]);
    maybeAddFunctions(Number, ['isFinite', NumberIsFinite, 'isInteger', isInteger, 'isNaN', NumberIsNaN, 'isSafeInteger', isSafeInteger]);
  }
  registerPolyfill(polyfillNumber);
  return {
    get MAX_SAFE_INTEGER() {
      return MAX_SAFE_INTEGER;
    },
    get MIN_SAFE_INTEGER() {
      return MIN_SAFE_INTEGER;
    },
    get EPSILON() {
      return EPSILON;
    },
    get isFinite() {
      return NumberIsFinite;
    },
    get isInteger() {
      return isInteger;
    },
    get isNaN() {
      return NumberIsNaN;
    },
    get isSafeInteger() {
      return isSafeInteger;
    },
    get polyfillNumber() {
      return polyfillNumber;
    }
  };
});
System.get("traceur-runtime@0.0.79/src/runtime/polyfills/Number.js" + '');
System.registerModule("traceur-runtime@0.0.79/src/runtime/polyfills/polyfills.js", [], function() {
  "use strict";
  var __moduleName = "traceur-runtime@0.0.79/src/runtime/polyfills/polyfills.js";
  var polyfillAll = System.get("traceur-runtime@0.0.79/src/runtime/polyfills/utils.js").polyfillAll;
  polyfillAll(Reflect.global);
  var setupGlobals = $traceurRuntime.setupGlobals;
  $traceurRuntime.setupGlobals = function(global) {
    setupGlobals(global);
    polyfillAll(global);
  };
  return {};
});
System.get("traceur-runtime@0.0.79/src/runtime/polyfills/polyfills.js" + '');

!function(e){"object"==typeof exports?module.exports=e():"function"==typeof define&&define.amd?define(e):"undefined"!=typeof window?window.Promise=e():"undefined"!=typeof global?global.Promise=e():"undefined"!=typeof self&&(self.Promise=e())}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/** @license MIT License (c) copyright 2010-2014 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

/**
 * ES6 global Promise shim
 */
var unhandledRejections = require('../lib/decorators/unhandledRejection');
var PromiseConstructor = unhandledRejections(require('../lib/Promise'));

module.exports = typeof global != 'undefined' ? (global.Promise = PromiseConstructor)
	           : typeof self   != 'undefined' ? (self.Promise   = PromiseConstructor)
	           : PromiseConstructor;

},{"../lib/Promise":2,"../lib/decorators/unhandledRejection":4}],2:[function(require,module,exports){
/** @license MIT License (c) copyright 2010-2014 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

(function(define) { 'use strict';
define(function (require) {

	var makePromise = require('./makePromise');
	var Scheduler = require('./Scheduler');
	var async = require('./env').asap;

	return makePromise({
		scheduler: new Scheduler(async)
	});

});
})(typeof define === 'function' && define.amd ? define : function (factory) { module.exports = factory(require); });

},{"./Scheduler":3,"./env":5,"./makePromise":6}],3:[function(require,module,exports){
/** @license MIT License (c) copyright 2010-2014 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

(function(define) { 'use strict';
define(function() {

	// Credit to Twisol (https://github.com/Twisol) for suggesting
	// this type of extensible queue + trampoline approach for next-tick conflation.

	/**
	 * Async task scheduler
	 * @param {function} async function to schedule a single async function
	 * @constructor
	 */
	function Scheduler(async) {
		this._async = async;
		this._running = false;

		this._queue = new Array(1<<16);
		this._queueLen = 0;
		this._afterQueue = new Array(1<<4);
		this._afterQueueLen = 0;

		var self = this;
		this.drain = function() {
			self._drain();
		};
	}

	/**
	 * Enqueue a task
	 * @param {{ run:function }} task
	 */
	Scheduler.prototype.enqueue = function(task) {
		this._queue[this._queueLen++] = task;
		this.run();
	};

	/**
	 * Enqueue a task to run after the main task queue
	 * @param {{ run:function }} task
	 */
	Scheduler.prototype.afterQueue = function(task) {
		this._afterQueue[this._afterQueueLen++] = task;
		this.run();
	};

	Scheduler.prototype.run = function() {
		if (!this._running) {
			this._running = true;
			this._async(this.drain);
		}
	};

	/**
	 * Drain the handler queue entirely, and then the after queue
	 */
	Scheduler.prototype._drain = function() {
		var i = 0;
		for (; i < this._queueLen; ++i) {
			this._queue[i].run();
			this._queue[i] = void 0;
		}

		this._queueLen = 0;
		this._running = false;

		for (i = 0; i < this._afterQueueLen; ++i) {
			this._afterQueue[i].run();
			this._afterQueue[i] = void 0;
		}

		this._afterQueueLen = 0;
	};

	return Scheduler;

});
}(typeof define === 'function' && define.amd ? define : function(factory) { module.exports = factory(); }));

},{}],4:[function(require,module,exports){
/** @license MIT License (c) copyright 2010-2014 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

(function(define) { 'use strict';
define(function(require) {

	var setTimer = require('../env').setTimer;

	return function unhandledRejection(Promise) {
		var logError = noop;
		var logInfo = noop;
		var localConsole;

		if(typeof console !== 'undefined') {
			// Alias console to prevent things like uglify's drop_console option from
			// removing console.log/error. Unhandled rejections fall into the same
			// category as uncaught exceptions, and build tools shouldn't silence them.
			localConsole = console;
			logError = typeof localConsole.error !== 'undefined'
				? function (e) { localConsole.error(e); }
				: function (e) { localConsole.log(e); };

			logInfo = typeof localConsole.info !== 'undefined'
				? function (e) { localConsole.info(e); }
				: function (e) { localConsole.log(e); };
		}

		Promise.onPotentiallyUnhandledRejection = function(rejection) {
			enqueue(report, rejection);
		};

		Promise.onPotentiallyUnhandledRejectionHandled = function(rejection) {
			enqueue(unreport, rejection);
		};

		Promise.onFatalRejection = function(rejection) {
			enqueue(throwit, rejection.value);
		};

		var tasks = [];
		var reported = [];
		var running = null;

		function report(r) {
			if(!r.handled) {
				reported.push(r);
				logError('Potentially unhandled rejection [' + r.id + '] ' + formatError(r.value));
			}
		}

		function unreport(r) {
			var i = reported.indexOf(r);
			if(i >= 0) {
				reported.splice(i, 1);
				logInfo('Handled previous rejection [' + r.id + '] ' + formatObject(r.value));
			}
		}

		function enqueue(f, x) {
			tasks.push(f, x);
			if(running === null) {
				running = setTimer(flush, 0);
			}
		}

		function flush() {
			running = null;
			while(tasks.length > 0) {
				tasks.shift()(tasks.shift());
			}
		}

		return Promise;
	};

	function formatError(e) {
		var s = typeof e === 'object' && e.stack ? e.stack : formatObject(e);
		return e instanceof Error ? s : s + ' (WARNING: non-Error used)';
	}

	function formatObject(o) {
		var s = String(o);
		if(s === '[object Object]' && typeof JSON !== 'undefined') {
			s = tryStringify(o, s);
		}
		return s;
	}

	function tryStringify(e, defaultValue) {
		try {
			return JSON.stringify(e);
		} catch(e) {
			// Ignore. Cannot JSON.stringify e, stick with String(e)
			return defaultValue;
		}
	}

	function throwit(e) {
		throw e;
	}

	function noop() {}

});
}(typeof define === 'function' && define.amd ? define : function(factory) { module.exports = factory(require); }));

},{"../env":5}],5:[function(require,module,exports){
/** @license MIT License (c) copyright 2010-2014 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

/*global process,document,setTimeout,clearTimeout,MutationObserver,WebKitMutationObserver*/
(function(define) { 'use strict';
define(function(require) {
	/*jshint maxcomplexity:6*/

	// Sniff "best" async scheduling option
	// Prefer process.nextTick or MutationObserver, then check for
	// setTimeout, and finally vertx, since its the only env that doesn't
	// have setTimeout

	var MutationObs;
	var capturedSetTimeout = typeof setTimeout !== 'undefined' && setTimeout;

	// Default env
	var setTimer = function(f, ms) { return setTimeout(f, ms); };
	var clearTimer = function(t) { return clearTimeout(t); };
	var asap = function (f) { return capturedSetTimeout(f, 0); };

	// Detect specific env
	if (isNode()) { // Node
		asap = function (f) { return process.nextTick(f); };

	} else if (MutationObs = hasMutationObserver()) { // Modern browser
		asap = initMutationObserver(MutationObs);

	} else if (!capturedSetTimeout) { // vert.x
		var vertxRequire = require;
		var vertx = vertxRequire('vertx');
		setTimer = function (f, ms) { return vertx.setTimer(ms, f); };
		clearTimer = vertx.cancelTimer;
		asap = vertx.runOnLoop || vertx.runOnContext;
	}

	return {
		setTimer: setTimer,
		clearTimer: clearTimer,
		asap: asap
	};

	function isNode () {
		return typeof process !== 'undefined' && process !== null &&
			typeof process.nextTick === 'function';
	}

	function hasMutationObserver () {
		return (typeof MutationObserver === 'function' && MutationObserver) ||
			(typeof WebKitMutationObserver === 'function' && WebKitMutationObserver);
	}

	function initMutationObserver(MutationObserver) {
		var scheduled;
		var node = document.createTextNode('');
		var o = new MutationObserver(run);
		o.observe(node, { characterData: true });

		function run() {
			var f = scheduled;
			scheduled = void 0;
			f();
		}

		var i = 0;
		return function (f) {
			scheduled = f;
			node.data = (i ^= 1);
		};
	}
});
}(typeof define === 'function' && define.amd ? define : function(factory) { module.exports = factory(require); }));

},{}],6:[function(require,module,exports){
/** @license MIT License (c) copyright 2010-2014 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

(function(define) { 'use strict';
define(function() {

	return function makePromise(environment) {

		var tasks = environment.scheduler;

		var objectCreate = Object.create ||
			function(proto) {
				function Child() {}
				Child.prototype = proto;
				return new Child();
			};

		/**
		 * Create a promise whose fate is determined by resolver
		 * @constructor
		 * @returns {Promise} promise
		 * @name Promise
		 */
		function Promise(resolver, handler) {
			this._handler = resolver === Handler ? handler : init(resolver);
		}

		/**
		 * Run the supplied resolver
		 * @param resolver
		 * @returns {Pending}
		 */
		function init(resolver) {
			var handler = new Pending();

			try {
				resolver(promiseResolve, promiseReject, promiseNotify);
			} catch (e) {
				promiseReject(e);
			}

			return handler;

			/**
			 * Transition from pre-resolution state to post-resolution state, notifying
			 * all listeners of the ultimate fulfillment or rejection
			 * @param {*} x resolution value
			 */
			function promiseResolve (x) {
				handler.resolve(x);
			}
			/**
			 * Reject this promise with reason, which will be used verbatim
			 * @param {Error|*} reason rejection reason, strongly suggested
			 *   to be an Error type
			 */
			function promiseReject (reason) {
				handler.reject(reason);
			}

			/**
			 * @deprecated
			 * Issue a progress event, notifying all progress listeners
			 * @param {*} x progress event payload to pass to all listeners
			 */
			function promiseNotify (x) {
				handler.notify(x);
			}
		}

		// Creation

		Promise.resolve = resolve;
		Promise.reject = reject;
		Promise.never = never;

		Promise._defer = defer;
		Promise._handler = getHandler;

		/**
		 * Returns a trusted promise. If x is already a trusted promise, it is
		 * returned, otherwise returns a new trusted Promise which follows x.
		 * @param  {*} x
		 * @return {Promise} promise
		 */
		function resolve(x) {
			return isPromise(x) ? x
				: new Promise(Handler, new Async(getHandler(x)));
		}

		/**
		 * Return a reject promise with x as its reason (x is used verbatim)
		 * @param {*} x
		 * @returns {Promise} rejected promise
		 */
		function reject(x) {
			return new Promise(Handler, new Async(new Rejected(x)));
		}

		/**
		 * Return a promise that remains pending forever
		 * @returns {Promise} forever-pending promise.
		 */
		function never() {
			return foreverPendingPromise; // Should be frozen
		}

		/**
		 * Creates an internal {promise, resolver} pair
		 * @private
		 * @returns {Promise}
		 */
		function defer() {
			return new Promise(Handler, new Pending());
		}

		// Transformation and flow control

		/**
		 * Transform this promise's fulfillment value, returning a new Promise
		 * for the transformed result.  If the promise cannot be fulfilled, onRejected
		 * is called with the reason.  onProgress *may* be called with updates toward
		 * this promise's fulfillment.
		 * @param {function=} onFulfilled fulfillment handler
		 * @param {function=} onRejected rejection handler
		 * @param {function=} onProgress @deprecated progress handler
		 * @return {Promise} new promise
		 */
		Promise.prototype.then = function(onFulfilled, onRejected, onProgress) {
			var parent = this._handler;
			var state = parent.join().state();

			if ((typeof onFulfilled !== 'function' && state > 0) ||
				(typeof onRejected !== 'function' && state < 0)) {
				// Short circuit: value will not change, simply share handler
				return new this.constructor(Handler, parent);
			}

			var p = this._beget();
			var child = p._handler;

			parent.chain(child, parent.receiver, onFulfilled, onRejected, onProgress);

			return p;
		};

		/**
		 * If this promise cannot be fulfilled due to an error, call onRejected to
		 * handle the error. Shortcut for .then(undefined, onRejected)
		 * @param {function?} onRejected
		 * @return {Promise}
		 */
		Promise.prototype['catch'] = function(onRejected) {
			return this.then(void 0, onRejected);
		};

		/**
		 * Creates a new, pending promise of the same type as this promise
		 * @private
		 * @returns {Promise}
		 */
		Promise.prototype._beget = function() {
			return begetFrom(this._handler, this.constructor);
		};

		function begetFrom(parent, Promise) {
			var child = new Pending(parent.receiver, parent.join().context);
			return new Promise(Handler, child);
		}

		// Array combinators

		Promise.all = all;
		Promise.race = race;
		Promise._traverse = traverse;

		/**
		 * Return a promise that will fulfill when all promises in the
		 * input array have fulfilled, or will reject when one of the
		 * promises rejects.
		 * @param {array} promises array of promises
		 * @returns {Promise} promise for array of fulfillment values
		 */
		function all(promises) {
			return traverseWith(snd, null, promises);
		}

		/**
		 * Array<Promise<X>> -> Promise<Array<f(X)>>
		 * @private
		 * @param {function} f function to apply to each promise's value
		 * @param {Array} promises array of promises
		 * @returns {Promise} promise for transformed values
		 */
		function traverse(f, promises) {
			return traverseWith(tryCatch2, f, promises);
		}

		function traverseWith(tryMap, f, promises) {
			var handler = typeof f === 'function' ? mapAt : settleAt;

			var resolver = new Pending();
			var pending = promises.length >>> 0;
			var results = new Array(pending);

			for (var i = 0, x; i < promises.length && !resolver.resolved; ++i) {
				x = promises[i];

				if (x === void 0 && !(i in promises)) {
					--pending;
					continue;
				}

				traverseAt(promises, handler, i, x, resolver);
			}

			if(pending === 0) {
				resolver.become(new Fulfilled(results));
			}

			return new Promise(Handler, resolver);

			function mapAt(i, x, resolver) {
				if(!resolver.resolved) {
					traverseAt(promises, settleAt, i, tryMap(f, x, i), resolver);
				}
			}

			function settleAt(i, x, resolver) {
				results[i] = x;
				if(--pending === 0) {
					resolver.become(new Fulfilled(results));
				}
			}
		}

		function traverseAt(promises, handler, i, x, resolver) {
			if (maybeThenable(x)) {
				var h = getHandlerMaybeThenable(x);
				var s = h.state();

				if (s === 0) {
					h.fold(handler, i, void 0, resolver);
				} else if (s > 0) {
					handler(i, h.value, resolver);
				} else {
					resolver.become(h);
					visitRemaining(promises, i+1, h);
				}
			} else {
				handler(i, x, resolver);
			}
		}

		Promise._visitRemaining = visitRemaining;
		function visitRemaining(promises, start, handler) {
			for(var i=start; i<promises.length; ++i) {
				markAsHandled(getHandler(promises[i]), handler);
			}
		}

		function markAsHandled(h, handler) {
			if(h === handler) {
				return;
			}

			var s = h.state();
			if(s === 0) {
				h.visit(h, void 0, h._unreport);
			} else if(s < 0) {
				h._unreport();
			}
		}

		/**
		 * Fulfill-reject competitive race. Return a promise that will settle
		 * to the same state as the earliest input promise to settle.
		 *
		 * WARNING: The ES6 Promise spec requires that race()ing an empty array
		 * must return a promise that is pending forever.  This implementation
		 * returns a singleton forever-pending promise, the same singleton that is
		 * returned by Promise.never(), thus can be checked with ===
		 *
		 * @param {array} promises array of promises to race
		 * @returns {Promise} if input is non-empty, a promise that will settle
		 * to the same outcome as the earliest input promise to settle. if empty
		 * is empty, returns a promise that will never settle.
		 */
		function race(promises) {
			if(typeof promises !== 'object' || promises === null) {
				return reject(new TypeError('non-iterable passed to race()'));
			}

			// Sigh, race([]) is untestable unless we return *something*
			// that is recognizable without calling .then() on it.
			return promises.length === 0 ? never()
				 : promises.length === 1 ? resolve(promises[0])
				 : runRace(promises);
		}

		function runRace(promises) {
			var resolver = new Pending();
			var i, x, h;
			for(i=0; i<promises.length; ++i) {
				x = promises[i];
				if (x === void 0 && !(i in promises)) {
					continue;
				}

				h = getHandler(x);
				if(h.state() !== 0) {
					resolver.become(h);
					visitRemaining(promises, i+1, h);
					break;
				} else {
					h.visit(resolver, resolver.resolve, resolver.reject);
				}
			}
			return new Promise(Handler, resolver);
		}

		// Promise internals
		// Below this, everything is @private

		/**
		 * Get an appropriate handler for x, without checking for cycles
		 * @param {*} x
		 * @returns {object} handler
		 */
		function getHandler(x) {
			if(isPromise(x)) {
				return x._handler.join();
			}
			return maybeThenable(x) ? getHandlerUntrusted(x) : new Fulfilled(x);
		}

		/**
		 * Get a handler for thenable x.
		 * NOTE: You must only call this if maybeThenable(x) == true
		 * @param {object|function|Promise} x
		 * @returns {object} handler
		 */
		function getHandlerMaybeThenable(x) {
			return isPromise(x) ? x._handler.join() : getHandlerUntrusted(x);
		}

		/**
		 * Get a handler for potentially untrusted thenable x
		 * @param {*} x
		 * @returns {object} handler
		 */
		function getHandlerUntrusted(x) {
			try {
				var untrustedThen = x.then;
				return typeof untrustedThen === 'function'
					? new Thenable(untrustedThen, x)
					: new Fulfilled(x);
			} catch(e) {
				return new Rejected(e);
			}
		}

		/**
		 * Handler for a promise that is pending forever
		 * @constructor
		 */
		function Handler() {}

		Handler.prototype.when
			= Handler.prototype.become
			= Handler.prototype.notify // deprecated
			= Handler.prototype.fail
			= Handler.prototype._unreport
			= Handler.prototype._report
			= noop;

		Handler.prototype._state = 0;

		Handler.prototype.state = function() {
			return this._state;
		};

		/**
		 * Recursively collapse handler chain to find the handler
		 * nearest to the fully resolved value.
		 * @returns {object} handler nearest the fully resolved value
		 */
		Handler.prototype.join = function() {
			var h = this;
			while(h.handler !== void 0) {
				h = h.handler;
			}
			return h;
		};

		Handler.prototype.chain = function(to, receiver, fulfilled, rejected, progress) {
			this.when({
				resolver: to,
				receiver: receiver,
				fulfilled: fulfilled,
				rejected: rejected,
				progress: progress
			});
		};

		Handler.prototype.visit = function(receiver, fulfilled, rejected, progress) {
			this.chain(failIfRejected, receiver, fulfilled, rejected, progress);
		};

		Handler.prototype.fold = function(f, z, c, to) {
			this.when(new Fold(f, z, c, to));
		};

		/**
		 * Handler that invokes fail() on any handler it becomes
		 * @constructor
		 */
		function FailIfRejected() {}

		inherit(Handler, FailIfRejected);

		FailIfRejected.prototype.become = function(h) {
			h.fail();
		};

		var failIfRejected = new FailIfRejected();

		/**
		 * Handler that manages a queue of consumers waiting on a pending promise
		 * @constructor
		 */
		function Pending(receiver, inheritedContext) {
			Promise.createContext(this, inheritedContext);

			this.consumers = void 0;
			this.receiver = receiver;
			this.handler = void 0;
			this.resolved = false;
		}

		inherit(Handler, Pending);

		Pending.prototype._state = 0;

		Pending.prototype.resolve = function(x) {
			this.become(getHandler(x));
		};

		Pending.prototype.reject = function(x) {
			if(this.resolved) {
				return;
			}

			this.become(new Rejected(x));
		};

		Pending.prototype.join = function() {
			if (!this.resolved) {
				return this;
			}

			var h = this;

			while (h.handler !== void 0) {
				h = h.handler;
				if (h === this) {
					return this.handler = cycle();
				}
			}

			return h;
		};

		Pending.prototype.run = function() {
			var q = this.consumers;
			var handler = this.join();
			this.consumers = void 0;

			for (var i = 0; i < q.length; ++i) {
				handler.when(q[i]);
			}
		};

		Pending.prototype.become = function(handler) {
			if(this.resolved) {
				return;
			}

			this.resolved = true;
			this.handler = handler;
			if(this.consumers !== void 0) {
				tasks.enqueue(this);
			}

			if(this.context !== void 0) {
				handler._report(this.context);
			}
		};

		Pending.prototype.when = function(continuation) {
			if(this.resolved) {
				tasks.enqueue(new ContinuationTask(continuation, this.handler));
			} else {
				if(this.consumers === void 0) {
					this.consumers = [continuation];
				} else {
					this.consumers.push(continuation);
				}
			}
		};

		/**
		 * @deprecated
		 */
		Pending.prototype.notify = function(x) {
			if(!this.resolved) {
				tasks.enqueue(new ProgressTask(x, this));
			}
		};

		Pending.prototype.fail = function(context) {
			var c = typeof context === 'undefined' ? this.context : context;
			this.resolved && this.handler.join().fail(c);
		};

		Pending.prototype._report = function(context) {
			this.resolved && this.handler.join()._report(context);
		};

		Pending.prototype._unreport = function() {
			this.resolved && this.handler.join()._unreport();
		};

		/**
		 * Wrap another handler and force it into a future stack
		 * @param {object} handler
		 * @constructor
		 */
		function Async(handler) {
			this.handler = handler;
		}

		inherit(Handler, Async);

		Async.prototype.when = function(continuation) {
			tasks.enqueue(new ContinuationTask(continuation, this));
		};

		Async.prototype._report = function(context) {
			this.join()._report(context);
		};

		Async.prototype._unreport = function() {
			this.join()._unreport();
		};

		/**
		 * Handler that wraps an untrusted thenable and assimilates it in a future stack
		 * @param {function} then
		 * @param {{then: function}} thenable
		 * @constructor
		 */
		function Thenable(then, thenable) {
			Pending.call(this);
			tasks.enqueue(new AssimilateTask(then, thenable, this));
		}

		inherit(Pending, Thenable);

		/**
		 * Handler for a fulfilled promise
		 * @param {*} x fulfillment value
		 * @constructor
		 */
		function Fulfilled(x) {
			Promise.createContext(this);
			this.value = x;
		}

		inherit(Handler, Fulfilled);

		Fulfilled.prototype._state = 1;

		Fulfilled.prototype.fold = function(f, z, c, to) {
			runContinuation3(f, z, this, c, to);
		};

		Fulfilled.prototype.when = function(cont) {
			runContinuation1(cont.fulfilled, this, cont.receiver, cont.resolver);
		};

		var errorId = 0;

		/**
		 * Handler for a rejected promise
		 * @param {*} x rejection reason
		 * @constructor
		 */
		function Rejected(x) {
			Promise.createContext(this);

			this.id = ++errorId;
			this.value = x;
			this.handled = false;
			this.reported = false;

			this._report();
		}

		inherit(Handler, Rejected);

		Rejected.prototype._state = -1;

		Rejected.prototype.fold = function(f, z, c, to) {
			to.become(this);
		};

		Rejected.prototype.when = function(cont) {
			if(typeof cont.rejected === 'function') {
				this._unreport();
			}
			runContinuation1(cont.rejected, this, cont.receiver, cont.resolver);
		};

		Rejected.prototype._report = function(context) {
			tasks.afterQueue(new ReportTask(this, context));
		};

		Rejected.prototype._unreport = function() {
			if(this.handled) {
				return;
			}
			this.handled = true;
			tasks.afterQueue(new UnreportTask(this));
		};

		Rejected.prototype.fail = function(context) {
			Promise.onFatalRejection(this, context === void 0 ? this.context : context);
		};

		function ReportTask(rejection, context) {
			this.rejection = rejection;
			this.context = context;
		}

		ReportTask.prototype.run = function() {
			if(!this.rejection.handled) {
				this.rejection.reported = true;
				Promise.onPotentiallyUnhandledRejection(this.rejection, this.context);
			}
		};

		function UnreportTask(rejection) {
			this.rejection = rejection;
		}

		UnreportTask.prototype.run = function() {
			if(this.rejection.reported) {
				Promise.onPotentiallyUnhandledRejectionHandled(this.rejection);
			}
		};

		// Unhandled rejection hooks
		// By default, everything is a noop

		// TODO: Better names: "annotate"?
		Promise.createContext
			= Promise.enterContext
			= Promise.exitContext
			= Promise.onPotentiallyUnhandledRejection
			= Promise.onPotentiallyUnhandledRejectionHandled
			= Promise.onFatalRejection
			= noop;

		// Errors and singletons

		var foreverPendingHandler = new Handler();
		var foreverPendingPromise = new Promise(Handler, foreverPendingHandler);

		function cycle() {
			return new Rejected(new TypeError('Promise cycle'));
		}

		// Task runners

		/**
		 * Run a single consumer
		 * @constructor
		 */
		function ContinuationTask(continuation, handler) {
			this.continuation = continuation;
			this.handler = handler;
		}

		ContinuationTask.prototype.run = function() {
			this.handler.join().when(this.continuation);
		};

		/**
		 * Run a queue of progress handlers
		 * @constructor
		 */
		function ProgressTask(value, handler) {
			this.handler = handler;
			this.value = value;
		}

		ProgressTask.prototype.run = function() {
			var q = this.handler.consumers;
			if(q === void 0) {
				return;
			}

			for (var c, i = 0; i < q.length; ++i) {
				c = q[i];
				runNotify(c.progress, this.value, this.handler, c.receiver, c.resolver);
			}
		};

		/**
		 * Assimilate a thenable, sending it's value to resolver
		 * @param {function} then
		 * @param {object|function} thenable
		 * @param {object} resolver
		 * @constructor
		 */
		function AssimilateTask(then, thenable, resolver) {
			this._then = then;
			this.thenable = thenable;
			this.resolver = resolver;
		}

		AssimilateTask.prototype.run = function() {
			var h = this.resolver;
			tryAssimilate(this._then, this.thenable, _resolve, _reject, _notify);

			function _resolve(x) { h.resolve(x); }
			function _reject(x)  { h.reject(x); }
			function _notify(x)  { h.notify(x); }
		};

		function tryAssimilate(then, thenable, resolve, reject, notify) {
			try {
				then.call(thenable, resolve, reject, notify);
			} catch (e) {
				reject(e);
			}
		}

		/**
		 * Fold a handler value with z
		 * @constructor
		 */
		function Fold(f, z, c, to) {
			this.f = f; this.z = z; this.c = c; this.to = to;
			this.resolver = failIfRejected;
			this.receiver = this;
		}

		Fold.prototype.fulfilled = function(x) {
			this.f.call(this.c, this.z, x, this.to);
		};

		Fold.prototype.rejected = function(x) {
			this.to.reject(x);
		};

		Fold.prototype.progress = function(x) {
			this.to.notify(x);
		};

		// Other helpers

		/**
		 * @param {*} x
		 * @returns {boolean} true iff x is a trusted Promise
		 */
		function isPromise(x) {
			return x instanceof Promise;
		}

		/**
		 * Test just enough to rule out primitives, in order to take faster
		 * paths in some code
		 * @param {*} x
		 * @returns {boolean} false iff x is guaranteed *not* to be a thenable
		 */
		function maybeThenable(x) {
			return (typeof x === 'object' || typeof x === 'function') && x !== null;
		}

		function runContinuation1(f, h, receiver, next) {
			if(typeof f !== 'function') {
				return next.become(h);
			}

			Promise.enterContext(h);
			tryCatchReject(f, h.value, receiver, next);
			Promise.exitContext();
		}

		function runContinuation3(f, x, h, receiver, next) {
			if(typeof f !== 'function') {
				return next.become(h);
			}

			Promise.enterContext(h);
			tryCatchReject3(f, x, h.value, receiver, next);
			Promise.exitContext();
		}

		/**
		 * @deprecated
		 */
		function runNotify(f, x, h, receiver, next) {
			if(typeof f !== 'function') {
				return next.notify(x);
			}

			Promise.enterContext(h);
			tryCatchReturn(f, x, receiver, next);
			Promise.exitContext();
		}

		function tryCatch2(f, a, b) {
			try {
				return f(a, b);
			} catch(e) {
				return reject(e);
			}
		}

		/**
		 * Return f.call(thisArg, x), or if it throws return a rejected promise for
		 * the thrown exception
		 */
		function tryCatchReject(f, x, thisArg, next) {
			try {
				next.become(getHandler(f.call(thisArg, x)));
			} catch(e) {
				next.become(new Rejected(e));
			}
		}

		/**
		 * Same as above, but includes the extra argument parameter.
		 */
		function tryCatchReject3(f, x, y, thisArg, next) {
			try {
				f.call(thisArg, x, y, next);
			} catch(e) {
				next.become(new Rejected(e));
			}
		}

		/**
		 * @deprecated
		 * Return f.call(thisArg, x), or if it throws, *return* the exception
		 */
		function tryCatchReturn(f, x, thisArg, next) {
			try {
				next.notify(f.call(thisArg, x));
			} catch(e) {
				next.notify(e);
			}
		}

		function inherit(Parent, Child) {
			Child.prototype = objectCreate(Parent.prototype);
			Child.prototype.constructor = Child;
		}

		function snd(x, y) {
			return y;
		}

		function noop() {}

		return Promise;
	};
});
}(typeof define === 'function' && define.amd ? define : function(factory) { module.exports = factory(); }));

},{}]},{},[1])
(1)
});
;
(function(__global) {
  
$__Object$getPrototypeOf = Object.getPrototypeOf || function(obj) {
  return obj.__proto__;
};

var $__Object$defineProperty;
(function () {
  try {
    if (!!Object.defineProperty({}, 'a', {})) {
      $__Object$defineProperty = Object.defineProperty;
    }
  } catch (e) {
    $__Object$defineProperty = function (obj, prop, opt) {
      try {
        obj[prop] = opt.value || opt.get.call(obj);
      }
      catch(e) {}
    }
  }
}());

$__Object$create = Object.create || function(o, props) {
  function F() {}
  F.prototype = o;

  if (typeof(props) === "object") {
    for (prop in props) {
      if (props.hasOwnProperty((prop))) {
        F[prop] = props[prop];
      }
    }
  }
  return new F();
};

/*
*********************************************************************************************

  Loader Polyfill

    - Implemented exactly to the 2014-07-18 Specification Draft.

    - Functions are commented with their spec numbers, with spec differences commented.

    - Spec bugs are commented in this code with links.

    - Abstract functions have been combined where possible, and their associated functions
      commented.

    - Realm implementation is entirely omitted.

    - Loader module table iteration currently not yet implemented.

*********************************************************************************************
*/

// Some Helpers

// logs a linkset snapshot for debugging
/* function snapshot(loader) {
  console.log('---Snapshot---');
  for (var i = 0; i < loader.loads.length; i++) {
    var load = loader.loads[i];
    var linkSetLog = '  ' + load.name + ' (' + load.status + '): ';

    for (var j = 0; j < load.linkSets.length; j++) {
      linkSetLog += '{' + logloads(load.linkSets[j].loads) + '} ';
    }
    console.log(linkSetLog);
  }
  console.log('');
}
function logloads(loads) {
  var log = '';
  for (var k = 0; k < loads.length; k++)
    log += loads[k].name + (k != loads.length - 1 ? ' ' : '');
  return log;
} */


/* function checkInvariants() {
  // see https://bugs.ecmascript.org/show_bug.cgi?id=2603#c1

  var loads = System._loader.loads;
  var linkSets = [];

  for (var i = 0; i < loads.length; i++) {
    var load = loads[i];
    console.assert(load.status == 'loading' || load.status == 'loaded', 'Each load is loading or loaded');

    for (var j = 0; j < load.linkSets.length; j++) {
      var linkSet = load.linkSets[j];

      for (var k = 0; k < linkSet.loads.length; k++)
        console.assert(loads.indexOf(linkSet.loads[k]) != -1, 'linkSet loads are a subset of loader loads');

      if (linkSets.indexOf(linkSet) == -1)
        linkSets.push(linkSet);
    }
  }

  for (var i = 0; i < loads.length; i++) {
    var load = loads[i];
    for (var j = 0; j < linkSets.length; j++) {
      var linkSet = linkSets[j];

      if (linkSet.loads.indexOf(load) != -1)
        console.assert(load.linkSets.indexOf(linkSet) != -1, 'linkSet contains load -> load contains linkSet');

      if (load.linkSets.indexOf(linkSet) != -1)
        console.assert(linkSet.loads.indexOf(load) != -1, 'load contains linkSet -> linkSet contains load');
    }
  }

  for (var i = 0; i < linkSets.length; i++) {
    var linkSet = linkSets[i];
    for (var j = 0; j < linkSet.loads.length; j++) {
      var load = linkSet.loads[j];

      for (var k = 0; k < load.dependencies.length; k++) {
        var depName = load.dependencies[k].value;
        var depLoad;
        for (var l = 0; l < loads.length; l++) {
          if (loads[l].name != depName)
            continue;
          depLoad = loads[l];
          break;
        }

        // loading records are allowed not to have their dependencies yet
        // if (load.status != 'loading')
        //  console.assert(depLoad, 'depLoad found');

        // console.assert(linkSet.loads.indexOf(depLoad) != -1, 'linkset contains all dependencies');
      }
    }
  }
} */


(function() {
  var Promise = __global.Promise || require('when/es6-shim/Promise');
  console.assert = console.assert || function() {};

  // IE8 support
  var indexOf = Array.prototype.indexOf || function(item) {
    for (var i = 0, thisLen = this.length; i < thisLen; i++) {
      if (this[i] === item) {
        return i;
      }
    }
    return -1;
  };
  var defineProperty = $__Object$defineProperty;

  // 15.2.3 - Runtime Semantics: Loader State

  // 15.2.3.11
  function createLoaderLoad(object) {
    return {
      // modules is an object for ES5 implementation
      modules: {},
      loads: [],
      loaderObj: object
    };
  }

  // 15.2.3.2 Load Records and LoadRequest Objects

  // 15.2.3.2.1
  function createLoad(name) {
    return {
      status: 'loading',
      name: name,
      linkSets: [],
      dependencies: [],
      metadata: {}
    };
  }

  // 15.2.3.2.2 createLoadRequestObject, absorbed into calling functions

  // 15.2.4

  // 15.2.4.1
  function loadModule(loader, name, options) {
    return new Promise(asyncStartLoadPartwayThrough({
      step: options.address ? 'fetch' : 'locate',
      loader: loader,
      moduleName: name,
      // allow metadata for import https://bugs.ecmascript.org/show_bug.cgi?id=3091
      moduleMetadata: options && options.metadata || {},
      moduleSource: options.source,
      moduleAddress: options.address
    }));
  }

  // 15.2.4.2
  function requestLoad(loader, request, refererName, refererAddress) {
    // 15.2.4.2.1 CallNormalize
    return new Promise(function(resolve, reject) {
      resolve(loader.loaderObj.normalize(request, refererName, refererAddress));
    })
    // 15.2.4.2.2 GetOrCreateLoad
    .then(function(name) {
      var load;
      if (loader.modules[name]) {
        load = createLoad(name);
        load.status = 'linked';
        // https://bugs.ecmascript.org/show_bug.cgi?id=2795
        // load.module = loader.modules[name];
        return load;
      }

      for (var i = 0, l = loader.loads.length; i < l; i++) {
        load = loader.loads[i];
        if (load.name != name)
          continue;
        console.assert(load.status == 'loading' || load.status == 'loaded', 'loading or loaded');
        return load;
      }

      load = createLoad(name);
      loader.loads.push(load);

      proceedToLocate(loader, load);

      return load;
    });
  }

  // 15.2.4.3
  function proceedToLocate(loader, load) {
    proceedToFetch(loader, load,
      Promise.resolve()
      // 15.2.4.3.1 CallLocate
      .then(function() {
        return loader.loaderObj.locate({ name: load.name, metadata: load.metadata });
      })
    );
  }

  // 15.2.4.4
  function proceedToFetch(loader, load, p) {
    proceedToTranslate(loader, load,
      p
      // 15.2.4.4.1 CallFetch
      .then(function(address) {
        // adjusted, see https://bugs.ecmascript.org/show_bug.cgi?id=2602
        if (load.status != 'loading')
          return;
        load.address = address;

        return loader.loaderObj.fetch({ name: load.name, metadata: load.metadata, address: address });
      })
    );
  }

  var anonCnt = 0;

  // 15.2.4.5
  function proceedToTranslate(loader, load, p) {
    p
    // 15.2.4.5.1 CallTranslate
    .then(function(source) {
      if (load.status != 'loading')
        return;
      return loader.loaderObj.translate({ name: load.name, metadata: load.metadata, address: load.address, source: source });
    })

    // 15.2.4.5.2 CallInstantiate
    .then(function(source) {
      if (load.status != 'loading')
        return;
      load.source = source;
      return loader.loaderObj.instantiate({ name: load.name, metadata: load.metadata, address: load.address, source: source });
    })

    // 15.2.4.5.3 InstantiateSucceeded
    .then(function(instantiateResult) {
      if (load.status != 'loading')
        return;

      if (instantiateResult === undefined) {
        load.address = load.address || '<Anonymous Module ' + ++anonCnt + '>';

        // NB instead of load.kind, use load.isDeclarative
        load.isDeclarative = true;
        // parse sets load.declare, load.depsList
        loader.loaderObj.parse(load);
      }
      else if (typeof instantiateResult == 'object') {
        load.depsList = instantiateResult.deps || [];
        load.execute = instantiateResult.execute;
        load.isDeclarative = false;
      }
      else
        throw TypeError('Invalid instantiate return value');

      // 15.2.4.6 ProcessLoadDependencies
      load.dependencies = [];
      var depsList = load.depsList;

      var loadPromises = [];
      for (var i = 0, l = depsList.length; i < l; i++) (function(request, index) {
        loadPromises.push(
          requestLoad(loader, request, load.name, load.address)

          // 15.2.4.6.1 AddDependencyLoad (load is parentLoad)
          .then(function(depLoad) {

            console.assert(!load.dependencies.some(function(dep) {
              return dep.key == request;
            }), 'not already a dependency');

            // adjusted from spec to maintain dependency order
            // this is due to the System.register internal implementation needs
            load.dependencies[index] = {
              key: request,
              value: depLoad.name
            };

            if (depLoad.status != 'linked') {
              var linkSets = load.linkSets.concat([]);
              for (var i = 0, l = linkSets.length; i < l; i++)
                addLoadToLinkSet(linkSets[i], depLoad);
            }

            // console.log('AddDependencyLoad ' + depLoad.name + ' for ' + load.name);
            // snapshot(loader);
          })
        );
      })(depsList[i], i);

      return Promise.all(loadPromises);
    })

    // 15.2.4.6.2 LoadSucceeded
    .then(function() {
      // console.log('LoadSucceeded ' + load.name);
      // snapshot(loader);

      console.assert(load.status == 'loading', 'is loading');

      load.status = 'loaded';

      var linkSets = load.linkSets.concat([]);
      for (var i = 0, l = linkSets.length; i < l; i++)
        updateLinkSetOnLoad(linkSets[i], load);
    })

    // 15.2.4.5.4 LoadFailed
    ['catch'](function(exc) {
      console.assert(load.status == 'loading', 'is loading on fail');
      load.status = 'failed';
      load.exception = exc;

      var linkSets = load.linkSets.concat([]);
      for (var i = 0, l = linkSets.length; i < l; i++) {
        linkSetFailed(linkSets[i], load, exc);
      }

      console.assert(load.linkSets.length == 0, 'linkSets not removed');
    });
  }

  // 15.2.4.7 PromiseOfStartLoadPartwayThrough absorbed into calling functions

  // 15.2.4.7.1
  function asyncStartLoadPartwayThrough(stepState) {
    return function(resolve, reject) {
      var loader = stepState.loader;
      var name = stepState.moduleName;
      var step = stepState.step;

      if (loader.modules[name])
        throw new TypeError('"' + name + '" already exists in the module table');

      // NB this still seems wrong for LoadModule as we may load a dependency
      // of another module directly before it has finished loading.
      // see https://bugs.ecmascript.org/show_bug.cgi?id=2994
      for (var i = 0, l = loader.loads.length; i < l; i++)
        if (loader.loads[i].name == name)
          throw new TypeError('"' + name + '" already loading');

      var load = createLoad(name);

      load.metadata = stepState.moduleMetadata;

      var linkSet = createLinkSet(loader, load);

      loader.loads.push(load);

      resolve(linkSet.done);

      if (step == 'locate')
        proceedToLocate(loader, load);

      else if (step == 'fetch')
        proceedToFetch(loader, load, Promise.resolve(stepState.moduleAddress));

      else {
        console.assert(step == 'translate', 'translate step');
        load.address = stepState.moduleAddress;
        proceedToTranslate(loader, load, Promise.resolve(stepState.moduleSource));
      }
    }
  }

  // Declarative linking functions run through alternative implementation:
  // 15.2.5.1.1 CreateModuleLinkageRecord not implemented
  // 15.2.5.1.2 LookupExport not implemented
  // 15.2.5.1.3 LookupModuleDependency not implemented

  // 15.2.5.2.1
  function createLinkSet(loader, startingLoad) {
    var linkSet = {
      loader: loader,
      loads: [],
      startingLoad: startingLoad, // added see spec bug https://bugs.ecmascript.org/show_bug.cgi?id=2995
      loadingCount: 0
    };
    linkSet.done = new Promise(function(resolve, reject) {
      linkSet.resolve = resolve;
      linkSet.reject = reject;
    });
    addLoadToLinkSet(linkSet, startingLoad);
    return linkSet;
  }
  // 15.2.5.2.2
  function addLoadToLinkSet(linkSet, load) {
    console.assert(load.status == 'loading' || load.status == 'loaded', 'loading or loaded on link set');

    for (var i = 0, l = linkSet.loads.length; i < l; i++)
      if (linkSet.loads[i] == load)
        return;

    linkSet.loads.push(load);
    load.linkSets.push(linkSet);

    // adjustment, see https://bugs.ecmascript.org/show_bug.cgi?id=2603
    if (load.status != 'loaded') {
      linkSet.loadingCount++;
    }

    var loader = linkSet.loader;

    for (var i = 0, l = load.dependencies.length; i < l; i++) {
      var name = load.dependencies[i].value;

      if (loader.modules[name])
        continue;

      for (var j = 0, d = loader.loads.length; j < d; j++) {
        if (loader.loads[j].name != name)
          continue;

        addLoadToLinkSet(linkSet, loader.loads[j]);
        break;
      }
    }
    // console.log('add to linkset ' + load.name);
    // snapshot(linkSet.loader);
  }

  // linking errors can be generic or load-specific
  // this is necessary for debugging info
  function doLink(linkSet) {
    var error = false;
    try {
      link(linkSet, function(load, exc) {
        linkSetFailed(linkSet, load, exc);
        error = true;
      });
    }
    catch(e) {
      linkSetFailed(linkSet, null, e);
      error = true;
    }
    return error;
  }

  // 15.2.5.2.3
  function updateLinkSetOnLoad(linkSet, load) {
    // console.log('update linkset on load ' + load.name);
    // snapshot(linkSet.loader);

    console.assert(load.status == 'loaded' || load.status == 'linked', 'loaded or linked');

    linkSet.loadingCount--;

    if (linkSet.loadingCount > 0)
      return;

    // adjusted for spec bug https://bugs.ecmascript.org/show_bug.cgi?id=2995
    var startingLoad = linkSet.startingLoad;

    // non-executing link variation for loader tracing
    // on the server. Not in spec.
    /***/
    if (linkSet.loader.loaderObj.execute === false) {
      var loads = [].concat(linkSet.loads);
      for (var i = 0, l = loads.length; i < l; i++) {
        var load = loads[i];
        load.module = !load.isDeclarative ? {
          module: _newModule({})
        } : {
          name: load.name,
          module: _newModule({}),
          evaluated: true
        };
        load.status = 'linked';
        finishLoad(linkSet.loader, load);
      }
      return linkSet.resolve(startingLoad);
    }
    /***/

    var abrupt = doLink(linkSet);

    if (abrupt)
      return;

    console.assert(linkSet.loads.length == 0, 'loads cleared');

    linkSet.resolve(startingLoad);
  }

  // 15.2.5.2.4
  function linkSetFailed(linkSet, load, exc) {
    var loader = linkSet.loader;

    if (linkSet.loads[0].name != load.name)
      exc = addToError(exc, 'Error loading "' + load.name + '" from "' + linkSet.loads[0].name + '" at ' + (linkSet.loads[0].address || '<unknown>') + '\n');

    exc = addToError(exc, 'Error loading "' + load.name + '" at ' + (load.address || '<unknown>') + '\n');

    var loads = linkSet.loads.concat([]);
    for (var i = 0, l = loads.length; i < l; i++) {
      var load = loads[i];

      // store all failed load records
      loader.loaderObj.failed = loader.loaderObj.failed || [];
      if (indexOf.call(loader.loaderObj.failed, load) == -1)
        loader.loaderObj.failed.push(load);

      var linkIndex = indexOf.call(load.linkSets, linkSet);
      console.assert(linkIndex != -1, 'link not present');
      load.linkSets.splice(linkIndex, 1);
      if (load.linkSets.length == 0) {
        var globalLoadsIndex = indexOf.call(linkSet.loader.loads, load);
        if (globalLoadsIndex != -1)
          linkSet.loader.loads.splice(globalLoadsIndex, 1);
      }
    }
    linkSet.reject(exc);
  }

  // 15.2.5.2.5
  function finishLoad(loader, load) {
    // add to global trace if tracing
    if (loader.loaderObj.trace) {
      if (!loader.loaderObj.loads)
        loader.loaderObj.loads = {};
      var depMap = {};
      load.dependencies.forEach(function(dep) {
        depMap[dep.key] = dep.value;
      });
      loader.loaderObj.loads[load.name] = {
        name: load.name,
        deps: load.dependencies.map(function(dep){ return dep.key }),
        depMap: depMap,
        address: load.address,
        metadata: load.metadata,
        source: load.source,
        kind: load.isDeclarative ? 'declarative' : 'dynamic'
      };
    }
    // if not anonymous, add to the module table
    if (load.name) {
      console.assert(!loader.modules[load.name], 'load not in module table');
      loader.modules[load.name] = load.module;
    }
    var loadIndex = indexOf.call(loader.loads, load);
    if (loadIndex != -1)
      loader.loads.splice(loadIndex, 1);
    for (var i = 0, l = load.linkSets.length; i < l; i++) {
      loadIndex = indexOf.call(load.linkSets[i].loads, load);
      if (loadIndex != -1)
        load.linkSets[i].loads.splice(loadIndex, 1);
    }
    load.linkSets.splice(0, load.linkSets.length);
  }

  // 15.2.5.3 Module Linking Groups

  // 15.2.5.3.2 BuildLinkageGroups alternative implementation
  // Adjustments (also see https://bugs.ecmascript.org/show_bug.cgi?id=2755)
  // 1. groups is an already-interleaved array of group kinds
  // 2. load.groupIndex is set when this function runs
  // 3. load.groupIndex is the interleaved index ie 0 declarative, 1 dynamic, 2 declarative, ... (or starting with dynamic)
  function buildLinkageGroups(load, loads, groups, loader) {
    groups[load.groupIndex] = groups[load.groupIndex] || [];

    // if the load already has a group index and its in its group, its already been done
    // this logic naturally handles cycles
    if (indexOf.call(groups[load.groupIndex], load) != -1)
      return;

    // now add it to the group to indicate its been seen
    groups[load.groupIndex].push(load);

    for (var i = 0, l = loads.length; i < l; i++) {
      var loadDep = loads[i];

      // dependencies not found are already linked
      for (var j = 0; j < load.dependencies.length; j++) {
        if (loadDep.name == load.dependencies[j].value) {
          // by definition all loads in linkset are loaded, not linked
          console.assert(loadDep.status == 'loaded', 'Load in linkSet not loaded!');

          // if it is a group transition, the index of the dependency has gone up
          // otherwise it is the same as the parent
          var loadDepGroupIndex = load.groupIndex + (loadDep.isDeclarative != load.isDeclarative);

          // the group index of an entry is always the maximum
          if (loadDep.groupIndex === undefined || loadDep.groupIndex < loadDepGroupIndex) {

            // if already in a group, remove from the old group
            if (loadDep.groupIndex) {
              groups[loadDep.groupIndex].splice(indexOf.call(groups[loadDep.groupIndex], loadDep), 1);

              // if the old group is empty, then we have a mixed depndency cycle
              if (groups[loadDep.groupIndex].length == 0)
                throw new TypeError("Mixed dependency cycle detected");
            }

            loadDep.groupIndex = loadDepGroupIndex;
          }

          buildLinkageGroups(loadDep, loads, groups, loader);
        }
      }
    }
  }

  function doDynamicExecute(linkSet, load, linkError) {
    try {
      var module = load.execute();
    }
    catch(e) {
      linkError(load, e);
      return;
    }
    if (!module || !(module instanceof Module))
      linkError(load, new TypeError('Execution must define a Module instance'));
    else
      return module;
  }

  // 15.2.5.4
  function link(linkSet, linkError) {

    var loader = linkSet.loader;

    if (!linkSet.loads.length)
      return;

    // console.log('linking {' + logloads(linkSet.loads) + '}');
    // snapshot(loader);

    // 15.2.5.3.1 LinkageGroups alternative implementation

    // build all the groups
    // because the first load represents the top of the tree
    // for a given linkset, we can work down from there
    var groups = [];
    var startingLoad = linkSet.loads[0];
    startingLoad.groupIndex = 0;
    buildLinkageGroups(startingLoad, linkSet.loads, groups, loader);

    // determine the kind of the bottom group
    var curGroupDeclarative = startingLoad.isDeclarative == groups.length % 2;

    // run through the groups from bottom to top
    for (var i = groups.length - 1; i >= 0; i--) {
      var group = groups[i];
      for (var j = 0; j < group.length; j++) {
        var load = group[j];

        // 15.2.5.5 LinkDeclarativeModules adjusted
        if (curGroupDeclarative) {
          linkDeclarativeModule(load, linkSet.loads, loader);
        }
        // 15.2.5.6 LinkDynamicModules adjusted
        else {
          var module = doDynamicExecute(linkSet, load, linkError);
          if (!module)
            return;
          load.module = {
            name: load.name,
            module: module
          };
          load.status = 'linked';
        }
        finishLoad(loader, load);
      }

      // alternative current kind for next loop
      curGroupDeclarative = !curGroupDeclarative;
    }
  }


  // custom module records for binding graph
  // store linking module records in a separate table
  function getOrCreateModuleRecord(name, loader) {
    var moduleRecords = loader.moduleRecords;
    return moduleRecords[name] || (moduleRecords[name] = {
      name: name,
      dependencies: [],
      module: new Module(), // start from an empty module and extend
      importers: []
    });
  }

  // custom declarative linking function
  function linkDeclarativeModule(load, loads, loader) {
    if (load.module)
      return;

    var module = load.module = getOrCreateModuleRecord(load.name, loader);
    var moduleObj = load.module.module;

    var registryEntry = load.declare.call(__global, function(name, value) {
      // NB This should be an Object.defineProperty, but that is very slow.
      //    By disaling this module write-protection we gain performance.
      //    It could be useful to allow an option to enable or disable this.
      module.locked = true;
      moduleObj[name] = value;

      for (var i = 0, l = module.importers.length; i < l; i++) {
        var importerModule = module.importers[i];
        if (!importerModule.locked) {
          var importerIndex = indexOf.call(importerModule.dependencies, module);
          importerModule.setters[importerIndex](moduleObj);
        }
      }

      module.locked = false;
      return value;
    });

    // setup our setters and execution function
    module.setters = registryEntry.setters;
    module.execute = registryEntry.execute;

    // now link all the module dependencies
    // amending the depMap as we go
    for (var i = 0, l = load.dependencies.length; i < l; i++) {
      var depName = load.dependencies[i].value;
      var depModule = loader.modules[depName];

      // if dependency not already in the module registry
      // then try and link it now
      if (!depModule) {
        // get the dependency load record
        for (var j = 0; j < loads.length; j++) {
          if (loads[j].name != depName)
            continue;

          // only link if already not already started linking (stops at circular / dynamic)
          if (!loads[j].module) {
            linkDeclarativeModule(loads[j], loads, loader);
            depModule = loads[j].module;
          }
          // if circular, create the module record
          else {
            depModule = getOrCreateModuleRecord(depName, loader);
          }
        }
      }

      // only declarative modules have dynamic bindings
      if (depModule.importers) {
        module.dependencies.push(depModule);
        depModule.importers.push(module);
      }
      else {
        // track dynamic records as null module records as already linked
        module.dependencies.push(null);
      }

      // run the setter for this dependency
      if (module.setters[i])
        module.setters[i](depModule.module);
    }

    load.status = 'linked';
  }



  // 15.2.5.5.1 LinkImports not implemented
  // 15.2.5.7 ResolveExportEntries not implemented
  // 15.2.5.8 ResolveExports not implemented
  // 15.2.5.9 ResolveExport not implemented
  // 15.2.5.10 ResolveImportEntries not implemented

  // 15.2.6.1
  function evaluateLoadedModule(loader, load) {
    console.assert(load.status == 'linked', 'is linked ' + load.name);

    doEnsureEvaluated(load.module, [], loader);
    return load.module.module;
  }

  /*
   * Module Object non-exotic for ES5:
   *
   * module.module        bound module object
   * module.execute       execution function for module
   * module.dependencies  list of module objects for dependencies
   * See getOrCreateModuleRecord for all properties
   *
   */
  function doExecute(module) {
    try {
      module.execute.call(__global);
    }
    catch(e) {
      return e;
    }
  }

  // propogate execution errors
  // see https://bugs.ecmascript.org/show_bug.cgi?id=2993
  function doEnsureEvaluated(module, seen, loader) {
    var err = ensureEvaluated(module, seen, loader);
    if (err)
      throw err;
  }
  // 15.2.6.2 EnsureEvaluated adjusted
  function ensureEvaluated(module, seen, loader) {
    if (module.evaluated || !module.dependencies)
      return;

    seen.push(module);

    var deps = module.dependencies;
    var err;

    for (var i = 0, l = deps.length; i < l; i++) {
      var dep = deps[i];
      // dynamic dependencies are empty in module.dependencies
      // as they are already linked
      if (!dep)
        continue;
      if (indexOf.call(seen, dep) == -1) {
        err = ensureEvaluated(dep, seen, loader);
        // stop on error, see https://bugs.ecmascript.org/show_bug.cgi?id=2996
        if (err) {
          err = addToError(err, 'Error evaluating ' + dep.name + '\n');
          return err;
        }
      }
    }

    if (module.failed)
      return new Error('Module failed execution.');

    if (module.evaluated)
      return;

    module.evaluated = true;
    err = doExecute(module);
    if (err) {
      module.failed = true;
    }
    else if (Object.preventExtensions) {
      // spec variation
      // we don't create a new module here because it was created and ammended
      // we just disable further extensions instead
      Object.preventExtensions(module.module);
    }

    module.execute = undefined;
    return err;
  }

  function addToError(err, msg) {
    if (err instanceof Error)
      err.message = msg + err.message;
    else
      err = msg + err;
    return err;
  }

  // 26.3 Loader

  // 26.3.1.1
  function Loader(options) {
    if (typeof options != 'object')
      throw new TypeError('Options must be an object');

    if (options.normalize)
      this.normalize = options.normalize;
    if (options.locate)
      this.locate = options.locate;
    if (options.fetch)
      this.fetch = options.fetch;
    if (options.translate)
      this.translate = options.translate;
    if (options.instantiate)
      this.instantiate = options.instantiate;

    this._loader = {
      loaderObj: this,
      loads: [],
      modules: {},
      importPromises: {},
      moduleRecords: {}
    };

    // 26.3.3.6
    defineProperty(this, 'global', {
      get: function() {
        return __global;
      }
    });

    // 26.3.3.13 realm not implemented
  }

  function Module() {}

  // importPromises adds ability to import a module twice without error - https://bugs.ecmascript.org/show_bug.cgi?id=2601
  function createImportPromise(loader, name, promise) {
    var importPromises = loader._loader.importPromises;
    return importPromises[name] = promise.then(function(m) {
      importPromises[name] = undefined;
      return m;
    }, function(e) {
      importPromises[name] = undefined;
      throw e;
    });
  }

  Loader.prototype = {
    // 26.3.3.1
    constructor: Loader,
    // 26.3.3.2
    define: function(name, source, options) {
      // check if already defined
      if (this._loader.importPromises[name])
        throw new TypeError('Module is already loading.');
      return createImportPromise(this, name, new Promise(asyncStartLoadPartwayThrough({
        step: 'translate',
        loader: this._loader,
        moduleName: name,
        moduleMetadata: options && options.metadata || {},
        moduleSource: source,
        moduleAddress: options && options.address
      })));
    },
    // 26.3.3.3
    'delete': function(name) {
      return this._loader.modules[name] ? delete this._loader.modules[name] : false;
    },
    // 26.3.3.4 entries not implemented
    // 26.3.3.5
    get: function(key) {
      if (!this._loader.modules[key])
        return;
      doEnsureEvaluated(this._loader.modules[key], [], this);
      return this._loader.modules[key].module;
    },
    // 26.3.3.7
    has: function(name) {
      return !!this._loader.modules[name];
    },
    // 26.3.3.8
    'import': function(name, options) {
      // run normalize first
      var loaderObj = this;

      // added, see https://bugs.ecmascript.org/show_bug.cgi?id=2659
      return Promise.resolve(loaderObj.normalize(name, options && options.name, options && options.address))
      .then(function(name) {
        var loader = loaderObj._loader;

        if (loader.modules[name]) {
          doEnsureEvaluated(loader.modules[name], [], loader._loader);
          return loader.modules[name].module;
        }

        return loader.importPromises[name] || createImportPromise(loaderObj, name,
          loadModule(loader, name, options || {})
          .then(function(load) {
            delete loader.importPromises[name];
            return evaluateLoadedModule(loader, load);
          }));
      });
    },
    // 26.3.3.9 keys not implemented
    // 26.3.3.10
    load: function(name, options) {
      if (this._loader.modules[name]) {
        doEnsureEvaluated(this._loader.modules[name], [], this._loader);
        return Promise.resolve(this._loader.modules[name].module);
      }
      return this._loader.importPromises[name] || createImportPromise(this, name, loadModule(this._loader, name, {}));
    },
    // 26.3.3.11
    module: function(source, options) {
      var load = createLoad();
      load.address = options && options.address;
      var linkSet = createLinkSet(this._loader, load);
      var sourcePromise = Promise.resolve(source);
      var loader = this._loader;
      var p = linkSet.done.then(function() {
        return evaluateLoadedModule(loader, load);
      });
      proceedToTranslate(loader, load, sourcePromise);
      return p;
    },
    // 26.3.3.12
    newModule: function (obj) {
      if (typeof obj != 'object')
        throw new TypeError('Expected object');

      // we do this to be able to tell if a module is a module privately in ES5
      // by doing m instanceof Module
      var m = new Module();

      for (var key in obj) {
        (function (key) {
          defineProperty(m, key, {
            configurable: false,
            enumerable: true,
            get: function () {
              return obj[key];
            }
          });
        })(key);
      }

      if (Object.preventExtensions)
        Object.preventExtensions(m);

      return m;
    },
    // 26.3.3.14
    set: function(name, module) {
      if (!(module instanceof Module))
        throw new TypeError('Loader.set(' + name + ', module) must be a module');
      this._loader.modules[name] = {
        module: module
      };
    },
    // 26.3.3.15 values not implemented
    // 26.3.3.16 @@iterator not implemented
    // 26.3.3.17 @@toStringTag not implemented

    // 26.3.3.18.1
    normalize: function(name, referrerName, referrerAddress) {
      return name;
    },
    // 26.3.3.18.2
    locate: function(load) {
      return load.name;
    },
    // 26.3.3.18.3
    fetch: function(load) {
      throw new TypeError('Fetch not implemented');
    },
    // 26.3.3.18.4
    translate: function(load) {
      return load.source;
    },
    parse: function(load) {
      throw new TypeError('Loader.parse is not implemented');
    },
    // 26.3.3.18.5
    instantiate: function(load) {
    }
  };

  var _newModule = Loader.prototype.newModule;


  /*
   * Traceur-specific Parsing Code for Loader
   */
  (function() {
    // parse function is used to parse a load record
    // Returns an array of ModuleSpecifiers
    var traceur;

    function doCompile(source, compiler, filename) {
      try {
        return compiler.compile(source, filename);
      }
      catch(e) {
        // traceur throws an error array
        throw e[0];
      }
    }
    Loader.prototype.parse = function(load) {
      if (!traceur) {
        if (typeof window == 'undefined' &&
           typeof WorkerGlobalScope == 'undefined')
          traceur = require('traceur');
        else if (__global.traceur)
          traceur = __global.traceur;
        else
          throw new TypeError('Include Traceur for module syntax support');
      }

      console.assert(load.source, 'Non-empty source');

      var depsList;

      load.isDeclarative = true;

      var options = this.traceurOptions || {};
      options.modules = 'instantiate';
      options.script = false;
      options.sourceMaps = true;
      options.filename = load.address;

      var compiler = new traceur.Compiler(options);

      var source = doCompile(load.source, compiler, options.filename);

      if (!source)
        throw new Error('Error evaluating module ' + load.address);

      var sourceMap = compiler.getSourceMap();

      if (__global.btoa && sourceMap)
        source += '\n//# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(sourceMap))) + '\n';

      source = 'var __moduleAddress = "' + load.address + '";' + source;

      __eval(source, __global, load);
    }
  })();

  if (typeof exports === 'object')
    module.exports = Loader;

  __global.Reflect = __global.Reflect || {};
  __global.Reflect.Loader = __global.Reflect.Loader || Loader;
  __global.Reflect.global = __global.Reflect.global || __global;
  __global.LoaderPolyfill = Loader;

})();

/*
*********************************************************************************************

  System Loader Implementation

    - Implemented to https://github.com/jorendorff/js-loaders/blob/master/browser-loader.js

    - <script type="module"> supported

*********************************************************************************************
*/



(function() {
  var isWorker = typeof self !== 'undefined' && typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope;
  var isBrowser = typeof window != 'undefined' && !isWorker;
  var isWindows = typeof process != 'undefined' && !!process.platform.match(/^win/);
  var Promise = __global.Promise || require('when/es6-shim/Promise');

  // Helpers
  // Absolute URL parsing, from https://gist.github.com/Yaffle/1088850
  function parseURI(url) {
    var m = String(url).replace(/^\s+|\s+$/g, '').match(/^([^:\/?#]+:)?(\/\/(?:[^:@\/?#]*(?::[^:@\/?#]*)?@)?(([^:\/?#]*)(?::(\d*))?))?([^?#]*)(\?[^#]*)?(#[\s\S]*)?/);
    // authority = '//' + user + ':' + pass '@' + hostname + ':' port
    return (m ? {
      href     : m[0] || '',
      protocol : m[1] || '',
      authority: m[2] || '',
      host     : m[3] || '',
      hostname : m[4] || '',
      port     : m[5] || '',
      pathname : m[6] || '',
      search   : m[7] || '',
      hash     : m[8] || ''
    } : null);
  }

  function removeDotSegments(input) {
    var output = [];
    input.replace(/^(\.\.?(\/|$))+/, '')
      .replace(/\/(\.(\/|$))+/g, '/')
      .replace(/\/\.\.$/, '/../')
      .replace(/\/?[^\/]*/g, function (p) {
        if (p === '/..')
          output.pop();
        else
          output.push(p);
    });
    return output.join('').replace(/^\//, input.charAt(0) === '/' ? '/' : '');
  }

  function toAbsoluteURL(base, href) {

    href = parseURI(href || '');
    base = parseURI(base || '');

    return !href || !base ? null : (href.protocol || base.protocol) +
      (href.protocol || href.authority ? href.authority : base.authority) +
      removeDotSegments(href.protocol || href.authority || href.pathname.charAt(0) === '/' ? href.pathname : (href.pathname ? ((base.authority && !base.pathname ? '/' : '') + base.pathname.slice(0, base.pathname.lastIndexOf('/') + 1) + href.pathname) : base.pathname)) +
      (href.protocol || href.authority || href.pathname ? href.search : (href.search || base.search)) +
      href.hash;
  }

  var fetchTextFromURL;

  if (typeof XMLHttpRequest != 'undefined') {
    fetchTextFromURL = function(url, fulfill, reject) {
      var xhr = new XMLHttpRequest();
      var sameDomain = true;
      if (!('withCredentials' in xhr)) {
        // check if same domain
        var domainCheck = /^(\w+:)?\/\/([^\/]+)/.exec(url);
        if (domainCheck) {
          sameDomain = domainCheck[2] === window.location.host;
          if (domainCheck[1])
            sameDomain &= domainCheck[1] === window.location.protocol;
        }
      }
      if (!sameDomain && typeof XDomainRequest != 'undefined') {
        xhr = new XDomainRequest();
        xhr.onload = load;
        xhr.onerror = error;
        xhr.ontimeout = error;
        // IE8/IE9 bug may hang requests unless all properties are defined. 
        // See: http://stackoverflow.com/a/9928073/3949247
        xhr.onprogress = function() {};
        xhr.timeout = 0;
      }
      function load() {
        fulfill(xhr.responseText);
      }
      function error() {
        reject(xhr.statusText + ': ' + url || 'XHR error');
      }

      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          if (xhr.status === 200 || (xhr.status == 0 && xhr.responseText)) {
            load();
          } else {
            error();
          }
        }
      };
      xhr.open("GET", url, true);
      xhr.send(null);
    }
  }
  else if (typeof require != 'undefined') {
    var fs;
    fetchTextFromURL = function(url, fulfill, reject) {
      if (url.substr(0, 5) != 'file:')
        throw 'Only file URLs of the form file: allowed running in Node.';
      fs = fs || require('fs');
      url = url.substr(5);
      if (isWindows)
        url = url.replace(/\//g, '\\');
      return fs.readFile(url, function(err, data) {
        if (err)
          return reject(err);
        else
          fulfill(data + '');
      });
    }
  }
  else {
    throw new TypeError('No environment fetch API available.');
  }

  var SystemLoader = function($__super) {
    function SystemLoader(options) {
      $__super.call(this, options || {});

      // Set default baseURL and paths
      if (typeof location != 'undefined' && location.href) {
        var href = __global.location.href.split('#')[0].split('?')[0];
        this.baseURL = href.substring(0, href.lastIndexOf('/') + 1);
      }
      else if (typeof process != 'undefined' && process.cwd) {
        this.baseURL = 'file:' + process.cwd() + '/';
        if (isWindows)
          this.baseURL = this.baseURL.replace(/\\/g, '/');
      }
      else {
        throw new TypeError('No environment baseURL');
      }
      this.paths = { '*': '*.js' };
    }

    SystemLoader.__proto__ = ($__super !== null ? $__super : Function.prototype);
    SystemLoader.prototype = $__Object$create(($__super !== null ? $__super.prototype : null));

    $__Object$defineProperty(SystemLoader.prototype, "constructor", {
      value: SystemLoader
    });

    $__Object$defineProperty(SystemLoader.prototype, "global", {
      get: function() {
        return isBrowser ? window : (isWorker ? self : __global);
      },

      enumerable: false
    });

    $__Object$defineProperty(SystemLoader.prototype, "strict", {
      get: function() { return true; },
      enumerable: false
    });

    $__Object$defineProperty(SystemLoader.prototype, "normalize", {
      value: function(name, parentName, parentAddress) {
        if (typeof name != 'string')
          throw new TypeError('Module name must be a string');

        var segments = name.split('/');

        if (segments.length == 0)
          throw new TypeError('No module name provided');

        // current segment
        var i = 0;
        // is the module name relative
        var rel = false;
        // number of backtracking segments
        var dotdots = 0;
        if (segments[0] == '.') {
          i++;
          if (i == segments.length)
            throw new TypeError('Illegal module name "' + name + '"');
          rel = true;
        }
        else {
          while (segments[i] == '..') {
            i++;
            if (i == segments.length)
              throw new TypeError('Illegal module name "' + name + '"');
          }
          if (i)
            rel = true;
          dotdots = i;
        }

        for (var j = i; j < segments.length; j++) {
          var segment = segments[j];
          if (segment == '' || segment == '.' || segment == '..')
            throw new TypeError('Illegal module name "' + name + '"');
        }

        if (!rel)
          return name;

        // build the full module name
        var normalizedParts = [];
        var parentParts = (parentName || '').split('/');
        var normalizedLen = parentParts.length - 1 - dotdots;

        normalizedParts = normalizedParts.concat(parentParts.splice(0, parentParts.length - 1 - dotdots));
        normalizedParts = normalizedParts.concat(segments.splice(i, segments.length - i));

        return normalizedParts.join('/');
      },

      enumerable: false,
      writable: true
    });

    $__Object$defineProperty(SystemLoader.prototype, "locate", {
      value: function(load) {
        var name = load.name;

        // NB no specification provided for System.paths, used ideas discussed in https://github.com/jorendorff/js-loaders/issues/25

        // most specific (longest) match wins
        var pathMatch = '', wildcard;

        // check to see if we have a paths entry
        for (var p in this.paths) {
          var pathParts = p.split('*');
          if (pathParts.length > 2)
            throw new TypeError('Only one wildcard in a path is permitted');

          // exact path match
          if (pathParts.length == 1) {
            if (name == p && p.length > pathMatch.length) {
              pathMatch = p;
              break;
            }
          }

          // wildcard path match
          else {
            if (name.substr(0, pathParts[0].length) == pathParts[0] && name.substr(name.length - pathParts[1].length) == pathParts[1]) {
              pathMatch = p;
              wildcard = name.substr(pathParts[0].length, name.length - pathParts[1].length - pathParts[0].length);
            }
          }
        }

        var outPath = this.paths[pathMatch];
        if (wildcard)
          outPath = outPath.replace('*', wildcard);

        // percent encode just '#' in module names
        // according to https://github.com/jorendorff/js-loaders/blob/master/browser-loader.js#L238
        // we should encode everything, but it breaks for servers that don't expect it 
        // like in (https://github.com/systemjs/systemjs/issues/168)
        if (isBrowser)
          outPath = outPath.replace(/#/g, '%23');

        return toAbsoluteURL(this.baseURL, outPath);
      },

      enumerable: false,
      writable: true
    });

    $__Object$defineProperty(SystemLoader.prototype, "fetch", {
      value: function(load) {
        var self = this;
        return new Promise(function(resolve, reject) {
          fetchTextFromURL(toAbsoluteURL(self.baseURL, load.address), function(source) {
            resolve(source);
          }, reject);
        });
      },

      enumerable: false,
      writable: true
    });

    return SystemLoader;
  }(__global.LoaderPolyfill);

  var System = new SystemLoader();

  // note we have to export before runing "init" below
  if (typeof exports === 'object')
    module.exports = System;

  __global.System = System;

  // <script type="module"> support
  // allow a data-init function callback once loaded
  if (isBrowser && typeof document.getElementsByTagName != 'undefined') {
    var curScript = document.getElementsByTagName('script');
    curScript = curScript[curScript.length - 1];

    function completed() {
      document.removeEventListener( "DOMContentLoaded", completed, false );
      window.removeEventListener( "load", completed, false );
      ready();
    }

    function ready() {
      var scripts = document.getElementsByTagName('script');
      for (var i = 0; i < scripts.length; i++) {
        var script = scripts[i];
        if (script.type == 'module') {
          var source = script.innerHTML.substr(1);
          System.module(source)['catch'](function(err) { setTimeout(function() { throw err; }); });
        }
      }
    }

    // DOM ready, taken from https://github.com/jquery/jquery/blob/master/src/core/ready.js#L63
    if (document.readyState === 'complete') {
      setTimeout(ready);
    }
    else if (document.addEventListener) {
      document.addEventListener('DOMContentLoaded', completed, false);
      window.addEventListener('load', completed, false);
    }

    // run the data-init function on the script tag
    if (curScript.getAttribute('data-init'))
      window[curScript.getAttribute('data-init')]();
  }
})();


// Define our eval outside of the scope of any other reference defined in this
// file to avoid adding those references to the evaluation scope.
function __eval(__source, __global, load) {
  // Hijack System.register to set declare function
  var __curRegister = System.register;
  System.register = function(name, deps, declare) {
    if (typeof name != 'string') {
      declare = deps;
      deps = name;
    }
    // store the registered declaration as load.declare
    // store the deps as load.deps
    load.declare = declare;
    load.depsList = deps;
  }
  try {
    eval('(function() { var __moduleName = "' + (load.name || '').replace('"', '\"') + '"; ' + __source + ' \n }).call(__global);');
  }
  catch(e) {
    if (e.name == 'SyntaxError' || e.name == 'TypeError')
      e.message = 'Evaluating ' + (load.name || load.address) + '\n\t' + e.message;
    throw e;
  }

  System.register = __curRegister;
}

})(typeof window != 'undefined' ? window : (typeof WorkerGlobalScope != 'undefined' ?
                                           self : global));

/*
 * Instantiate registry extension
 *
 * Supports Traceur System.register 'instantiate' output for loading ES6 as ES5.
 *
 * - Creates the loader.register function
 * - Also supports metadata.format = 'register' in instantiate for anonymous register modules
 * - Also supports metadata.deps, metadata.execute and metadata.executingRequire
 *     for handling dynamic modules alongside register-transformed ES6 modules
 *
 * Works as a standalone extension, but benefits from having a more
 * advanced __eval defined like in SystemJS polyfill-wrapper-end.js
 *
 * The code here replicates the ES6 linking groups algorithm to ensure that
 * circular ES6 compiled into System.register can work alongside circular AMD
 * and CommonJS, identically to the actual ES6 loader.
 *
 */
function register(loader) {
    if (typeof indexOf == 'undefined')
        indexOf = Array.prototype.indexOf;
    if (typeof __eval == 'undefined')
        __eval = 0 || eval; // uglify breaks without the 0 ||

    // define exec for easy evaluation of a load record (load.name, load.source, load.address)
    // main feature is source maps support handling
    var curSystem;
    function exec(load) {
        var loader = this;
        if (load.name == '@traceur') {
            curSystem = System;
        }
        // support sourceMappingURL (efficiently)
        var sourceMappingURL;
        var lastLineIndex = load.source.lastIndexOf('\n');
        if (lastLineIndex != -1) {
            if (load.source.substr(lastLineIndex + 1, 21) == '//# sourceMappingURL=') {
                sourceMappingURL = load.source.substr(lastLineIndex + 22, load.source.length - lastLineIndex - 22);
                if (typeof toAbsoluteURL != 'undefined')
                    sourceMappingURL = toAbsoluteURL(load.address, sourceMappingURL);
            }
        }

        __eval(load.source, load.address, sourceMappingURL);

        // traceur overwrites System and Module - write them back
        if (load.name == '@traceur') {
            loader.global.traceurSystem = loader.global.System;
            loader.global.System = curSystem;
        }
    }
    loader.__exec = exec;

    function dedupe(deps) {
        var newDeps = [];
        for (var i = 0, l = deps.length; i < l; i++)
            if (indexOf.call(newDeps, deps[i]) == -1)
                newDeps.push(deps[i])
        return newDeps;
    }

    /*
     * There are two variations of System.register:
     * 1. System.register for ES6 conversion (2-3 params) - System.register([name, ]deps, declare)
     *    see https://github.com/ModuleLoader/es6-module-loader/wiki/System.register-Explained
     *
     * 2. System.register for dynamic modules (3-4 params) - System.register([name, ]deps, executingRequire, execute)
     * the true or false statement
     *
     * this extension implements the linking algorithm for the two variations identical to the spec
     * allowing compiled ES6 circular references to work alongside AMD and CJS circular references.
     *
     */
    // loader.register sets loader.defined for declarative modules
    var anonRegister;
    var calledRegister;
    function register(name, deps, declare, execute) {
        if (typeof name != 'string') {
            execute = declare;
            declare = deps;
            deps = name;
            name = null;
        }

        calledRegister = true;

        var register;

        // dynamic
        if (typeof declare == 'boolean') {
            register = {
                declarative: false,
                deps: deps,
                execute: execute,
                executingRequire: declare
            };
        }
        else {
            // ES6 declarative
            register = {
                declarative: true,
                deps: deps,
                declare: declare
            };
        }

        // named register
        if (name) {
            register.name = name;
            // we never overwrite an existing define
            if (!loader.defined[name])
                loader.defined[name] = register;
        }
        // anonymous register
        else if (register.declarative) {
            if (anonRegister)
                throw new TypeError('Multiple anonymous System.register calls in the same module file.');
            anonRegister = register;
        }
    }
    /*
     * Registry side table - loader.defined
     * Registry Entry Contains:
     *    - name
     *    - deps
     *    - declare for declarative modules
     *    - execute for dynamic modules, different to declarative execute on module
     *    - executingRequire indicates require drives execution for circularity of dynamic modules
     *    - declarative optional boolean indicating which of the above
     *
     * Can preload modules directly on System.defined['my/module'] = { deps, execute, executingRequire }
     *
     * Then the entry gets populated with derived information during processing:
     *    - normalizedDeps derived from deps, created in instantiate
     *    - groupIndex used by group linking algorithm
     *    - evaluated indicating whether evaluation has happend
     *    - module the module record object, containing:
     *      - exports actual module exports
     *
     *    Then for declarative only we track dynamic bindings with the records:
     *      - name
     *      - setters declarative setter functions
     *      - exports actual module values
     *      - dependencies, module records of dependencies
     *      - importers, module records of dependents
     *
     * After linked and evaluated, entries are removed, declarative module records remain in separate
     * module binding table
     *
     */

    function defineRegister(loader) {
        if (loader.register)
            return;

        loader.register = register;

        if (!loader.defined)
            loader.defined = {};

        // script injection mode calls this function synchronously on load
        var onScriptLoad = loader.onScriptLoad;
        loader.onScriptLoad = function(load) {
            onScriptLoad(load);
            // anonymous define
            if (anonRegister)
                load.metadata.entry = anonRegister;

            if (calledRegister) {
                load.metadata.format = load.metadata.format || 'register';
                load.metadata.registered = true;
            }
        }
    }

    defineRegister(loader);

    function buildGroups(entry, loader, groups) {
        groups[entry.groupIndex] = groups[entry.groupIndex] || [];

        if (indexOf.call(groups[entry.groupIndex], entry) != -1)
            return;

        groups[entry.groupIndex].push(entry);

        for (var i = 0, l = entry.normalizedDeps.length; i < l; i++) {
            var depName = entry.normalizedDeps[i];
            var depEntry = loader.defined[depName];

            // not in the registry means already linked / ES6
            if (!depEntry || depEntry.evaluated)
                continue;

            // now we know the entry is in our unlinked linkage group
            var depGroupIndex = entry.groupIndex + (depEntry.declarative != entry.declarative);

            // the group index of an entry is always the maximum
            if (depEntry.groupIndex === undefined || depEntry.groupIndex < depGroupIndex) {

                // if already in a group, remove from the old group
                if (depEntry.groupIndex) {
                    groups[depEntry.groupIndex].splice(indexOf.call(groups[depEntry.groupIndex], depEntry), 1);

                    // if the old group is empty, then we have a mixed depndency cycle
                    if (groups[depEntry.groupIndex].length == 0)
                        throw new TypeError("Mixed dependency cycle detected");
                }

                depEntry.groupIndex = depGroupIndex;
            }

            buildGroups(depEntry, loader, groups);
        }
    }

    function link(name, loader) {
        var startEntry = loader.defined[name];

        startEntry.groupIndex = 0;

        var groups = [];

        buildGroups(startEntry, loader, groups);

        var curGroupDeclarative = !!startEntry.declarative == groups.length % 2;
        for (var i = groups.length - 1; i >= 0; i--) {
            var group = groups[i];
            for (var j = 0; j < group.length; j++) {
                var entry = group[j];

                // link each group
                if (curGroupDeclarative)
                    linkDeclarativeModule(entry, loader);
                else
                    linkDynamicModule(entry, loader);
            }
            curGroupDeclarative = !curGroupDeclarative;
        }
    }

    // module binding records
    var moduleRecords = {};
    function getOrCreateModuleRecord(name) {
        return moduleRecords[name] || (moduleRecords[name] = {
                name: name,
                dependencies: [],
                exports: {}, // start from an empty module and extend
                importers: []
            })
    }

    function linkDeclarativeModule(entry, loader) {
        // only link if already not already started linking (stops at circular)
        if (entry.module)
            return;

        var module = entry.module = getOrCreateModuleRecord(entry.name);
        var exports = entry.module.exports;

        var declaration = entry.declare.call(loader.global, function(name, value) {
            module.locked = true;
            exports[name] = value;

            for (var i = 0, l = module.importers.length; i < l; i++) {
                var importerModule = module.importers[i];
                if (!importerModule.locked) {
                    var importerIndex = indexOf.call(importerModule.dependencies, module);
                    importerModule.setters[importerIndex](exports);
                }
            }

            module.locked = false;
            return value;
        });

        module.setters = declaration.setters;
        module.execute = declaration.execute;

        if (!module.setters || !module.execute) {
            throw new TypeError('Invalid System.register form for ' + entry.name);
        }

        // now link all the module dependencies
        for (var i = 0, l = entry.normalizedDeps.length; i < l; i++) {
            var depName = entry.normalizedDeps[i];
            var depEntry = loader.defined[depName];
            var depModule = moduleRecords[depName];

            // work out how to set depExports based on scenarios...
            var depExports;

            if (depModule) {
                depExports = depModule.exports;
            }
            // dynamic, already linked in our registry
            else if (depEntry && !depEntry.declarative) {
                depExports = { 'default': depEntry.module.exports, '__useDefault': true };
            }
            // in the loader registry
            else if (!depEntry) {
                depExports = loader.get(depName);
            }
            // we have an entry -> link
            else {
                linkDeclarativeModule(depEntry, loader);
                depModule = depEntry.module;
                depExports = depModule.exports;
            }

            // only declarative modules have dynamic bindings
            if (depModule && depModule.importers) {
                depModule.importers.push(module);
                module.dependencies.push(depModule);
            }
            else {
                module.dependencies.push(null);
            }

            // run the setter for this dependency
            if (module.setters[i])
                module.setters[i](depExports);
        }
    }

    // An analog to loader.get covering execution of all three layers (real declarative, simulated declarative, simulated dynamic)
    function getModule(name, loader) {
        var exports;
        var entry = loader.defined[name];

        if (!entry) {
            exports = loader.get(name);
            if (!exports)
                throw new Error('Unable to load dependency ' + name + '.');
        }

        else {
            if (entry.declarative)
                ensureEvaluated(name, [], loader);

            else if (!entry.evaluated)
                linkDynamicModule(entry, loader);

            exports = entry.module.exports;
        }

        if ((!entry || entry.declarative) && exports && exports.__useDefault)
            return exports['default'];

        return exports;
    }

    function linkDynamicModule(entry, loader) {
        if (entry.module)
            return;

        var exports = {};

        var module = entry.module = { exports: exports, id: entry.name };

        // AMD requires execute the tree first
        if (!entry.executingRequire) {
            for (var i = 0, l = entry.normalizedDeps.length; i < l; i++) {
                var depName = entry.normalizedDeps[i];
                var depEntry = loader.defined[depName];
                if (depEntry)
                    linkDynamicModule(depEntry, loader);
            }
        }

        // now execute
        entry.evaluated = true;
        var output = entry.execute.call(loader.global, function(name) {
            for (var i = 0, l = entry.deps.length; i < l; i++) {
                if (entry.deps[i] != name)
                    continue;
                return getModule(entry.normalizedDeps[i], loader);
            }
            throw new TypeError('Module ' + name + ' not declared as a dependency.');
        }, exports, module);

        if (output)
            module.exports = output;
    }

    /*
     * Given a module, and the list of modules for this current branch,
     *  ensure that each of the dependencies of this module is evaluated
     *  (unless one is a circular dependency already in the list of seen
     *  modules, in which case we execute it)
     *
     * Then we evaluate the module itself depth-first left to right
     * execution to match ES6 modules
     */
    function ensureEvaluated(moduleName, seen, loader) {
        var entry = loader.defined[moduleName];

        // if already seen, that means it's an already-evaluated non circular dependency
        if (entry.evaluated || !entry.declarative)
            return;

        // this only applies to declarative modules which late-execute

        seen.push(moduleName);

        for (var i = 0, l = entry.normalizedDeps.length; i < l; i++) {
            var depName = entry.normalizedDeps[i];
            if (indexOf.call(seen, depName) == -1) {
                if (!loader.defined[depName])
                    loader.get(depName);
                else
                    ensureEvaluated(depName, seen, loader);
            }
        }

        if (entry.evaluated)
            return;

        entry.evaluated = true;
        entry.module.execute.call(loader.global);
    }

    var registerRegEx = /System\.register/;

    var loaderFetch = loader.fetch;
    loader.fetch = function(load) {
        var loader = this;
        defineRegister(loader);
        if (loader.defined[load.name]) {
            load.metadata.format = 'defined';
            return '';
        }
        anonRegister = null;
        calledRegister = false;
        // the above get picked up by onScriptLoad
        return loaderFetch.call(loader, load);
    }

    var loaderTranslate = loader.translate;
    loader.translate = function(load) {
        this.register = register;

        this.__exec = exec;

        load.metadata.deps = load.metadata.deps || [];

        // we run the meta detection here (register is after meta)
        return Promise.resolve(loaderTranslate.call(this, load)).then(function(source) {

            // dont run format detection for globals shimmed
            // ideally this should be in the global extension, but there is
            // currently no neat way to separate it
            if (load.metadata.init || load.metadata.exports)
                load.metadata.format = load.metadata.format || 'global';

            // run detection for register format
            if (load.metadata.format == 'register' || !load.metadata.format && load.source.match(registerRegEx))
                load.metadata.format = 'register';
            return source;
        });
    }


    var loaderInstantiate = loader.instantiate;
    loader.instantiate = function(load) {
        var loader = this;

        var entry;

        // first we check if this module has already been defined in the registry
        if (loader.defined[load.name]) {
            entry = loader.defined[load.name];
            entry.deps = entry.deps.concat(load.metadata.deps);
        }

        // picked up already by a script injection
        else if (load.metadata.entry)
            entry = load.metadata.entry;

        // otherwise check if it is dynamic
        else if (load.metadata.execute) {
            entry = {
                declarative: false,
                deps: load.metadata.deps || [],
                execute: load.metadata.execute,
                executingRequire: load.metadata.executingRequire // NodeJS-style requires or not
            };
        }

        // Contains System.register calls
        else if (load.metadata.format == 'register') {
            anonRegister = null;
            calledRegister = false;

            var System = loader.global.System = loader.global.System || loader;

            var curRegister = System.register;
            System.register = register;

            loader.__exec(load);

            System.register = curRegister;

            if (anonRegister)
                entry = anonRegister;

            if (!entry && System.defined[load.name])
                entry = System.defined[load.name];

            if (!calledRegister && !load.metadata.registered)
                throw new TypeError(load.name + ' detected as System.register but didn\'t execute.');
        }

        // named bundles are just an empty module
        if (!entry && load.metadata.format != 'es6')
            return {
                deps: [],
                execute: function() {
                    return loader.newModule({});
                }
            };

        // place this module onto defined for circular references
        if (entry)
            loader.defined[load.name] = entry;

        // no entry -> treat as ES6
        else
            return loaderInstantiate.call(this, load);

        entry.deps = dedupe(entry.deps);
        entry.name = load.name;

        // first, normalize all dependencies
        var normalizePromises = [];
        for (var i = 0, l = entry.deps.length; i < l; i++)
            normalizePromises.push(Promise.resolve(loader.normalize(entry.deps[i], load.name)));

        return Promise.all(normalizePromises).then(function(normalizedDeps) {

            entry.normalizedDeps = normalizedDeps;

            return {
                deps: entry.deps,
                execute: function() {
                    // recursively ensure that the module and all its
                    // dependencies are linked (with dependency group handling)
                    link(load.name, loader);

                    // now handle dependency execution in correct order
                    ensureEvaluated(load.name, [], loader);

                    // remove from the registry
                    loader.defined[load.name] = undefined;

                    var module = loader.newModule(entry.declarative ? entry.module.exports : { 'default': entry.module.exports, '__useDefault': true });

                    // return the defined module object
                    return module;
                }
            };
        });
    }
}
register(System);
System.register("assert.js", [], function($__export) {
  "use strict";
  var __moduleName = "assert.js";
  var POSITION_NAME,
      primitives,
      string,
      boolean,
      number,
      currentStack;
  function argPositionName(i) {
    var position = (i / 2) + 1;
    return POSITION_NAME[position] || (position + 'th');
  }
  function assertArgumentTypes() {
    for (var params = [],
        $__2 = 0; $__2 < arguments.length; $__2++)
      params[$__2] = arguments[$__2];
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
      if (value.map) {
        return '[' + value.map(prettyPrint).join(', ') + ']';
      }
      var properties = Object.keys(value);
      return '{' + properties.map((function(p) {
        return p + ': ' + prettyPrint(value[p]);
      })).join(', ') + '}';
    }
    return value.__;
    Name || value.name || value.toString();
  }
  function isType(value, T, errors) {
    if (T === primitives.void) {
      return typeof value === 'undefined';
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
        $__3 = 0; $__3 < arguments.length; $__3++)
      types[$__3] = arguments[$__3];
    return assert.define('array of ' + types.map(prettyPrint).join('/'), function(value) {
      var $__5;
      if (assert(value).is(Array)) {
        for (var $__0 = value[$traceurRuntime.toProperty(Symbol.iterator)](),
            $__1; !($__1 = $__0.next()).done; ) {
          var item = $__1.value;
          {
            ($__5 = assert(item)).is.apply($__5, $traceurRuntime.spread(types));
          }
        }
      }
    });
  }
  function structure(definition) {
    var properties = Object.keys(definition);
    return assert.define('object with properties ' + properties.join(', '), function(value) {
      if (assert(value).is(Object)) {
        for (var $__0 = properties[$traceurRuntime.toProperty(Symbol.iterator)](),
            $__1; !($__1 = $__0.next()).done; ) {
          var property = $__1.value;
          {
            assert(value[property]).is(definition[property]);
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
        var $__5;
        for (var types = [],
            $__4 = 0; $__4 < arguments.length; $__4++)
          types[$__4] = arguments[$__4];
        var allErrors = [];
        var errors;
        for (var $__0 = types[$traceurRuntime.toProperty(Symbol.iterator)](),
            $__1; !($__1 = $__0.next()).done; ) {
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
        ($__5 = currentStack).push.apply($__5, $traceurRuntime.spread(allErrors));
        return false;
      }};
  }
  return {
    setters: [],
    execute: function() {
      POSITION_NAME = ['', '1st', '2nd', '3rd'];
      primitives = $traceurRuntime.type;
      string = define('string', function(value) {
        return typeof value === 'string';
      });
      boolean = define('boolean', function(value) {
        return typeof value === 'boolean';
      });
      number = define('number', function(value) {
        return typeof value === 'number';
      });
      currentStack = [];
      assert.type = type;
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
//# sourceURL=assert.js
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