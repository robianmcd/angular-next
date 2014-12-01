//See here for detailed annotation implimentations https://github.com/angular/angular/tree/master/modules/core/src/annotations
export default class Directive {
    constructor(options) {
        this.selector = options.selector;
        this.componentServices = options.componentServices
    }
}