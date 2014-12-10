# angular-next
> Angular Next brings the power of **Angular 2** to Angular 1 and gives you an incremental **migration path**.

This library lets you start writing Angular 2 style directives and services and use them in an existing Angular 1 app. This allows you to incrementally adopt features from Angular 2 instead of needing to migrate all at once.

**Warning: Angular Next is still highly experimental and is on version 0.0.0. Check back soon.**

## Sample App: Angular 1 + Angular Next

index.html
```html
    <my-component></my-component>

    <script>
        System.import('app').then(function (app) {
            app.main();
        })
    </script>
```

app.js
```javascript
import bootstrap from './bootstrap';
import {Component} from './component';
import TemplateConfig from './templateConfig';


@Component({
    selector: 'my-component',
    template: new TemplateConfig({
        inline: '<h1>Hello {{ctrl.world}}</h1>'
    })
})
class MyComponent {
    constructor() {
        this.world = 'world';
    }
}

export function main() {
    var app = angular.module('myApp', []);

    bootstrap(MyComponent, {moduleName: 'myApp'});
}

```


## Preparation
There is lots you can do to start making your Angular 1 app more Angular 2 friendly.

### Controller As
todo

### Traceur
todo

### Modules
todo

## Installation
todo
