angular.module('guest')
    .controller('VerifyGuestController', ['$scope', '$state', '$stateParams', 'User', '$modal', 'ModalHandler', '$location',
    function($scope, $state, $stateParams, User, $modal, ModalHandler, $location){
        $scope.isVerified = false;

        User.verifyGuest({pid: $stateParams.pid}, function(success) {
            $scope.isVerified = true;
        }, function(failure){
            $state.go('error_page', {error_key: failure.data.errors});
        });

}]);