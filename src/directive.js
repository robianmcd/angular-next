//See here for detailed annotation implimentations https://github.com/angular/angular/tree/master/modules/core/src/annotations
export default class Directive {
    constructor(options: DirectiveOptions) {
        this.selector = options.selector;
        this.bind = options.bind;
    }
}

class DirectiveOptions {

    static assert(options) {
        if(!options.selector) {
            assert.fail('The selector field is missing from this directive.');
        }
    }
}
