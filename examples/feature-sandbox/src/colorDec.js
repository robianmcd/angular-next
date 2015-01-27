import {Decorator, NgElement} from 'angular/angular.js';

@Decorator({
    selector: '[color]',
    bind: {color: 'color'},
    observe: {color: 'onColorChange'}
})
class ColorDec {
    constructor(el:NgElement) {
        this.element = el;
        this.onColorChange(this.color);
    }

    onColorChange(newValue) {
        this.element.domElement.style.color = newValue;
    }
}

export default ColorDec;