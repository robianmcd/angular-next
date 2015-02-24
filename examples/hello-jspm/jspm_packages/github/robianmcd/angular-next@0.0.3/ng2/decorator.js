/* */ 
import {Directive} from './directive';

//Like ng-class, ng-show
class Decorator extends Directive {
    constructor(options:Object) {
        super(options);
    }
}

var DecoratorClass = assert.define('DecoratorClass', function (decoratorClass) {
    assert.type(decoratorClass, Object);

    var numDirAnnos;
    var numComponentAnnos;
    if (decoratorClass.annotations) {
        numDirAnnos = decoratorClass.annotations.filter(anno => anno instanceof Directive).length;
        numComponentAnnos = decoratorClass.annotations.filter(anno => anno instanceof Decorator).length;
    } else {
        numDirAnnos = 0;
        numComponentAnnos = 0;
    }


    if (numComponentAnnos === 0) {
        assert.fail('A DecoratorClass must have a Decorator annotation');
    }
    if (numDirAnnos > 1) {
        asssert.fail('You cannot have more than one Directive annotations on a class.');
    }
});

export {Decorator, DecoratorClass};