angular.module('guest')
    .controller('ActivateGuestReferralController', ['$scope', '$state', '$stateParams', 'User',
    function($scope, $state, $stateParams, User){

        User.activateGuestReferral({activation_token: $stateParams.activation_token}, function(success) {
            $state.go('guestReferralActivated');
        }, function(failure){
            $state.go('error_page', {error_key: failure.data.errors});
        });

}]);