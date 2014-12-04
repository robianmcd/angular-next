//See here for detailed annotation implimentations https://github.com/angular/angular/tree/master/modules/core/src/annotations
export default class Directive {
    constructor({selector, bind}) {
        this.selector = selector;
        this.bind = bind;
    }
}