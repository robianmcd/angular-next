System.config({
  "baseURL": "/",
  "paths": {
    "*": "*.js",
    "github:*": "jspm_packages/github/*.js"
  },
  "traceurOptions": {
    "annotations": true,
    "types": true,
    "typeAssertions": true,
    "typeAssertionModule": "angular2/rtts-assert"
  }
});

System.config({
  "map": {
    "angular2": "github:robianmcd/angular-next@cea62e2f55b1ae826c357244c82c61b2c3e6df64"
  }
});

