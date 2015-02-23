//See here for detailed annotation implimentations https://github.com/angular/angular/tree/master/modules/core/src/annotations
class Directive {
    constructor(options:DirectiveOptions) {
        this.selector = options.selector;
        this.bind = options.bind;
        this.controllerAs = options.controllerAs || 'ctrl';
        this.observe = options.observe;
    }
}

var DirectiveOptions = assert.define('DirectiveOptions', function (options) {
    //Required fields
    assert(options).is(assert.structure({
        selector: assert.string
    }));

    //Optional fields
    if (options.bind) {
        assert.type(options.bind, Object);
    }
    if (options.controllerAs) {
        assert.type(options.controllerAs, assert.string);
    }
    if (options.observe) {
        assert.type(options.observe, Object);
    }

    for (var key in options) {
        if (options.hasOwnProperty(key)) {
            if (key !== 'selector' && key !== 'bind' && key !== 'controllerAs' && key !== 'observe') {
                assert.fail(`${key} is not a valid directive field`);
            }
        }
    }
});

var DirectiveClass = assert.define('DirectiveClass', function (dirClass) {
    assert.type(dirClass, Object);

    var numDirAnnos;
    if(dirClass.annotations) {
         numDirAnnos = dirClass.annotations.filter(anno => anno instanceof Directive).length;
    } else {
        numDirAnnos = 0;
    }


    if (numDirAnnos === 0) {
        assert.fail('A DirectiveClass must have a Directive annotation');
    } else if(numDirAnnos > 1) {
        asssert.fail('You cannot have more than one Directive annotations on a class.');
    }
});

export {Directive, DirectiveOptions, DirectiveClass};