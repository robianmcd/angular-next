//See here for detailed annotation implimentations https://github.com/angular/angular/tree/master/modules/core/src/annotations
class Directive {
    constructor(options: DirectiveOptions) {
        this.selector = options.selector;
        this.bind = options.bind;
        this.controllerAs = options.controllerAs;
    }
}

export default Directive;


var DirectiveOptions = assert.define('DirectiveOptions', function(options) {
    //Required fields
    assert(options).is(assert.structure({
        selector: assert.string
    }));

    //Optional fields
    if(options.bind) {
        assert.type(options.bind, Object);
    }
    if(options.controllerAs) {
        assert.type(options.controllerAs, assert.string);
    }

    for(var key in options) {
        if (options.hasOwnProperty(key)) {
            if(key !== 'selector' && key !== 'bind' && key !== 'controllerAs') {
                assert.fail(`${key} is not a valid directive field`);
            }
        }
    }
});
