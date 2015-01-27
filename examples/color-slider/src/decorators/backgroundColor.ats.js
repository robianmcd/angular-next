import {Decorator, NgElement} from 'angular/angular.js';

@Decorator({
    selector: '[background-color]',
    bind: {backgroundColor: 'backgroundColor'},
    observe: {backgroundColor: 'onColorChange'}
})
class BackgroundColor {
    constructor(el:NgElement) {
        this.element = el;
        this.onColorChange(this.backgroundColor);
    }

    onColorChange(newValue) {
        this.element.domElement.style['background-color'] = newValue;
    }
}

export default BackgroundColor;
