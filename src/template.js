import Directive from './directive';

//A transclude directive like ng-if or ng-repeat
export default class Template extends Directive {
    constructor(options) {
        super({selector: options.selector});
    }
}