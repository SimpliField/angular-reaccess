angular.module('simplifield.reaccess', ['ng'])
  .provider('sfReaccessService', function SFReaccessServiceProvider() {
  var $injector = angular.injector(['ng']);
  var predefinedRights = {};
  var currentRights = [];
  var currentValues = [];
  var globalDebug = false;

  var cache = {};

  this.setPredefinedRights = function(value) {
    predefinedRights = value;
  };

  this.addPredefinedRights = function(value) {
    predefinedRights = angular.extend({}, predefinedRights, value);
  };

  this.debug = function(value) {
    globalDebug = value;
  };

  this.$get = ['$log', function SFReaccessServiceFactory($log) {
    var sfReaccessService = {
      setRights: function sfReaccessServiceSetRights(rights) {
        cache = {} // Empty cache;
        currentRights = rights;
      },
      setValues: function sfReaccessServiceSetValues(values) {
        currentValues = values;
      },
      _debugging: globalDebug,
      test: function sfReaccessServiceMatch(url, debug) {
        var right;
        var path;
        var rightPath;
        try {
          var parsedUrl = url.split(' ');
          var methods = parsedUrl[0].split(',');
          var rightPath = parsedUrl[1];
          var isMatching = false;

          if('undefined' !== typeof cache[url]) {
            if(debug) {
              $log.debug('sfReaccess: Serving right resolution from cache for' + url);
            }
            return cache[url];
          }

          if(currentRights.some(function(currentRight, i) {
            var result = false;
            if(!methods.every(function(method) {
              return -1 !== currentRight.methods.indexOf(method);
            })) {
              if(debug) {
                $log.debug('sfReaccess: ' + url + ' : ' + i + ': Methods' +
                  ' doesn\'t match.', methods, currentRight.methods);
              }
              return false;
            }
            path = currentRight.path;
            if(currentValues) {
              while(/(.*\/|^):([a-z0-9_\-\.\*\@\#]+)(\/.*|$)/.test(path)) {
                path = path.replace(
                  /(.*\/|^):([a-z0-9_\-\.\*\@\#]+)(\/.*|$)/,
                  function($, $1, $2, $3) {
                    var values = getValues(currentValues, $2);
                    if(debug) {
                      $log.debug('sfReaccess: ' + url + ' : ' + i +
                        ' Found the templated value "' + $2 + '" in the current' +
                        ' tested right, resolved it to the following values:', values, currentValues);
                    }
                    if(values.length) {
                      return $1 + (1 === values.length ?
                        escRegExp(values[0]) :
                        '(' + values.map(escRegExp).join('|') + ')') + $3;
                    }
                    return '';
                  }
                );
              }
            }
            result = path && new RegExp('^'+path+'$').test(rightPath)
            if(debug) {
              $log.debug('sfReaccess: ' + url + ' : ' + i + ': Testing "' +
                rightPath + '" against "/^' + path.replace('/', '\\/') + '$/"' +
                ' (original path "' + currentRight.path + '")' +
                ' led to ', result ? 'SUCCESS' : 'FAILURE');
            }
            return result;
          })) {
            isMatching = true;
          }

          cache[url] = isMatching;
          return isMatching;

        } catch(err) {
          if(debug) {
            $log.debug('sfReaccess: ' + url + ': FAILURE due "' +
              'to the following error:', err);
          }
          return null;
        }
      },
    };

    return sfReaccessService;
  }];
}).filter('sfReaccess', ['$log', 'sfReaccessService',
  function ($log, sfReaccessService) {
    return function(url, debug) {
      debug = 'boolean' === typeof debug ? debug : sfReaccessService._debugging;

      if(debug) {
        $log.debug('sfReaccess: New filter execution:', url, templateValues);
      }

      return sfReaccessService.test(url, debug);
    };
  }
]);

// Helpers
function getValues(values, path) {
  var index = path.indexOf('.');
  var part = -1 !== index ? path.substring(0, index) : path;
  path = -1 !== index ? path.substring(index + 1) : '';

  values = values.reduce(function(values, value) {
    if((value instanceof Object) && '*' === part) {
      values = values.concat(Object.keys(value).map(function(key) {
        return value[key];
      }));
    }
    if((value instanceof Object) && '@' === part) {
      values = values.concat(Object.keys(value).filter(function(key) {
        return /^[^0-9]+$/.test(key);
      }).map(function(key) {
        return value[key];
      }));
    }
    if((value instanceof Array) && '#' === part) {
      values = values.concat(value);
    }
    if(-1 === ['@', '#', '*'].indexOf(part) &&
      'undefined' !== typeof value[part]) {
      values.push(value[part]);
    }
    return values;
  }, []).filter(function(value) {
    return 'undefined' !== typeof value;
  });
  return '' === path ? values : getValues(values, path);
}

function escRegExp(str) {
  return String(str).replace(/([.*+?=^!:${}()|[\]\/\\])/g, '\\$1');
}
