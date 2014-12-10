import {Directive} from './directive';

//A transclude directive like ng-if or ng-repeat
class Template extends Directive {
    constructor(options) {
        super(options);
    }
}

export default Template;