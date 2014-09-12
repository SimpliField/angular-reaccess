angular.module('simplifield.reaccess', [])
  .provider('sfReaccessService', function SFReaccessServiceProvider() {
  var predefinedRights = {};
  var currentRights = [];
  var currentValues = [];

  this.setPredefinedRights = function(value) {
    predefinedRights = value;
  };

  this.$get = function SFReaccessServiceFactory() {

    var sfReaccessService = {
      setRights: function sfReaccessServiceSetRights(rights) {
        currentRights = rights;
      },
      setValues: function sfReaccessServiceSetValues(values) {
        currentValues = values;
      },
      test: function sfReaccessServiceTest(predefinedRight, templateValues) {
        var right = predefinedRights[predefinedRight];
        var path;
        var rightPath;
        if((!right) || 'undefined' == typeof right.path
          || 'undefined' == typeof right.methods
          || !right.methods.length) {
          return false;
        }
        rightPath = right.path;
        while(/(.*\/|^):([a-z0-9_\-\.\*\@\#]+)(\/.*|$)/.test(rightPath)) {
          rightPath = rightPath.replace(/(.*\/|^):([a-z0-9_\-\.\*\@\#]+)(\/.*|$)/,
            function($, $1, $2, $3) {
              var values = getValues(currentValues, $2);
              //console.log('rightPath values', values, currentValues, $2)
              if(values.length) {
                return $1 + values[0] + $3;
              }
              return '';
            });
        }
        if(currentRights.some(function(currentRight) {
          if(!right.methods.every(function(method) {
            return -1 !== currentRight.methods.indexOf(method);
          })) {
            return false;
          }
          path = currentRight.path;
          if(currentValues) {
            while(/(.*\/|^):([a-z0-9_\-\.\*\@\#]+)(\/.*|$)/.test(path)) {
              path = path.replace(/(.*\/|^):([a-z0-9_\-\.\*\@\#]+)(\/.*|$)/,
                function($, $1, $2, $3) {
                  var values = getValues(currentValues, $2);
                  //console.log('path values', values, currentValues, $2)
                  if(values.length) {
                    return $1 + (1 === values.length ?
                      escRegExp(values[0]) :
                      '(' + values.map(escRegExp).join('|') + ')') + $3;
                  }
                  return '';
                });
            }
          }
          //console.log('path', path, 'rightPath', rightPath)
          return path && new RegExp('^'+path+'$').test(rightPath);
        })) {
          return true;
        }
        return false;
      }
    };

    return sfReaccessService;
  };
}).filter('sfReaccess', ['sfReaccessService', function (sfReaccessService) {
  return function(predefinedRights, templateValues) {
    predefinedRights = predefinedRights || [];
    if(!(predefinedRights instanceof Array)) {
      predefinedRights = [predefinedRights];
    }
    return predefinedRights.every(function(predefinedRight) {
      return sfReaccessService.test(predefinedRight, templateValues);
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

