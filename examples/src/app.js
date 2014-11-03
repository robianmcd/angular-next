var app = angular.module('myApp', ['angularNext']);

@Component({
    selector: '[hello-component]',
    template: '<h1>Hello {{ctrl.test}}</h1>',
    controllerAs: 'ctrl'
})
class HelloComponent {
    constructor() {
        this.test = 'world';
    }
}