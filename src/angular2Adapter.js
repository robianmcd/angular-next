import Directive from './directive';
import Component from './component';
import NgElement from './core/ngElement'
import $element from './ng1/element'

class Angular2Adapter {
    constructor({moduleName, logLevel = 0}) {
        this.moduleName = moduleName;
        this.app = angular.module(moduleName);
        //not currently used
        this.logLevel = logLevel;
    }

    bootstrapComponent(rootComponent: Object) {
        var rootComponentAnno: Component;
        rootComponentAnno = this.getDirAnno(rootComponent);

        var rootElement = document.querySelector(rootComponentAnno.selector);

        angular.element(rootElement).ready(() => {
            this.registerDirectiveTree(rootComponent);
            angular.bootstrap(rootElement, [this.moduleName]);
        });
    }

    registerDirectiveTree(dir) {
        var dirAnno = this.getDirAnno(dir);

        this.registerDirective(dir);

        if (dirAnno.template && dirAnno.template.directives) {
            dirAnno.template.directives.forEach((childDir) => {
                this.registerDirectiveTree(childDir);
            });
        }
    }

    registerDirective(dir) {
        dir = this.getDirWithInjectableServices(dir);
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
            controllerAs: dirAnno.controllerAs || 'ctrl',
            scope: scope,
            bindToController: true
        };

        if (dirAnno.template && dirAnno.template.inline) {
            ddo.template = dirAnno.template.inline;
        }

        this.app.directive(camelDirectiveName, function () {
            return ddo;
        });
    }

    //Services that require $element (e.g. NgElement) cannot be injected normally as $element can only be injected
    //directly into the controller of a directive. If the directive passed in requires any of these services then it
    //will be wrapped (inherited) by a function that injects $element and manually initialized the $element based
    //services before passing them in.
    getDirWithInjectableServices(dirType) {
        var adapter = this;

        var retDirType = dirType;

        if (dirType.parameters) {
            var injectableServices = [];

            //e.g. {pos: 3, type: MyDir}
            var nonInjectableParams = [];


            for (var i = 0; i < dirType.parameters.length; i++) {
                var curParamType = dirType.parameters[i][0];

                if (curParamType === NgElement || this.isDirClass(curParamType)) {
                    nonInjectableParams.push({pos: i, type: curParamType});
                } else {
                    injectableServices.push(curParamType);
                }
            }


            if (nonInjectableParams.length) {

                retDirType = function (element, ...args) {
                    var origDirParams = angular.copy(args);

                    nonInjectableParams.forEach((param) => {
                        var model;
                        if(param.type === NgElement) {
                            model = new NgElement(element);
                        } else if (adapter.isDirClass(param.type)) {
                            var dirName = adapter.lowerCaseFirstLetter(adapter.getFunctionName(param.type));
                            model = element.inheritedData(`$${dirName}Controller`);
                        }
                        origDirParams.splice(param.pos, 0, model);
                    });

                    //Steal constructor
                    dirType.apply(this, origDirParams);
                };

                //Inherit prototype
                retDirType.prototype = Object.create(dirType.prototype);
                retDirType.annotations = dirType.annotations;
                retDirType.parameters = [[$element], ...injectableServices.map(type => [type])];
            }
        }

        return retDirType;
    }

    setupModelDi(aClass) {
        if (aClass.parameters) {
            aClass.$inject = [];
            aClass.parameters.forEach((serviceType) => {
                aClass.$inject.push(this.lowerCaseFirstLetter(this.getFunctionName(serviceType[0])));
            });
        }
    }

    getDirAnno(directive) {
        var dirAnnos = directive.annotations.filter((annotation) => annotation instanceof Directive);

        return dirAnnos.length ? dirAnnos[0] : undefined;
    }

    lowerCaseFirstLetter(str) {
        return str.charAt(0).toLowerCase() + str.slice(1);
    }

    getFunctionName(func) {
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
        return obj.annotations && obj.annotations.filter(anno => anno instanceof Directive).length;
    }

}

export default Angular2Adapter;