import Component from './component';
import ChildComponent from './childComponent';
import MyService from './myService';
import TemplateConfig from './templateConfig';


@Component({
    selector: '[hello-component]',
    componentServices: [MyService],
    template: new TemplateConfig({
        inline: '<h1>Hello {{ctrl.test}}</h1><div child-component></div>',
        directives: [ChildComponent]
    }),
    controllerAs: 'ctrl'
})
export default class HelloComponent {
    constructor(test: MyService) {
        this.test = test.getStr();
    }
}