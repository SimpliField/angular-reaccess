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
      test: function sfReaccessServiceTest(predefinedRight) {
        var right = predefinedRights[predefinedRight];
        if((!right) || 'undefined' == typeof right.path
          || 'undefined' == typeof right.methods
          || !right.methods.length) {
          return false;
        }
        if(currentRights.some(function(currentRight) {
          return right.path == currentRight.path && right.methods.every(function(method) {
            return -1 !== currentRight.methods.indexOf(method);
          });
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
      return sfReaccessService.test(predefinedRight);
    });
  };
}]);
