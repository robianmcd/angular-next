import {Angular2Adapter, Decorator, Component, Template, InjectNgOne} from 'angular2/angular2.js';

describe('Angular2Adapter', function () {

    var adapter;

    class MyService {

    }

    @Decorator({selector: '[my-dec]'})
    class MyDec {
        constructor(myService:MyService) {

        }
    }

    @Component({
        selector: 'my-component',
        controllerAs: 'myCtrl',
        bind: {param1: 'param1'}
    })
    @Template({inline: 'hello world'})
    class MyComp {
        constructor(param1:Object) {

        }
    }


    beforeEach(function () {
        angular.module('myApp', []);
        adapter = new Angular2Adapter({moduleName: 'myApp'});
    });

    describe('getNg1DirectiveInfo', function () {
        it('should generate ddo for attribute selector directive', function () {
            expect(adapter.getNg1DirectiveInfo(MyDec)).toEqual({
                name: 'myDec',
                ddo: {
                    restrict: 'A',
                    controller: MyDec,
                    controllerAs: 'ctrl',
                    scope: {},
                    bindToController: true
                }
            });
        });

        it('should generate ddo for element selector directive', function () {
            expect(adapter.getNg1DirectiveInfo(MyComp)).toEqual({
                name: 'myComponent',
                ddo: {
                    restrict: 'E',
                    controller: MyComp,
                    controllerAs: 'myCtrl',
                    scope: {param1: '=param1'},
                    bindToController: true,
                    template: 'hello world'
                }
            });
        });
    });

    describe('getInjectArray', function () {
        it('should get a decorator\'s $inject array', function () {
            expect(adapter.getInjectArray(MyDec)).toEqual(['myService']);
        });
    });

    describe('getInjectStrFromParamAnnotations', function () {
        it('should return the correct string', function () {
            expect(adapter.getInjectStrFromParamAnnotations([MyDec])).toEqual('myDec');
            expect(adapter.getInjectStrFromParamAnnotations([new InjectNgOne('$scope')])).toEqual('$scope');

            var callWithInvalidParam = function () {
                adapter.getInjectStrFromParamAnnotations([]);
            };
            expect(callWithInvalidParam).toThrow();
        });
    });

    describe('getDirAnno', function () {
        it('should return the annotation', function () {
            var anno = adapter.getDirAnno(MyDec);
            expect(anno).toEqual(jasmine.any(Decorator));
            expect(anno.selector).toEqual('[my-dec]');
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