import {Directive} from './directive.js';

//A transclude directive like ng-if or ng-repeat
class Template extends Directive {
    constructor(options) {
        super(options);
    }
}

export {Template};