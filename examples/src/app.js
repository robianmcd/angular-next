import HelloComponent from './helloComponent';

var app = angular.module('myApp', []);

bootstrap(HelloComponent, {moduleName: 'myApp'});