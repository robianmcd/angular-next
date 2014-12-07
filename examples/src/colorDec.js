import Decorator from './decorator';
import NgElement from './core/ngElement';

@Decorator({
    selector: '[color]',
    bind: {color: 'color'}
})
class ColorDec {
    constructor(el: NgElement) {
        el.domElement.style.color = this.color;
    }
}

export default ColorDec;