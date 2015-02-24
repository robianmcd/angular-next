import {bootstrap, Component, Template} from 'angular2/angular2.js';

@Component({
    selector: 'hello-component'
})
@Template({
    inline: '<h1>{{ctrl.message}}</h1>'
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