import {bootstrap, Component, TemplateConfig} from 'core/core';

@Component({
    selector: 'hello-component',
    template: new TemplateConfig({
        inline: '<h1>{{ctrl.message}}</h1>'
    })
})
class HelloComponent {
    constructor() {
        this.message = 'Hello World';
    }
}

export function main() {
    angular.module('myApp', []);

    bootstrap(HelloComponent, {moduleName: 'myApp'});
}