import {Directive, DirectiveClass} from 'ng2/directive.js';
import {Component, ComponentClass} from 'ng2/component.js';
import {NgElement} from 'ng2/ngElement.js';
import {InjectNgOne} from 'ngNext/injectNgOne.js';

class Angular2Adapter {
    constructor({moduleName, logLevel = 0}) {
        this.moduleName = moduleName;
        this.app = angular.module(moduleName);
        //not currently used
        this.logLevel = logLevel;

        this.registeredDirectives = new Set();
    }

    bootstrapComponent(rootComponent:ComponentClass) {
        var rootComponentAnno:Component;
        rootComponentAnno = this.getDirAnno(rootComponent);

        var rootElement = document.querySelector(rootComponentAnno.selector);

        angular.element(rootElement).ready(() => {
            this.registerDirectiveTree(rootComponent);
            angular.bootstrap(rootElement, [this.moduleName]);
        });
    }

    registerDirectiveTree(dir:DirectiveClass) {
        if(this.registeredDirectives.has(dir)) {
            return;
        } else {
            this.registeredDirectives.add(dir);
        }

        var dirAnno = this.getDirAnno(dir);

        this.registerDirective(dir);

        if (dirAnno.template && dirAnno.template.directives) {
            dirAnno.template.directives.forEach((childDir) => {
                this.registerDirectiveTree(childDir);
            });
        }
    }

    registerDirective(dir:DirectiveClass) {
        dir = this.wrapDir(dir);
        this.setupModelDi(dir);

        var dirAnno = this.getDirAnno(dir);

        //Register component services
        if (dirAnno.componentServices) {
            dirAnno.componentServices.forEach((serviceType) => {
                this.setupModelDi(serviceType);
                this.app.service(this.lowerCaseFirstLetter(this.getFunctionName(serviceType)), serviceType);
            });
        }

        var restrict;
        var dashesDirectiveName;

        //Try and match an attribute selector. e.g. "[attr]"
        //If it matches store the attribute name in match[1]
        var match;
        if (match = dirAnno.selector.match(/^\[(.*)\]$/)) {
            restrict = 'A';
            dashesDirectiveName = match[1];

            //Try to match a class selector. e.g. ".class"
        } else if (match = dirAnno.selector.match(/^\.(.*)$/)) {
            restrict = 'C';
            dashesDirectiveName = match[1];

        } else {
            restrict = 'E';
            dashesDirectiveName = dirAnno.selector;
        }

        //Convert the directive name from dash separated to camelCase
        var camelDirectiveName = dashesDirectiveName.replace(/-([a-z])/g, char => char[1].toUpperCase());

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

        if(dirAnno.template) {
            if(dirAnno.template.inline) {
                ddo.template = dirAnno.template.inline;
            } else if (dirAnno.template.url) {
                ddo.templateUrl = dirAnno.template.url;
            }
        }

        this.app.directive(camelDirectiveName, function () {
            return ddo;
        });
    }

