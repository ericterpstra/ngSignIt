'use strict';


var MainCtrl = ngSignItApp.controller('MainCtrl', function($scope,ParseService) {
  $scope.petitions = [{id:1}];
  $scope.saveSignature = function saveSignature() {  
    var sigData = {  firstName: $scope.firstName,
                     lastname: $scope.lastName,
                     signature: $scope.signatureData
                  };

    ParseService.saveSignature(sigData);  
  }

  ParseService.getPetitions(function (results) {
    $scope.petitions = results.models;
    var test = 0;
  })

});
MainCtrl.$inject = ['$scope','ParseService'];
