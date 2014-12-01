import Directive from './directive';
import Component from './component';

var rootDir;
var app;

window.bootstrap = (component, moduleName) => {
    rootDir = component;
    app = angular.module(moduleName);
    var rootDirAnno = getDirAnno(rootDir);

    var rootElement = document.querySelector(rootDirAnno.selector);

    angular.element(rootElement).ready(function () {
        walkDependencies(rootDir);
        angular.bootstrap(rootElement, [moduleName]);
    });
};

var getDirAnno = function (directive) {
    var dirAnnos = directive.annotations.filter((annotation) => annotation instanceof Directive);

    return dirAnnos.length ? dirAnnos[0] : undefined;
};

var lowerCaseFirstLetter = function (str) {
    return str.charAt(0).toLowerCase() + str.slice(1);
};

var getFunctionName = function (func) {
    if (func.name) {
        return func.name;

        //IE doesn't support function.name and neither does traceur.
    } else {
        var ret = func.toString();
        ret = ret.substr('function '.length);
        ret = ret.substr(0, ret.indexOf('('));
        return ret;
    }
};

var walkDependencies = function (dir) {
    var dirAnno = getDirAnno(dir);

    registerDirective(dir, dirAnno);


    if (dirAnno.componentServices) {
        dirAnno.componentServices.forEach((serviceType) => {
            //This doesn't work in IE
            app.service(lowerCaseFirstLetter(getFunctionName(serviceType)), serviceType);
        });
    }

    if (dir.parameters) {
        dir.$inject = [];
        dir.parameters.forEach((serviceType) => {
            dir.$inject.push(lowerCaseFirstLetter(getFunctionName(serviceType)));
        });
    }

    if (dirAnno.directives) {
        dirAnno.directives.forEach((childDir) => {
            walkDependencies(childDir);
        });
    }
};

var registerDirective = function (dir, dirAnno) {
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


    app.directive(camelDirectiveName, function () {
        return {
            restrict: restrict,
            template: dirAnno.template,
            controller: dir,
            controllerAs: dirAnno.controllerAs,
            scope: {}
        }
    });
};