var registrationModule = angular.module('registration', []);

registrationModule.controller('RegistrationController', ['$scope', '$location', '$stateParams', '$modal', 'Alert', 'Auth', 'ModalHandler', 'Practice', 'ProviderInvitation', 'Registration', 'Spinner',
    function ($scope, $location, $stateParams, $modal, Alert, Auth, ModalHandler, Practice, ProviderInvitation, Registration, Spinner) {
        $scope.alerts = [];

        $scope.user = ProviderInvitation.get({invitation_token: $stateParams.invitation_token}, function (success) {
            },
            function (failure) {
                Alert.error($scope.alerts, 'Something happened... Probably, invitation is invalid or was used already.')
            }
        );

        $scope.findPractice = function (searchValue) {
            Spinner.hide(); //workaround that disables spinner to avoid flicker.
            return Practice.searchPractice({search: searchValue }).$promise.then(function (res) {
                Spinner.show();  //workaround that disables spinner to avoid flicker.
                return res;
            });
        };

        $scope.practiceDialog = function () {
            var modalInstance = $modal.open({
                templateUrl: 'partials/practice_form.html',
                controller: 'PracticeModalController'
            });
            ModalHandler.set(modalInstance);
            modalInstance.result.then(function (practice) {
                $scope.user.practice = practice;
            });
        };

        $scope.register = function (user) {
            user.practice_id = user.practice.id;
            Registration.save({user: user, invitation_token: $stateParams.invitation_token},
                function (success) {
                    Auth.set({token: success.authentication_token, email: success.email, roles: success.roles, id: success.id, practice_id: success.practice_id});
                    Auth.current_user = success;
                    $scope.registrationSuccessful = true;
                },
                function (failure) {
                    Alert.error($scope.alerts, 'Error during registration.')
                }
            )
        }
    }]);
