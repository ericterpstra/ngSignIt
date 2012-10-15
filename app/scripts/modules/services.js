/**
 * parseService Module
 *
 *  Wrapper for Parse.com JavaScript API
 */
angular.module('DataServices', []) 
.factory('ParseService', function(){
    // Initialize Parse API and objects.
    Parse.initialize("d46qFYur20F0T5XqD61wGWHtey9z3Q1ouBkm2t3X", "8Mo9iTOBJmmcPwAYcT4EppSBZlQulHn75RUT9Sny");
    var Signature = Parse.Object.extend("Signature");
    var PetitionCollection = Parse.Collection.extend({ model: Petition });

    /**
     * Service Object
     */
    var ParseService = {

      getPetitions : function getPetitions(callback) {
        var petitions = new PetitionCollection();

        petitions.fetch({
          success: function (results) {
              callback(results);
          },
          error: function ( results,error) {
              alert("Collection Error: " + error.message);
          }
        });
      },

      saveSignature : function getCats(data, callback){
        var sig = new Signature();
            sig.save( data,
                      {
                        success: function (obj) {
                          callback(obj);
                        },
                        error: function (obj) {
                          alert("Error: " + obj.message);
                        }
                      }
            );
      },

      getSignatures : function(callback) {
      }
    
    };

    // The factory function returns CatsService, which is injected into controllers.
    return ParseService;
})
.factory('StackMobService', function(){
    // COMING SOON!
    
    /**
     * Service Object
     */
    var StackMobService = {

      saveSignature : function getCats(data, callback){
      },

      getSignatures : function(callback) {
      }
    
    };

    // The factory function returns CatsService, which is injected into controllers.
    return StackMobService;
});;
