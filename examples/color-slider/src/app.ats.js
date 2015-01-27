import {bootstrap} from 'angular/angular.js';
import BaseComponent from 'components/base/baseComponent.js';

export function main() {
    bootstrap(BaseComponent, {moduleName: 'colorSlider'});
}
