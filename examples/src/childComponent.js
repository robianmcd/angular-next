import Component from './component';
import TemplateConfig from './templateConfig';
import NgElement from './core/ngElement';
import ColorDec from './colorDec';

@Component({
    selector: 'child-component',
    template: new TemplateConfig({
        inline: '<div>child: {{ctrl.test}}</div><div color="\'red\'">decorated red text</div>',
        directives: [ColorDec]
    }),
    controllerAs: 'ctrl'
})
export default class ChildComponent {
    constructor(element: NgElement) {
        element.domElement.style.color = 'blue';

        this.test = this.getTestStr();
    }

    getTestStr() {
        return 'blue text';
    }
}