/**
 * Custom Directives
 */
angular.module('MyDirectives',[])
/**
 * HTML5 SignaturePad Directive
 * This directive is intended to place a convas within a form
 * which can then be drawn upon. Once it is drawn updon, it will be
 * considered 'valid'
 *
 * Thanks to Thomas J Bradley for the Signature Pad plugin for jQuery
 * http://thomasjbradley.ca/lab/signature-pad/
 * 
 */
.directive('sigpad', function($timeout){
  return {
    templateUrl: 'views/sigPad.html',   // Use a template in an external file
    restrict: 'E',                      // Must use <sigpad> element to invoke directive
    scope : true,                       // Create a new scope for the directive
    require: 'ngModel',                 // Require the ngModel controller for the linking function
    link: function (scope,element,attr,ctrl) {

      // Attach the Signature Pad plugin to the template and keep a reference to the signature pad as 'sigPadAPI'
      var sigPadAPI = $(element).signaturePad({
                                  drawOnly:true,
                                  lineColour: '#FFF'
                                });
      
      // Clear the canvas when the 'clear' button is clicked
      $(attr.clearbtn).on('click',function (e) {
        sigPadAPI.clearCanvas();
      });
      
      $(element).find('.pad').on('touchend',function (obj) {
        scope.updateModel();
      });

      // when the mouse is lifted from the canvas, set the signature pad data as the model value
      scope.updateModel = function() {
        $timeout(function() {
          ctrl.$setViewValue(sigPadAPI.getSignature());
        });
      };      
      
      // Render the signature data when the model has data. Otherwise clear the canvas.
      ctrl.$render = function() {
        if ( ctrl.$viewValue ) {
          sigPadAPI.regenerate(ctrl.$viewValue);
        } else {
          // This occurs when signatureData is set to null in the main controller
          sigPadAPI.clearCanvas();
        }
      };
      
      // Validate signature pad.
      // See http://docs.angularjs.org/guide/forms for more detail on how this works.
      ctrl.$parsers.unshift(function(viewValue) {
        if ( sigPadAPI.validateForm() ) {
          ctrl.$setValidity('sigpad', true);
          return viewValue;
        } else {
          ctrl.$setValidity('sigpad', false);
          return undefined;
        }
      });      
      
    }
  };
})
/**
 * Regenerate Signature Pad data as Base64 encoded PNG data.
 * This uses the getSignatureImage() function of the Signature Pad API.
 * It only works in modern browsers, and is flaky in IE.
 */
.directive('regensigpad',function() {
  return {
    template: '<img ng-src="{{pic}}" />',
    restrict: 'E',
    scope: {sigdata:'@'},
    link: function (scope,element,attr,ctrl) {
      // When the sigdata attribute changes...
      attr.$observe('sigdata',function (val) {
        // ... create a blank canvas template and attach the signature pad plugin
        var sigPadAPI = $('<div class="sig sigWrapper"><canvas class="pad" width="436" height="120"></canvas></div>').signaturePad({
                          displayOnly: true
                        }); 
        // regenerate the signature onto the canvas
        sigPadAPI.regenerate(val);
        // convert the canvas to a PNG (Newer versions of Chrome, FF, and Safari only.)
        scope.pic = sigPadAPI.getSignatureImage();
      });
    }
  };
});