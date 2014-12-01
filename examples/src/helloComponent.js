import Component from './component';
import ChildComponent from './childComponent';
import MyService from './myService';


@Component({
    selector: '[hello-component]',
    componentServices: [MyService],
    template: '<h1>Hello {{ctrl.test}}</h1><div child-component></div>',
    controllerAs: 'ctrl',
    directives: [ChildComponent]
})
export default class HelloComponent {
    constructor(test: MyService) {
        this.test = test.getStr();
    }
}