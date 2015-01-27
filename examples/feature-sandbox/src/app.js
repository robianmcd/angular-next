import {bootstrap} from 'angular/angular.js';
import HelloComponent from 'helloComponent.js';

export function main() {
    var app = angular.module('myApp', []);

    bootstrap(HelloComponent, {moduleName: 'myApp'});
}
