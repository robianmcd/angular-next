import {bootstrap, Component, TemplateConfig} from 'angular2/angular2';

@Component({
    selector: 'hello-component',
    template: new TemplateConfig({
        inline: '<h1>{{ctrl.message}}</h1>'
    })
})
class HelloComponent {
    constructor() {
        this.message = 'Hello jspm';
    }
}

export function main() {
    angular.module('myApp', []);

    bootstrap(HelloComponent, {moduleName: 'myApp'});
}