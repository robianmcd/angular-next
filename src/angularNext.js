//See here for detailed annotation implimentations https://github.com/angular/angular/tree/master/modules/core/src/annotations
class Directive {
    constructor(options) {
        this.selector = options.selector;
    }
}

//Like a panel
class Component extends Directive {
    constructor(options) {
        super({selector: options.selector});

        this.template = options.template;
        this.templateUrl = options.templateUrl;
        this.controllerAs = options.controllerAs;
    }
}

//A transclude directive like ng-if or ng-show
class Template extends Directive {
    constructor(options) {
        super({selector: options.selector});
    }
}

//Like ng-class, ng-show
class Decorator extends Directive {
    constructor(options) {
        super({selector: options.selector});
    }
}

(function(){
    var app = angular.module('angularNext', []);

    app.config(function ($compileProvider) {
        for(var key in window) {
            if (window[key] && window[key].annotations) {
                var annotations = window[key].annotations;
                for (var i = 0; i < annotations.length; i++) {
                    if (annotations[i] instanceof Directive) {
                        registerDirective($compileProvider, annotations[i], window[key]);
                    }
                }

            }
        }

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
        var camelDirectiveName = dashesDirectiveName.replace(/-([a-z])/g, char => char[1].toUpperCase() );

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