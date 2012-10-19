/**
 * DataService Module
 *
 *  A collection of services that provide a variety of back-end options for saving
 *  and retrieving data.  StackMob.com and Parse.com are Backend-as-a-Service companies.
 *  They provide easy to use databases for mobile and HTML5 applications.
 */
angular.module('DataServices', []) 
/**
 * Parse Service
 * Use Parse.com as a back-end for the application.
 */
.factory('ParseService', function(){
    // Initialize Parse API and objects. Please don't use this key in your own apps. It won't work anyway.
    Parse.initialize("<PLEASE USE YOUR OWN APP KEY>", "<PLEASE USE YOUR OWN API KEY>");

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
      name: "Parse",
      
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
    // Init the StackMob API. This information is provided by the StackMob app dashboard
    StackMob.init({
      appName: "ngsignit",
      clientSubdomain: "<PLEASE USE YOUR OWN SUBDOMAIN>",
      publicKey: "<PLEASE USE YOUR OWN PUBLICKEY>",
      apiVersion: 0
    });

    // Define StackMob Model and Collection for Signature records (firstName, lastName, email, signature, and petitionId)
    var Signature = StackMob.Model.extend( {schemaName:"signature"} );
    var SignatureCollection = StackMob.Collection.extend( { model: Signature } );

    // Define StackMob Model and Collection for Petitions. 
    var Petition = StackMob.Model.extend( {schemaName:"petition"} );
    var PetitionCollection = StackMob.Collection.extend( { model: Petition } );

    /**
     * Service Object
     */
    var StackMobService = {
      name: "StackMob",
      
      getPetitions : function getPetitions(callback) {
        // Instantiate a petition collection
        var petitions = new PetitionCollection();
        // Createa  new StackMob Query object.  This will be empty, so all records will be retrieved.
        var q = new StackMob.Collection.Query();

        // Use StackMob's fetch method (a modified version of backbone.js fetch) to get all the petitions.
        petitions.query(q, {
          success: function (results) {
              // The results from StackMob are returned as an array of Model objects.
              // The Main Controller expects a Collection, so add the objects to the collection 
              // before sending results back to the caller.
              callback(petitions.add(results));
          },
          error: function ( results,error) {
              alert("Collection Error: " + error.message);
          }
        });        
      },     

      saveSignature : function saveSignature(data, callback){
				var sigToSave = new Signature();

        // StackMob only allows lowercase for class names and data attributes.
        // The app was already written using camelCase before adding the StackMob adapter
        // Translate the camelCase object to a StackMob object
				sigToSave.set({
					firstname: data.firstName,
					lastname: data.lastName,
					petitionid: data.petitionId,
					email: data.email,
					signature: JSON.stringify(data.signature) //Also, StackMob does not allow arrays of objects, so we need to stringify the signature data and save it to a 'String' data field.
				});

        // Then save, as usual.
				sigToSave.save({},{
					success: function(result) {
						callback(result);
					},
					error: function(obj, error) {
						alert("Error: " + error.message);
					}
				});
      },

      getSignatures : function getSignatures(petitionId, callback) {
				var signatures = new SignatureCollection();
				var q = new StackMob.Collection.Query();
        // We will need to adjust the StackMob results to be compatable with our Main Controller code.
        // signatureArray will be an array of Signature Models.
				var signatureArray = [];

        // Create the query object to match signatures on petitionId
				q.equals('petitionid',petitionId);

        // Execute the query via the StackMob API. This calls the server.
				signatures.query(q,{
					success: function(collection) {
            // Iterate over the results, and translate the object to work with the Main Controller.
						collection.each(function(item) {
							item.set({
                // The stringified signature must be converted back to an array of objects
								signature: JSON.parse(item.get('signature')),
                // lower case attributes must be converted to camelCase
								firstName: item.get('firstname'),
								lastName: item.get('lastname')
							});
							signatureArray.push(item);
						});
						callback(signatureArray);	
					},
					error: function(obj,error) {
						alert("Error: " + error.message);
					}
				});

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
  // Instantiate our Models and Collections.
  var Signature = Backbone.Model.extend();
  var SignatureCollection = Backbone.Collection.extend({model:Signature});

  var Petition = Backbone.Model.extend();
  var PetitionCollection = Backbone.Collection.extend({model:Petition});

  var pet1 = new Petition();
  var pet2 = new Petition();
  var signatures = new SignatureCollection();
  var petitions = new PetitionCollection();

  // Create some petitions to use in the application
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

  // Add the petitions to the PetitionCollection object
  petitions.add([ pet1, pet2 ]);

  // Create a service
  BackboneService = {
      name: "Backbone",
       
      // Retrieve all petitions
      getPetitions : function getPetitions(callback) {
        // Create a delay, otherwise Angular complains in the callback when using $apply
        $timeout(function(){
          callback(petitions);
        });
      },     

      saveSignature : function saveSignature(data, callback){
        var sigToAdd = new Signature();
        
        // Create a new instance of Signature to add to the Signature Collection.
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
        // Use underscore.js 'where' function to find all objects who's petitionId attribute matches the selected petitionId
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
  // Use the BackboneService by default
  var serviceToUse = BackboneService;

  // StackMob apps must be hosted on the stackmob server, or be run locally using the stackmob runner, which uses port 4567
  if ( $location.absUrl().indexOf("stackmob") > 0 || $location.absUrl().indexOf("4567") > 0 ) serviceToUse = StackMobService;

  // If 'parse' appears in the path, use the Parse.com service instead
  if ( $location.path() === '/parse' ) serviceToUse = ParseService;

  return serviceToUse;
});
