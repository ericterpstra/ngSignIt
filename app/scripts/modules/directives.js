angular.module('MyDirectives',[]).directive('sigpad', function($timeout){
  return {
    templateUrl: 'views/sigPad.html',
    restrict: 'E',
    scope : true,
    require: 'ngModel',
    link: function (scope,element,attr,ctrl) {
      var sigPadAPI = $(element).signaturePad({
                                  drawOnly:true,
                                  lineColour: '#FFF'
                                });
      
      $(attr.clearbtn).on('click',function (e) {
        sigPadAPI.clearCanvas();
      });
      
      scope.updateModel = function() {
        $timeout(function() {
          console.log('updateModel', scope);
          ctrl.$setViewValue(sigPadAPI.getSignature());
        });
      };      
      
      ctrl.$render = function() {
        console.log('render', ctrl.$viewValue);
        if ( ctrl.$viewValue ) {
          sigPadAPI.regenerate(ctrl.$viewValue);
        } else {
          sigPadAPI.clearCanvas();
        }
      };
      
      // Validate signature pad.
      ctrl.$parsers.unshift(function(viewValue) {
        console.log('validating', viewValue);
        if ( sigPadAPI.validateForm() ) {
          // it is valid
          console.log('valid');
          ctrl.$setValidity('sigpad', true);
          return viewValue;
        } else {
          // it is invalid, return undefined (no model update)
          console.log('invalid');
          ctrl.$setValidity('sigpad', false);
          return undefined;
        }
      });      
      
    }
  };
});