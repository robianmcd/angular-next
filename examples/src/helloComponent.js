import Component from './component';

@Component({
    selector: '[hello-component]',
    template: '<h1>Hello {{ctrl.test}}</h1>',
    controllerAs: 'ctrl'
})
export default class HelloComponent {
    constructor() {
        this.test = 'world';
    }
}