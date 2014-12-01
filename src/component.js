import Directive from './directive';

//Like a panel
export default class Component extends Directive {
    constructor(options) {
        super({selector: options.selector, componentServices: options.componentServices});

        this.template = options.template;
        this.templateUrl = options.templateUrl;
        this.controllerAs = options.controllerAs;
        this.directives = options.directives;
    }
}