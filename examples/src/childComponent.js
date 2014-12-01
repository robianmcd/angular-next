import Component from './component';

@Component({
    selector: '[child-component]',
    template: '<div>child {{ctrl.test}}</div>',
    controllerAs: 'ctrl'
})
export default class ChildComponent {
    constructor() {
        this.test = 'component';
    }
}