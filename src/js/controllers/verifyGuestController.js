angular.module('guest')
    .controller('VerifyGuestController', ['$scope', '$state', '$stateParams', 'User',
    function($scope, $state, $stateParams, User){

        User.verifyGuest({pid: $stateParams.pid}, function(success) {
            $state.go('verifyGuestSuccess');
        }, function(failure){
            $state.go('error_page', {error_key: failure.data.errors});
        });

}]);