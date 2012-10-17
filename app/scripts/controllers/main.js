'use strict';

/**
 * This is the main controller for the application.  There is only one right now,
 * given the simplistic nature of the application.  
 *
 */
var MainCtrl = ngSignItApp.controller('MainCtrl', function($scope,DataService) {

  /**
   *  Controller Functions
   */

  // Clear the form fields and scope data
  $scope.clearData = function() {
    $scope.user = {
      firstName: null,
      lastName: null,
      signature: null,
      email: null
    };
  };

  // Change handler for the select2 list of petitions
  $scope.pickPetition = function pickPetition(id) {  
    // Check to see if a valid petition is selected
    if(id) {
      // Show the description of the selected petition and enable the form
      // Use the 'get' method from backbone.js collection to get the proper petition, 
      // then use the model's 'get' method to get the Description field data. 
      $scope.petitionDescription = $scope.petitionCollection.get(id).get('Description');
      $scope.formDisabled = false;
    } else {
      // If the default selection in the select2 control is chosen, then reset everything.
      $scope.petitionDescription = "Choose a cause / petition / whatever in the box above, then plop down your name, email address, and John Hancock below to show your support."
      $scope.formDisabled = true;
      $scope.clearData();
    }
  };

  // Called on startup, and whenever the list needs refreshing.
  $scope.getSignatures = function getSignatures (petitionId) {
    if (petitionId.length > 0){
      // Call the service and fetch the list of signatures that match the given petition ID
      DataService.getSignatures(petitionId,function (results) {
        $scope.$apply(function() {
          // Apply the results to the signatureList model so it will refresh the table in the view
          $scope.signatureList = results;
        });
      });
    } else {
      // Clear the list if an invalid petition is chosen
      $scope.signatureList = [];
    }
  };

  // Click handler for the Save button. Saves the form to the back-end service.
  $scope.saveSignature = function saveSignature() {  
    // Check for validity. AngularJS will set $valid == true if all form requirements are met.
    if ( $scope.sigForm.$valid ) {
      // Save the selected petition ID along with the form data.
      $scope.user.petitionId = $scope.select2;
      // Call the saveSignature method on the service module
      DataService.saveSignature($scope.user, function() {
        // When the service call is finished, clear the form and reload the signature list.
        $scope.clearData();
        $scope.getSignatures($scope.select2);
      });  
    }
  };


  /**
   * On Startup...
   */

  // Set defaults and clear the form
  $scope.signatureList = [];
  $scope.clearData();
  $scope.formDisabled = true;

  // Fetch the list of petitions from the back-end service
  DataService.getPetitions(function (results) {
    $scope.$apply(function() {
      $scope.petitionCollection = results;
      $scope.petitions = results.models;
    });
  });

});
MainCtrl.$inject = ['$scope','ParseService'];
