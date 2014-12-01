import Component from './component';
import ChildComponent from './childComponent';

@Component({
    selector: '[hello-component]',
    template: '<h1>Hello {{ctrl.test}}</h1><div child-component></div>',
    controllerAs: 'ctrl',
    directives: [ChildComponent]
})
export default class HelloComponent {
    constructor() {
        this.test = 'world';
    }
}