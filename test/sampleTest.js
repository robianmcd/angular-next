import {Component} from 'ng2/component.js';

describe('myClass', function () {
    it('should set a member variable', function () {
        var comp = new Component({selector: 'my-comp'});
        expect(comp.selector).toEqual('my-comp2');
    });
});