import Component from './component';
import TemplateConfig from './templateConfig';

@Component({
    selector: '[child-component]',
    template: new TemplateConfig({
        inline: '<div>child {{ctrl.test}}</div>'
    }),
    controllerAs: 'ctrl'
})
export default class ChildComponent {
    constructor() {
        this.test = 'component';
    }
}