import bootstrap from 'bootstrap';
import BaseComponent from 'baseComponent';

export function main() {
    angular.module('colorSlider', ['ngMaterial']);

    bootstrap(BaseComponent, {moduleName: 'colorSlider'});
}