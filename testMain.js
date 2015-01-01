//This file is based off of: https://github.com/gocardless/es6-angularjs/blob/master/config/karma-spec-loader.config.js

// make karma wait for a call to __karma__.start() to start running tests.
__karma__.loaded = function () {
};

Promise.all(
    // All files served by Karma.
    Object.keys(__karma__.files)
        //Filter out everything other than test spec files
        .filter(function (path) {
            return /test-build/.test(path);
        })
        //Import all the test spec modules
        .map(function (path) {
            return System.import(path.replace('/base/test-build/', ''));
        })
)
    .then(function () {
        __karma__.start();
    }, function (error) {
        console.error(error.stack || error);
        __karma__.start();
    });