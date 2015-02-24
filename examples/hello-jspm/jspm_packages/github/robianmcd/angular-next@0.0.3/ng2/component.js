/* */ 
import {Directive} from './directive';

//Like a panel
class Component extends Directive {
    constructor(options: ComponentOptions) {
        this.componentServices = options.componentServices;
        delete options.componentServices;
        super(options);
    }
}

var ComponentOptions = assert.define('ComponentOptions', function(options) {
    //Required fields
    assert(options).is(assert.structure({
        selector: assert.string
    }));

    //Optional fields
    if(options.componentServices) {
        assert(options.componentServices).is(assert.arrayOf(Object));
    }
});

var ComponentClass = assert.define('ComponentClass', function (componentClass) {
    assert.type(componentClass, Object);

    var numDirAnnos;
    var numComponentAnnos;
    if(componentClass.annotations) {
        numDirAnnos = componentClass.annotations.filter(anno => anno instanceof Directive).length;
        numComponentAnnos = componentClass.annotations.filter(anno => anno instanceof Component).length;
    } else {
        numDirAnnos = 0;
        numComponentAnnos = 0;
    }


    if (numComponentAnnos === 0) {
        assert.fail('A ComponentClass must have a Component annotation');
    }
    if(numDirAnnos > 1) {
        asssert.fail('You cannot have more than one Directive annotations on a class.');
    }
});

export {Component, ComponentOptions, ComponentClass};