    //Services that require $element (e.g. NgElement) cannot be injected normally as $element can only be injected
    //directly into the controller of a directive. If the directive passed in requires any of these services then it
    //will be wrapped (inherited) by a function that injects $element and manually initialized the $element based
    //services before passing them in.
    wrapDir(dirType:DirectiveClass) {
        var adapter = this;

        var dirAnno = this.getDirAnno(dirType);

        var retDirType = dirType;

        if (dirType.parameters) {
            var injectableServices = [];

            //e.g. {pos: 3, type: MyDir}
            var uninjectableParams = [];
            var requiresElement = false;
            var requiresScope = false;

            for (var i = 0; i < dirType.parameters.length; i++) {
                var curParamType = dirType.parameters[i][0];

                //TODO: should check if they are already injecting $element or $scope so we don't end up injecting it twice

                if (curParamType === NgElement || this.isDirClass(curParamType)) {
                    uninjectableParams.push({pos: i, type: curParamType});
                    requiresElement = true;
                } else {
                    injectableServices.push(curParamType);
                }
            }

            if (dirAnno.observe) {
                requiresScope = true;
            }


            //If the directive needs to be wrapped
            if (uninjectableParams.length || requiresElement || requiresScope) {

                retDirType = function (...args) {
                    var element, scope;

                    if (requiresScope) {
                        scope = args.pop();
                    }

                    if (requiresElement) {
                        element = args.pop();
                    }

                    var origDirParams = angular.copy(args);

                    //Manually create each parameter that could not be injected
                    uninjectableParams.forEach((param) => {
                        var model;
                        if (param.type === NgElement) {
                            model = new NgElement(element);
                        } else if (adapter.isDirClass(param.type)) {
                            var dirName = adapter.lowerCaseFirstLetter(adapter.getFunctionName(param.type));
                            model = element.inheritedData(`$${dirName}Controller`);
                        }
                        origDirParams.splice(param.pos, 0, model);
                    });

                    //Setup any watches specified in dirAnno.observe
                    if (dirAnno.observe) {
                        for (let key in dirAnno.observe) {
                            if (dirAnno.observe.hasOwnProperty(key)) {
                                let functionName = dirAnno.observe[key];

                                scope.$watch(`${dirAnno.controllerAs}.${key}`, (newValue, oldValue) => {
                                    if (this[functionName]) {
                                        this[functionName](newValue, oldValue);
                                    } else {
                                        console.warn(`'${key}' has changed but observe function, '${functionName}' does not exist.`);
                                    }
                                });
                            }
                        }
                    }

                    //Steal constructor
                    dirType.apply(this, origDirParams);
                };

                //Inherit prototype
                retDirType.prototype = Object.create(dirType.prototype);
                retDirType.annotations = dirType.annotations;
                retDirType.parameters = injectableServices.map(type => [type]);

                if (requiresElement) {
                    retDirType.parameters.push([new InjectNgOne('$element')]);
                }
                if (requiresScope) {
                    retDirType.parameters.push([new InjectNgOne('$scope')]);
                }
            }
        }

        return retDirType;
    }

    setupModelDi(aClass:Object) {
        if (aClass.parameters) {
            aClass.$inject = [];
            aClass.parameters.forEach((paramAnnotations) => {
                aClass.$inject.push(this.getInjectStrFromParamAnnotations(paramAnnotations));
            });
        }
    }

    getInjectStrFromParamAnnotations(paramAnnotations) {
        for (var i = 0; i < paramAnnotations.length; i++) {
            var paramAnno = paramAnnotations[i];

            if (paramAnno instanceof InjectNgOne) {
                return paramAnno.typeStr;
            } else if (paramAnno instanceof Function) {
                return this.lowerCaseFirstLetter(this.getFunctionName(paramAnno));
            }
        }

        if(paramAnnotations.length === 0) {
            throw `Could not inject parameter. You must either specify its type or annotate it with @InjectNgOne('...').`;
        } else {
            throw `Could not determine how to inject parameter with annotations: ${paramAnnotations}`;
        }

    }

    getDirAnno(directive:DirectiveClass) {
        var dirAnnos = directive.annotations.filter((annotation) => annotation instanceof Directive);

        return dirAnnos.length ? dirAnnos[0] : undefined;
    }

    lowerCaseFirstLetter(str) {
        return str.charAt(0).toLowerCase() + str.slice(1);
    }

    getFunctionName(func:Function) {
        if (func.name) {
            return func.name;

            //IE doesn't support function.name and neither does traceur.
        } else {
            var ret = func.toString();
            ret = ret.substr('function '.length);
            ret = ret.substr(0, ret.indexOf('('));
            return ret;
        }
    }

    isDirClass(obj) {
        return !!(obj.annotations && obj.annotations.filter(anno => anno instanceof Directive).length);
    }

}

export {Angular2Adapter};