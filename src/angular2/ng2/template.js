import {Directive} from 'angular2/ng2/directive.js';

//A transclude directive like ng-if or ng-repeat
class Template extends Directive {
    constructor(options) {
        super(options);
    }
}

export {Template};