angular.module('guest')
    .controller('GuestRegistrationController', ['$scope', '$state', 'Guest', 'Alert', '$modal', 'ModalHandler',
    function($scope, $state, Guest, Alert, $modal, ModalHandler){
        $scope.guest = {};
        $scope.alerts = [];

        $scope.continue = function(guest) {
            $scope.alerts = [];
            Guest.register({guest_user: guest, dest_practice_public_id: $state.params.practice_pid}, function(success){
                var modalInstance = $modal.open({
                    templateUrl: 'partials/guest/guest_email_verification_modal.html',
                    controller: 'GuestEmailVerificationModalController'
                });
                ModalHandler.set(modalInstance);
            }, function(failure){
                $scope.alerts = [];
                Alert.error($scope.alerts, failure.data.message[0], true);
            });
        };
    }]);
