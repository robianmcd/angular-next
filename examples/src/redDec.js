import Decorator from './decorator';
import NgElement from './core/ngElement';

@Decorator({
    selector: '[red]'
})
export default class RedDec {
    constructor(el: NgElement) {
        el.domElement.style.color = 'red';
    }
}