import {bootstrap} from 'angular2/angular2.js';
import BaseComponent from 'components/base/baseComponent.js';

export function main() {
    bootstrap(BaseComponent, {moduleName: 'colorSlider'});
}
