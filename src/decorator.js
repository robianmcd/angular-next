import Directive from './directive';

//Like ng-class, ng-show
export default class Decorator extends Directive {
    constructor({selector, componentServices}) {
        super({selector: selector, componentServices: componentServices});
    }
}