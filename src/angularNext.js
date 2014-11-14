import Directive from './directive';
import Component from './component';

var directives = [];

angular.register = function (directive) {
    directives.push(directive);
};

(function () {
    var app = angular.module('angularNext', []);
    app.config(function ($compileProvider) {
        directives.forEach((directive) => {
            if (directive.annotations) {
                var annotations = directive.annotations;
                for (var i = 0; i < annotations.length; i++) {
                    if (annotations[i] instanceof Directive) {
                        registerDirective($compileProvider, annotations[i], directive);
                    }
                }

            }
        });

    });

    var registerDirective = function ($compileProvider, directiveAnnotation, directiveClass) {
        var restrict;
        var dashesDirectiveName;


        //Try and match an attribute selector. e.g. "[attr]"
        //If it matches store the attribute name in match[1]
        var match;
        if (match = directiveAnnotation.selector.match(/^\[(.*)\]$/)) {
            restrict = 'A';
            dashesDirectiveName = match[1];

            //Try to match a class selector. e.g. ".class"
        } else if (match = directiveAnnotation.selector.match(/^\.(.*)$/)) {
            restrict = 'C';
            dashesDirectiveName = match[1];
        } else {
            restrict = 'E';
            dashesDirectiveName = directiveAnnotation.selector;
        }

        //Convert the directive name from dash separated to camelCase
        var camelDirectiveName = dashesDirectiveName.replace(/-([a-z])/g, char => char[1].toUpperCase());

        $compileProvider.directive(camelDirectiveName, function () {
            return {
                restrict: restrict,
                template: directiveAnnotation.template,
                controller: directiveClass,
                controllerAs: directiveAnnotation.controllerAs
            }
        });
    };
})();