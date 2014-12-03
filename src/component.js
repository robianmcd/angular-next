import Directive from './directive';

//Like a panel
export default class Component extends Directive {
    constructor({selector, componentServices, template, controllerAs}) {
        super({selector: selector, componentServices: componentServices});

        this.template = template;
        this.controllerAs = controllerAs;
    }
}