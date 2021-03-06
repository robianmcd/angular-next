# Change Log
All notable changes to this project will be documented in this file.

## [Unreleased][unreleased]

### Added
- Added support for Angular 2 style events and property bindings in templates

## [0.0.3] - 2015-02-23

### Added
- Replaced ES6 Promise implementation with one based on $q so they are integrated with Angular's digest cycle.
- Created an example using jspm

### Changed
- Replaced template option in Component directives with a new `@Template` annotation
- Renamed assert.js module to angular2/rtts-assert.js

## [0.0.2] - 2015-01-26

### Changed
- replace core/core.js module with angular/angular.js to reflect [this change in angular 2.0](https://github.com/angular/angular/commit/ec5cb3eb66aa343bbc7f67c182c1cc021ce04096)

### Added
- Started versioning releases in the dist folder
- Created a changelog based on [keepachangelog.com](http://keepachangelog.com/)

## [0.0.1] - 2015-01-18
### Added
- Setup foundation for Angular Next

[unreleased]: https://github.com/robianmcd/angular-next/compare/...HEAD
[0.0.3]: https://github.com/robianmcd/angular-next/compare/0.0.2...0.0.3
[0.0.2]: https://github.com/robianmcd/angular-next/compare/0.0.1...0.0.2
[0.0.1]: https://github.com/robianmcd/angular-next/compare/0.0.0...0.0.1