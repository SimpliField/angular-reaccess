angular.module('simplifield.reaccess', ['ng'])
  .provider('sfReaccessService', function SFReaccessServiceProvider() {
  var $injector = angular.injector(['ng']);
  var predefinedRights = {};
  var currentRights = [];
  var currentValues = [];
  var globalDebug = false;

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
        currentRights = rights;
      },
      setValues: function sfReaccessServiceSetValues(values) {
        currentValues = values;
      },
      _debugging: globalDebug,
      match: function sfReaccessServiceMatch(predefinedRight, templateValues, debug) {
        var right;
        var path;
        var rightPath;
        try {
          rights = predefinedRights[predefinedRight] instanceof Array ?
            predefinedRights[predefinedRight] :
            [predefinedRights[predefinedRight]];
          return rights.every(function(right) {
            if((!right) || 'undefined' == typeof right.path
              || 'undefined' == typeof right.methods
              || !right.methods.length) {
              if(debug) {
                $log.error('sfReaccess: ' + predefinedRight + ': No or invalid right' +
                  ' object (requiring path, methods properties).');
              }
              return false;
            }
            rightPath = right.path;
            while(/(.*\/|^):([a-z0-9_\-\.\*\@\#]+)(\/.*|$)/.test(rightPath)) {
              rightPath = rightPath.replace(/(.*\/|^):([a-z0-9_\-\.\*\@\#]+)(\/.*|$)/,
                function($, $1, $2, $3) {
                  var values = getValues(templateValues.concat(currentValues), $2);
                  if(debug) {
                    $log.debug('sfReaccess: ' + predefinedRight + ': Found the' +
                      ' templated value "' + $2 + '" in the predefined right,' +
                      ' resolved it to the following values:', values, templateValues.concat(currentValues));
                  }
                  if(values.length) {
                    return $1 + values[0] + $3;
                  }
                  return '';
                });
            }
            if(currentRights.some(function(currentRight, i) {
              var result = false;
              if(!right.methods.every(function(method) {
                return -1 !== currentRight.methods.indexOf(method);
              })) {
                if(debug) {
                  $log.debug('sfReaccess: ' + predefinedRight + ': ' + i + ': Methods' +
                    ' doesn\'t match.', right.methods, currentRight.methods);
                }
                return false;
              }
              path = currentRight.path;
              if(currentValues) {
                while(/(.*\/|^):([a-z0-9_\-\.\*\@\#]+)(\/.*|$)/.test(path)) {
                  path = path.replace(/(.*\/|^):([a-z0-9_\-\.\*\@\#]+)(\/.*|$)/,
                    function($, $1, $2, $3) {
                      var values = getValues(currentValues, $2);
                      if(debug) {
                        $log.debug('sfReaccess: ' + predefinedRight + ': ' + i +
                          ' Found the templated value "' + $2 + '" in the current' +
                          ' tested right, resolved it to the following values:', values, currentValues);
                      }
                      if(values.length) {
                        return $1 + (1 === values.length ?
                          escRegExp(values[0]) :
                          '(' + values.map(escRegExp).join('|') + ')') + $3;
                      }
                      return '';
                    });
                }
              }
              result = path && new RegExp('^'+path+'$').test(rightPath)
              if(debug) {
                $log.debug('sfReaccess: ' + predefinedRight + ': ' + i + ': Testing "' +
                  rightPath + '" against "/^' + path.replace('/', '\\/') + '$/"' +
                  ' (original path "' + currentRight.path + '")' +
                  ' led to ', result ? 'SUCCESS' : 'FAILURE');
              }
              return result;
            })) {
              return true;
            }
            return null;
          }) ? rightPath : null;
        } catch(err) {
          if(debug) {
            $log.debug('sfReaccess: ' + predefinedRight + ': FAILURE due "' +
              'to the following error:', err);
          }
          return null;
        }
      },
      test: function sfReaccessServiceTest() {
        var res = sfReaccessService.match.apply(sfReaccessService, arguments);

        return (res !== null);
      }
    };

    return sfReaccessService;
  }];
}).filter('sfReaccess', ['$log', 'sfReaccessService',
  function ($log, sfReaccessService) {
  return function(predefinedRights, templateValues, debug) {
    debug = 'boolean' === typeof debug ? debug : sfReaccessService._debugging;
    predefinedRights = predefinedRights || [];
    templateValues = (templateValues instanceof Array ? templateValues :
      (templateValues ? [templateValues] : []));
    if(!(predefinedRights instanceof Array)) {
      predefinedRights = [predefinedRights];
    }
    if(debug) {
      $log.debug('sfReaccess: New filter execution:', predefinedRights, templateValues);
    }
    return predefinedRights.every(function(predefinedRight) {
      return sfReaccessService.test(predefinedRight, templateValues, debug);
    });
  };
}]);

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
