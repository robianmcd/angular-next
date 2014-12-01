import Directive from './directive';
import Component from './component';

var rootDir;

window.bootstrap = (component, moduleName) => {
    rootDir = component;
    var rootDirAnno = getDirAnno(rootDir);

    var rootElement = document.querySelector(rootDirAnno.selector);

    angular.element(rootElement).ready(function () {
        angular.bootstrap(rootElement, [moduleName]);
    });
};

var getDirAnno = function (directive) {
    var dirAnnos = directive.annotations.filter((annotation) => annotation instanceof Directive);

    return dirAnnos.length ? dirAnnos[0] : undefined;
};

var app = angular.module('angularNext', []);
app.config(function ($compileProvider) {
    walkDependencies(rootDir, $compileProvider);
});

var walkDependencies = function (dir, $compileProvider) {
    var dirAnno = getDirAnno(dir);

    registerDirective($compileProvider, dirAnno, dir);

    if (dirAnno.directives) {
        dirAnno.directives.forEach((childDir) => {
            walkDependencies(childDir, $compileProvider);
        });
    }

};

var registerDirective = function ($compileProvider, dirAnno, dir) {
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


    $compileProvider.directive(camelDirectiveName, function () {
        return {
            restrict: restrict,
            template: dirAnno.template,
            controller: dir,
            controllerAs: dirAnno.controllerAs,
            scope: {}
        }
    });
};