import {bootstrap} from 'angular2/angular2.js';
import HelloComponent from 'helloComponent.js';

export function main() {
    var app = angular.module('myApp', []);

    bootstrap(HelloComponent, {moduleName: 'myApp'});
}
