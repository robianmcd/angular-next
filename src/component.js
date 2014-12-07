import Directive from './directive';
import TemplateConfig from './templateConfig';

//Like a panel
class Component extends Directive {
    constructor(options: ComponentOptions) {
        this.componentServices = options.componentServices;
        this.template = options.template;

        delete options.componentServices;
        delete options.template;

        super(options);
    }
}
export default Component;


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
