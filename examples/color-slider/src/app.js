import bootstrap from 'bootstrap';
import {Component} from 'component';
import TemplateConfig from 'templateConfig';

@Component({
    selector: 'base-component',
    template: new TemplateConfig({
        url: 'base.html'
    })
})
class BaseComponent {
    constructor() {

    }
}

export function main() {
    angular.module('colorSlider', []);

    bootstrap(BaseComponent, {moduleName: 'colorSlider'});
}