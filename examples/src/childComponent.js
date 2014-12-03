import Component from './component';
import TemplateConfig from './templateConfig';
import NgElement from './core/ngElement';

@Component({
    selector: '[child-component]',
    template: new TemplateConfig({
        inline: '<div>child {{ctrl.test}}</div>'
    }),
    controllerAs: 'ctrl'
})
export default class ChildComponent {
    constructor(element: NgElement) {
        this.test = this.getTestStr();
        element.domElement.style.color = 'red';
    }

    getTestStr() {
        return 'test string';
    }
}