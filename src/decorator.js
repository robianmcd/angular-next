import Directive from './directive';

//Like ng-class, ng-show
class Decorator extends Directive {
    constructor(options) {
        super(options);
    }
}

export default Decorator;