import {Component, TemplateConfig, NgElement} from 'core/core';
import ChildComponent from 'childComponent';
import MyService from 'myService';
import MyChildService from 'myChildService';


@Component({
    selector: '[hello-component]',
    componentServices: [MyService, MyChildService, NgElement],
    template: new TemplateConfig({
        inline: '<h1>Hello {{ctrl.test}}</h1><child-component></child-component>',
        directives: [ChildComponent]
    })
})
class HelloComponent {
    constructor(test: MyService) {
        this.test = test.getStr();
    }
}

export default HelloComponent;