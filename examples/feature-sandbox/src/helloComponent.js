import {Component, Template, NgElement} from 'angular2/angular2.js';
import ChildComponent from 'childComponent.js';
import MyService from 'myService.js';
import MyChildService from 'myChildService.js';


@Component({
    selector: '[hello-component]',
    componentServices: [MyService, MyChildService, NgElement]
})
@Template({
    inline: '<h1>Hello {{ctrl.test}}</h1><child-component></child-component>',
    directives: [ChildComponent]
})
class HelloComponent {
    constructor(test: MyService) {
        this.test = test.getStr();
    }
}

export default HelloComponent;