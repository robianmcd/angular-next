[![Bower version](https://badge.fury.io/bo/angular-next.svg)](http://badge.fury.io/bo/angular-next) [![Build Status](https://travis-ci.org/robianmcd/angular-next.svg)](https://travis-ci.org/robianmcd/angular-next)

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
import {bootstrap, Component, TemplateConfig} from 'angular/angular.js';

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

## Documentation
For documentation on the supported features checkout the [Wiki](https://github.com/robianmcd/angular-next/wiki).

### Changelog

### [0.0.2] - 2015-01-26

#### Changed
- replace core/core.js module with angular/angular.js to reflect [this change in angular 2.0](https://github.com/angular/angular/commit/ec5cb3eb66aa343bbc7f67c182c1cc021ce04096)

#### Added
- Started versioning releases in the dist folder
- Created a changelog based on [keepachangelog.com](http://keepachangelog.com/)

[Click here for the full changelog](https://github.com/robianmcd/angular-next/blob/gh-pages/CHANGELOG.md)

## Roadmap
1. Improve unit tests and add e2e tests
1. Look into integrating with the new [router](https://github.com/angular/router)
1. Add better logging for common errors
1. Support template directives. **Blocked**: Waiting for more details to be released
1. Support querying child directives. **Blocked**: Waiting for more details to be released