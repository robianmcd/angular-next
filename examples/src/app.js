import bootstrap from './bootstrap';
import HelloComponent from './helloComponent';

export default function main() {
    var app = angular.module('myApp', []);

    bootstrap(HelloComponent, {moduleName: 'myApp'});
}
