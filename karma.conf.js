module.exports = function(config) {
  config.set({
    basePath : './',

    logLevel: config.LOG_WARN,

    frameworks: ['mocha', 'sinon-chai'],
    browsers : ['PhantomJS'],
    preprocessors: { 'src/index.js': 'coverage' },
    reporters: ['mocha', 'coverage'],
    coverageReporter: {
      type : 'lcovonly',
      dir : 'coverage/'
    },

    //  Runner
    autoWatch: true,
    singleRun: true,

    //  Files
    files : [
      'bower_components/angular/angular.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'src/index.js',
      'tests/**/*.mocha.js'
    ]
  });
};
