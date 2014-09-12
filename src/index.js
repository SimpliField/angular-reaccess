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
    
    };

    return sfReaccessService;
  };
}).filter('sfReaccess', ['sfReaccessService', function () {
  return function(rights, templateValues) {
    rights = rights || [];
    if(!(rights instanceof Array)) {
      rights = [rights];
    }
    return false;
  };
}]);
