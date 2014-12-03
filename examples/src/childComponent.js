import Component from './component';
import TemplateConfig from './templateConfig';
import NgElement from './core/ngElement';
import RedDec from './redDec';

@Component({
    selector: 'child-component',
    template: new TemplateConfig({
        inline: '<div>child: {{ctrl.test}}</div><div red>decorated red text</div>',
        directives: [RedDec]
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