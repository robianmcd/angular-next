//See here for detailed annotation implimentations https://github.com/angular/angular/tree/master/modules/core/src/annotations
export default class Directive {
    constructor({selector, componentServices}) {
        this.selector = selector;
        this.componentServices = componentServices;
    }
}