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
    "angular2": "github:robianmcd/angular-next@6fd681c33c4d6cd98837f893e2ead642611e9982"
  }
});

