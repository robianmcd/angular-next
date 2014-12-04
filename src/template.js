import Directive from './directive';

//A transclude directive like ng-if or ng-repeat
export default class Template extends Directive {
    constructor({selector, bind}) {
        super({selector: selector, bind: bind});
    }
}