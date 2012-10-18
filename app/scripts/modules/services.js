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
    var Signature = Parse.Object.extend("signature");
    var SignatureCollection = Parse.Collection.extend({ model: Signature });

    // Define Parse Model and Collection for Petitions. 
    var Petition = Parse.Object.extend("petition");
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

    // Define StackMob Model and Collection for Signature records (firstName, lastName, email, signature, and petitionId)
    var Signature = StackMob.Object.extend( {schemaName:"signature"} );
    var SignatureCollection = StackMob.Collection.extend( { model: Signature } );

    // Define StackMob Model and Collection for Petitions. 
    var Petition = StackMob.Object.extend( {schemaName:"petition"} );
    var PetitionCollection = StackMob.Collection.extend( { model: Petition } );

    /**
     * Service Object
     */
    var StackMobService = {

      getPetitions : function getPetitions(callback) {
        // Instantiate a petition collection
        var petitions = new PetitionCollection();
        var q = new StackMob.Collection.Query();

        // Use StackMob's fetch method (a modified version of backbone.js fetch) to get all the petitions.
        petitions.query(q, {
          success: function (results) {
              // Send the petition collection back to the caller if it is succesfully populated. 
              callback(petitions.add(results));
          },
          error: function ( results,error) {
              alert("Collection Error: " + error.message);
          }
        });        
      },     

      saveSignature : function saveSignature(data, callback){
      },

      getSignatures : function getSignatures(petitionId, callback) {
      }
    
    };

    // The factory function returns StackMobService, which is injected into controllers.
    return StackMobService;
})
/**
 * Local, non-persistent data service.
 * Because Backbone.js is baked into Stackmob and Parse, we can use it natively in our application.
 * This service allows the application to operate without a backend. Once the application refreshes, 
 * all the signatures disappear. 
 */
.factory('BackboneService', function ($timeout) {
  var Signature = Backbone.Model.extend();
  var SignatureCollection = Backbone.Collection.extend({model:Signature});

  var Petition = Backbone.Model.extend();
  var PetitionCollection = Backbone.Collection.extend({model:Petition});

  var pet1 = new Petition();
  var pet2 = new Petition();
  var signatures = new SignatureCollection();
  var petitions = new PetitionCollection();

  pet1.set({
    id: "8n37f7s",
    title: "NASA Should Start Mining The Moon to Fund Itself",
    description: "NASA is way too expensive. It should take all of its rockets and shuttles, go to the moon, dig up expensive metals and minerals, and bring them back. They could then sell everything to raise money to send people to Mars. Like a bake sale. Only with moon rocks."
  });

  pet2.set({
    id: "9ns764mg",
    title: "Create a protective habitat for refugee cows.",
    description: "Brave cows who escape from their captors live a life of fear and anxiety. They are always hiding, and always on the run.  A protective sanctuary is needed to protect the brave bovine that want a life of freedom and prosperity."
  });

  petitions.add([ pet1, pet2 ]);

  BackboneService = {
      
      // Retrieve all petitions
      getPetitions : function getPetitions(callback) {
        $timeout(function(){
          callback(petitions);
        });
      },     

      saveSignature : function saveSignature(data, callback){
        var sigToAdd = new Signature();
        
        sigToAdd.set({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          signature: data.signature,
          petitionId: data.petitionId
        });

        signatures.add(sigToAdd);

        $timeout(function() {
          callback(sigToAdd);
        })
      },

      getSignatures : function getSignatures(petitionId, callback) {
        var sigSubset = signatures.where({petitionId:petitionId});
        $timeout(function(){
          callback(sigSubset);
        });
      }
  };
  return BackboneService
})
/**
 * DataService is a simple adapter that returns either the Parse Service, StackMob Service,
 * or single-session Backbone service.
 * This service is injected into the Main Controller
 */
.factory('DataService', function (ParseService,StackMobService,BackboneService,$location) {
  var serviceToUse = BackboneService;

  if ( $location.absUrl().indexOf("stackmob") ) serviceToUse = BackboneService;
  if ( $location.path() === '/parse' ) serviceToUse = ParseService;

  return useParse ? ParseService : BackboneService;
});
