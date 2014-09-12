module.exports = function(config){
  config.set({
    basePath : './',

    logLevel: config.LOG_WARN,

    frameworks: ['mocha', 'sinon-chai'],
    browsers : ['Chrome'],

    //  Runner
    autoWatch: true,
    singleRun: false,

    //  Files
    files : [
      'bower_components/angular/angular.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'src/index.js',
      'tests/**/*.mocha.js'
    ]
})};

