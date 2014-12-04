import Directive from './directive';

//Like a panel
export default class Component extends Directive {
    constructor({selector, componentServices, template, controllerAs, bind}) {
        super({selector: selector, componentServices: componentServices, bind});

        this.componentServices = componentServices;
        this.template = template;
        this.controllerAs = controllerAs;
    }
}