import bootstrap from 'bootstrap';
import {Component} from 'component';
import TemplateConfig from 'templateConfig';


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