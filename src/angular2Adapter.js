import Directive from './directive';
import Component from './component';

export default
class Angular2Adapter {
    constructor({moduleName, logLevel = 0}) {
        this.moduleName = moduleName;
        this.app = angular.module(moduleName);
        //not currently used
        this.logLevel = logLevel;
    }

    bootstrapComponent(rootComponent) {
        var rootComponentAnno = this.getDirAnno(rootComponent);

        var rootElement = document.querySelector(rootComponentAnno.selector);

        angular.element(rootElement).ready(() => {
            this.registerDirectiveTree(rootComponent);
            angular.bootstrap(rootElement, [this.moduleName]);
        });
    }

    registerDirectiveTree(dir) {
        var dirAnno = this.getDirAnno(dir);

        this.registerDirective(dir, dirAnno);

        if (dirAnno.template.directives) {
            dirAnno.template.directives.forEach((childDir) => {
                this.registerDirectiveTree(childDir);
            });
        }
    }

    registerDirective(dir, dirAnno) {
        //Register component services
        if (dirAnno.componentServices) {
            dirAnno.componentServices.forEach((serviceType) => {
                this.setupDi(serviceType);
                this.app.service(this.lowerCaseFirstLetter(this.getFunctionName(serviceType)), serviceType);
            });
        }
        this.setupDi(dir);

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

        this.app.directive(camelDirectiveName, function () {
            return {
                restrict: restrict,
                template: dirAnno.template.inline,
                controller: dir,
                controllerAs: dirAnno.controllerAs,
                scope: {}
            }
        });
    }

    setupDi(aClass) {
        if (aClass.parameters) {
            aClass.$inject = [];
            aClass.parameters.forEach((serviceType) => {
                aClass.$inject.push(this.lowerCaseFirstLetter(this.getFunctionName(serviceType)));
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

}
