# angular-next
> Angular Next brings the power of **Angular 2** to Angular 1 and gives you an incremental **migration path**.

This library lets you start writing Angular 2 style directives and services and use them in an existing Angular 1 app. This allows you to incrementally adopt features from Angular 2 instead of needing to migrate all at once.

**Warning: Angular Next is still highly experimental. It could change drastically as more information is released about Angular 2.0**

## Sample App: Angular 1 + Angular Next

index.html
```html
<hello-component></hello-component>

<script src="//robianmcd.github.io/angular-next/dist/angularNext-standalone.js"></script>
<script src="//ajax.googleapis.com/ajax/libs/angularjs/1.3.6/angular.js"></script>
<script>
    System.import('app').then(function (module) {
        module.main();
    });
</script>
```

app.js
```javascript
import {bootstrap, Component, TemplateConfig} from 'core/core.js';

@Component({
    selector: 'hello-component',
    template: new TemplateConfig({
        inline: '<h1>{{ctrl.message}}</h1>'
    })
})
class HelloComponent {
    constructor() {
        this.message = 'Hello World';
    }
}

export function main() {
    angular.module('myApp', []);
    bootstrap(HelloComponent, {moduleName: 'myApp'});
}
```

## Demos

**[Hello World](https://github.com/robianmcd/angular-next/tree/gh-pages/examples/hello-world)**
* A working demo of the hello world example shown above.

**[Color Slider](https://github.com/robianmcd/angular-next/tree/gh-pages/examples/color-slider)**
* Demonstrates usage of: components, decorators, services, bootstrapping, selector, bind, observe, NgElement, injecting parent directives, injecting Angular 1 services, gulp, Traceur, etc.

## Get Angular Next
Angular Next distributes two files
  * **angularNext-standalone.js** - Contains the Angular Next library along with all of its dependencies. This includes [traceur-runtime](https://github.com/jmcriffey/bower-traceur-runtime), [es6-module-loader](https://github.com/ModuleLoader/es6-module-loader), [the register extension for systemjs](https://github.com/systemjs/systemjs/blob/master/lib/extension-register.js), and [assert.js](http://angular.github.io/assert/)
  * **angularNext.js** - Just the Angular Next library. If you use this you'll need to manually include all of the dependencies.

You can get Angular Next through bower

```sh
bower install angular-next
```

or from the CDN

```html
<script src="//robianmcd.github.io/angular-next/dist/angularNext-standalone.js"></script>
```

More docs coming soon...