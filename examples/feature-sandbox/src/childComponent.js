import {Component, Template, NgElement} from 'angular2/angular2.js';
import ColorDec from 'colorDec.js';
import HelloComponent from 'helloComponent.js';

@Component({
    selector: 'child-component',
    controllerAs: 'ctrl'
})
@Template({
    inline: '' +
    '<div (click)="ctrl.clicked()">child: {{ctrl.test}}</div>' +
    '<div><input type="text" [value]="ctrl.color"/></div>' +
    '<div color="ctrl.color">decorated {{ctrl.color}} text</div>',
    directives: [ColorDec]
})
class ChildComponent {
    constructor(element: NgElement, hello: HelloComponent) {
        element.domElement.style.color = 'blue';

        this.color = 'red';
        this.test = hello.test;
    }

    getTestStr() {
        return 'blue text';
    }

    clicked() {
        console.log('clicked');
    }
}

export default ChildComponent;