import Directive from './directive';

//Like ng-class, ng-show
export default class Decorator extends Directive {
    constructor(options) {
        super({selector: options.selector});
    }
}