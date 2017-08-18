angular.module('guest')
    .controller('VerifyGuestController', ['$scope', '$state', '$stateParams', 'User', '$modal', 'ModalHandler', '$location',
    function($scope, $state, $stateParams, User, $modal, ModalHandler, $location){
        $scope.message = '';

        User.verifyGuest({pid: $stateParams.pid}, function(success) {
            $scope.message = 'Success verified.';
            console.log('verifyGuest', success);
        }, function(failure){
            $state.go('error_page', {error_key: failure.data.errors});
        });

}]);