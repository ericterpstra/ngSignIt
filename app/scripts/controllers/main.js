'use strict';


var MainCtrl = ngSignItApp.controller('MainCtrl', function($scope,ParseService) {

  $scope.saveSignature = function saveSignature() {  
    var sigData = {  firstName: $scope.firstName,
                     lastname: $scope.lastName,
                     signature: $scope.signatureData
                  };

    ParseService.saveSignature(sigData);  
  }

});
MainCtrl.$inject = ['$scope','ParseService'];
