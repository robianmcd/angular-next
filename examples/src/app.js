import bootstrap from './bootstrap';
import HelloComponent from './helloComponent';

export function main() {
    var app = angular.module('myApp', []);

    bootstrap(HelloComponent, {moduleName: 'myApp'});
}
