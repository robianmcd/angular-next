# Angular Next - Color Slider

This app demonstrates many of the Angular 2 features that Angular Next lets you start using. It also shows how you use these features along side existing Angular 1 code. Angular 2 relies on ES6 modules but you may not want to use modules for your existing Angular 1 code. To deal with this the [gulpfile](https://github.com/robianmcd/angular-next/blob/gh-pages/examples/color-slider/gulpfile.js#L29-L49) for this project will only treat files ending with `.ats.js` as ES6 modules and compile them into ES5 with Traceur.

### Demo

[http://robianmcd.github.io/angular-next/examples/color-slider/build](http://robianmcd.github.io/angular-next/examples/color-slider/build)

### Demonstrated Features
* [Bootstrapping an app](https://github.com/robianmcd/angular-next/blob/gh-pages/examples/color-slider/src/app.ats.js#L5)
* [Component directive](https://github.com/robianmcd/angular-next/blob/gh-pages/examples/color-slider/src/components/colorSettings/ng2ColorSettings.ats.js)
* [Decorator directive](https://github.com/robianmcd/angular-next/blob/gh-pages/examples/color-slider/src/decorators/backgroundColor.ats.js)
* [Directive selector](https://github.com/robianmcd/angular-next/blob/gh-pages/examples/color-slider/src/components/colorSettings/ng2ColorSettings.ats.js#L7)
* [Directive bind and observe](https://github.com/robianmcd/angular-next/blob/gh-pages/examples/color-slider/src/decorators/backgroundColor.ats.js#L5-L6)
* [Service](https://github.com/robianmcd/angular-next/blob/gh-pages/examples/color-slider/src/services/colorUtil.ats.js)
* [Injecting NgElement into directive controller](https://github.com/robianmcd/angular-next/blob/gh-pages/examples/color-slider/src/decorators/backgroundColor.ats.js#L9)
* [Injecting an Angular 2 Service, a parent component, and an Angular 1 Service](https://github.com/robianmcd/angular-next/blob/gh-pages/examples/color-slider/src/components/colorSettings/ng2ColorSettings.ats.js#L15)

### Run locally

```sh
git clone https://github.com/robianmcd/angular-next.git
cd angular-next/examples/color-slider
npm install
bower install
gulp
```

You can now access the app at [http://localhost:8080/](http://localhost:8080/)