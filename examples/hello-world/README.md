# Angular Next - Hello World

This is a bare bones, self contained example that uses Angular Next to create a directive that says "Hello World".

### Demo

[http://robianmcd.github.io/angular-next/examples/hello-world/](http://robianmcd.github.io/angular-next/examples/hello-world/) - **Spoiler Alert:** It says "Hello World"...

### Run locally

```sh
git clone https://github.com/robianmcd/angular-next.git
cd angular-next/examples/hello-world
npm install
npm run build
npm start
```

You can now access the app at [http://localhost:8080/](http://localhost:8080/)


### Files

* *build/*
  * *app.js* - The result of compiling src/app.js into ES5 with Traceur
* *src/*
  * *app.js* - Sets up the angular app and defines the `helloComponent` directive
* *index.html* - Runs the app's main function which bootstraps the angular app.
* *package.json* - This just includes Traceur which is used to compile src/app.js into ES5, and http-server which is used to statically serve the app
