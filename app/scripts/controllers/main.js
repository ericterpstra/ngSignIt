'use strict';


var MainCtrl = ngSignItApp.controller('MainCtrl', function($scope,ParseService) {

  // Controller Functions...

  $scope.clearData = function() {
    $scope.user = {
      firstName: null,
      lastName: null,
      signature: null,
      email: null
    };
  };

  $scope.saveSignature = function saveSignature() {  
    if ( $scope.sigForm.$valid ) {
      $scope.user.petitionId = $scope.select2;
      ParseService.saveSignature($scope.user, function() {
        $scope.clearData();
      });  
    }
  };

  $scope.pickPetition = function pickPetition(id) {  
    if(id) {
      $scope.petitionDescription = $scope.petitionCollection.get(id).get('Description');
    } else {
      $scope.petitionDescription = "Choose a cause/petition/whatever in the box above, then plop down your name, email address, and John Hancock to show your support."
    }
  };

  $scope.getSignatures = function getSignatures (petitionId) {
    if (petitionId.length > 0){
      ParseService.getSignatures(petitionId,function (results) {
        $scope.$apply(function() {
          $scope.signatureList = results;
        });
      });
    } else {
      $scope.signatureList = [];
    }
  };


  // Do Stuff...

  $scope.signatureList = [];
  $scope.clearData();
  
  ParseService.getPetitions(function (results) {
    $scope.$apply(function() {
      $scope.petitionCollection = results;
      $scope.petitions = results.models;
    });
  });

});
MainCtrl.$inject = ['$scope','ParseService'];
