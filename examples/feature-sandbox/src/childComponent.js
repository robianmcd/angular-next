import {Component} from './component';
import TemplateConfig from './templateConfig';
import NgElement from './core/ngElement';
import ColorDec from './colorDec';
import HelloComponent from './helloComponent';

@Component({
    selector: 'child-component',
    template: new TemplateConfig({
        inline: '' +
            '<div>child: {{ctrl.test}}</div>' +
            '<div><input type="text" ng-model="ctrl.color"/></div>' +
            '<div color="ctrl.color">decorated red text</div>',
        directives: [ColorDec]
    }),
    controllerAs: 'ctrl'
})
class ChildComponent {
    constructor(element: NgElement, hello: HelloComponent) {
        element.domElement.style.color = 'blue';

        this.color = 'red';
        this.test = hello.test;
    }

    getTestStr() {
        return 'blue text';
    }
}

export default ChildComponent;