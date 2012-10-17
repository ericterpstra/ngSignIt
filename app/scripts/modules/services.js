/**
 * DataService Module
 *
 *  Service Provider for Back-end APIs
 */
angular.module('DataServices', []) 
/**
 * Parse Service
 * Use Parse.com as a back-end for the application.
 */
.factory('ParseService', function(){
    // Initialize Parse API and objects. Please don't use this key in your own apps. It won't work anyway.
    Parse.initialize("d46qFYur20F0T5XqD61wGWHtey9z3Q1ouBkm2t3X", "8Mo9iTOBJmmcPwAYcT4EppSBZlQulHn75RUT9Sny");

    // Define Parse Model and Collection for Signature records (firstName, lastName, email, signature, and petitionId)
    var Signature = Parse.Object.extend("Signature");
    var SignatureCollection = Parse.Collection.extend({ model: Signature });

    // Define Parse Model and Collection for Petitions. 
    var Petition = Parse.Object.extend("Petition");
    var PetitionCollection = Parse.Collection.extend({ model: Petition });

    /**
     * ParseService Object
     * This is what is used by the main controller to save and retrieve data from Parse.com.
     * Moving all the Parse.com specific stuff into a service allows me to later swap it out 
     * with another back-end service provider without modifying my controller much, if at all.
     */
    var ParseService = {

      // Retrieve all petitions
      getPetitions : function getPetitions(callback) {
        // Instantiate a petition collection
        var petitions = new PetitionCollection();

        // Use Parse's fetch method (a modified version of backbone.js fetch) to get all the petitions.
        petitions.fetch({
          success: function (results) {
              // Send the petition collection back to the caller if it is succesfully populated. 
              callback(petitions);
          },
          error: function ( results,error) {
              alert("Collection Error: " + error.message);
          }
        });
      },

      // Save the data from the signature form to Parse.com
      saveSignature : function saveSignature(data, callback){
        var sig = new Signature();
        sig.save( data,
                  {
                    success: function (obj) {
                      callback(obj);
                    },
                    error: function (obj, error) {
                      alert("Error: " + error.message);
                    }
                  }
        );
      },

      // Get signature data for a specified petition
      getSignatures : function getSignatures(petitionId, callback) {
        // Create a new Parse Query object in order to search Signature records by petitionId
        var query = new Parse.Query(Signature);
        query.equalTo("petitionId", petitionId);
        // Use the find method to retreive all signatures with the given petitionId
        query.find({
          success: function (results) {
            callback(results);
          },
          error: function (error) {
            alert("Error: " + error.message);
          }
        });
      }
    
    };

    // The factory function returns ParseService, which is injected into controllers.
    return ParseService;
})
/**
 * StackMob Service
 * This is a service to use StackMob as a back-end for the application.
 */
.factory('StackMobService', function(){
    // COMING SOON! Use StacMob instead of Parse.com as a back-end provider.
    // STackmob also bases their javascript API on backbone.js, so most of the data is saved and retrieved 
    // in a manner similar to Parse.com.  It should be fairly trivial for a controller to use one service or the other
    StackMob.init({
      appName: "xxx",
      clientSubdomain: "xxx",
      publicKey: "xxx",
      apiVersion: 0
    });

    /**
     * Service Object
     */
    var StackMobService = {

      saveSignature : function saveSignature(data, callback){
      },

      getSignatures : function(callback) {
      }
    
    };

    // The factory function returns StackMobService, which is injected into controllers.
    return StackMobService;
})
/**
 * DataService is a simple adapter that returns either the Parse Service or StackMob Service.
 * This service is injected into the Main Controller
 */
.factory('DataService', function (ParseService,StackMobService) {
  // Eventually some logic will go here to choose between StackMob and Parse as a backend.
  // Right now we are just using Parse, so ParseService is used as the main DataService
  return ParseService;
});
