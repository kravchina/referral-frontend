angular.module('guest')
    .controller('GuestRegistrationController', ['$scope', '$state', 'Guest', 'Alert', '$modal', 'ModalHandler',
    function($scope, $state, Guest, Alert, $modal, ModalHandler){
        $scope.guest = {};
        $scope.alerts = [];

        $scope.continue = function(guest) {
            guest.practice_pid = $state.params.practice_pid;
            Guest.validateEmail({email: guest.email}, function(success){
                $scope.alerts = [];
                Guest.save({guest: guest}, function(success){
                    var modalInstance = $modal.open({
                        templateUrl: 'partials/guest/guest_email_verification_modal.html',
                        controller: 'GuestEmailVerificationModalController'
                    });
                    ModalHandler.set(modalInstance);
                }, function(failure){
                    console.log('failure: ', failure);
                });
            }, function(failure){
                $scope.alerts = [];
                Alert.error($scope.alerts, failure.data.message, true);
            });
        };
    }]);
