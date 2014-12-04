import Directive from './directive';

//Like ng-class, ng-show
export default class Decorator extends Directive {
    constructor({selector, bind}) {
        super({selector: selector, bind: bind});
    }
}