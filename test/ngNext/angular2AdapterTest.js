import {Angular2Adapter, Decorator} from 'core/core.js';

describe('Angular2Adapter', function () {

    var adapter;

    @Decorator({selector: 'my-dec'})
    class MyDec {

    }

    beforeEach(function () {
        angular.module('myApp', []);
        adapter = new Angular2Adapter({moduleName: 'myApp'});
    });

    describe('getDirAnno', function () {
        it('should return the annotation', function () {
            var anno = adapter.getDirAnno(MyDec);
            expect(anno).toEqual(jasmine.any(Decorator));
            expect(anno.selector).toEqual('my-dec');
        });
    });

    describe('lowerCaseFirstLetter', function () {
        it('should make the first character lower case', function () {
            expect(adapter.lowerCaseFirstLetter('MyClassName')).toEqual('myClassName');
            expect(adapter.lowerCaseFirstLetter('alreadyLower')).toEqual('alreadyLower');
            expect(adapter.lowerCaseFirstLetter('A')).toEqual('a');
            expect(adapter.lowerCaseFirstLetter('$Thing')).toEqual('$Thing');
            expect(adapter.lowerCaseFirstLetter('')).toEqual('');
        });
    });


    describe('getFunctionName', function () {
        it('should return the name of a class', function () {
            expect(adapter.getFunctionName(MyDec)).toEqual('MyDec');
        });
    });

    describe('isDirClass', function () {
        it('should return true for decorator', function () {
            expect(adapter.isDirClass(MyDec)).toBe(true);
        });

        it('should return false for nonDirective', function () {
            var MyClass = function () {

            };
            MyClass.annotations = [{selector: 'not-a-real-directive'}];
            expect(adapter.isDirClass(MyClass)).toBe(false);
        });

    });


});