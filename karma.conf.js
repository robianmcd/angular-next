module.exports = function(config) {
  config.set({
    basePath: '',
    autoWatch: true,
    frameworks: ['jasmine'],
    reporters: ['progress'],
    browsers: ['Chrome']
  });
};
