var registrationModule = angular.module('registration', []);


// Just for invited providers to some existing practice or to a new practice
registrationModule.controller('RegistrationController', ['$scope', '$location', '$stateParams', '$modal', 'Alert', 'Auth', 'ModalHandler', 'Practice', 'ProviderInvitation', 'Registration', 'Procedure', 'Spinner',
    function ($scope, $location, $stateParams, $modal, Alert, Auth, ModalHandler, Practice, ProviderInvitation, Registration, Procedure, Spinner) {
        $scope.alerts = [];
        $scope.showPracticeButtons = true;

        $scope.promo = $stateParams.promo;

        $scope.practiceTypes = Procedure.practiceTypes();


        $scope.initInvitation = function() {
            if ($scope.promo) {
                $scope.invitation = {}
            } else {
                $scope.invitation = ProviderInvitation.get({invitation_token: $stateParams.invitation_token},
                    function (success) {
                    },
                    function (failure) {
                        Alert.error($scope.alerts, 'Something happened... Probably, invitation is invalid or was used already.', true);
                    }
                );
            }
        };

        $scope.practiceDialog = function () {
            var modalInstance = $modal.open({
                templateUrl: 'partials/practice_form.html',
                controller: 'PracticeModalController'
            });
            ModalHandler.set(modalInstance);
            modalInstance.result.then(function (practice) {
                $scope.invitation.newPracticeId = practice.id;
                $scope.invitation.practice = practice;
                $scope.showPracticeButtons = false;
            });
        };

        $scope.joinPracticeDialog = function() {
            var modalInstance = $modal.open({
                templateUrl: 'partials/join_practice_form.html',
                controller: 'JoinPracticeModalController'
            });
            ModalHandler.set(modalInstance);
            modalInstance.result.then(function (res) {
                $scope.invitation.practice_id = res.practice.id;
                $scope.invitation.practice = res.practice;
                $scope.security_code = res.securitycode;
                $scope.showPracticeButtons = false;
            });
        };

        $scope.register = function (user) {
            user.practice_id = user.practice.id;
            Registration.save({user: user, invitation_token: $stateParams.invitation_token, security_code: $scope.security_code, skip_security_code: user.newPracticeId == user.practice_id},
                function (success) {
                    Auth.set({token: success.authentication_token, email: success.email, roles: success.roles, is_admin: success.is_admin, id: success.id, practice_id: success.practice_id});
                    Auth.current_user = success;
                    $scope.registrationSuccessful = true;
                },
                function (failure) {
                    $scope.alerts = [];//reset alerts array, because we need only one error message at a time. Pivotal's ticket #82268450.
                    Alert.error($scope.alerts, 'Error during registration.', true);
                }
            )
        };

        $scope.discard = function() {
            $scope.initInvitation();
            $scope.showPracticeButtons = true;
        };

        $scope.closeAlert = function (index) {
            Alert.close($scope.alerts, index);
        };

        $scope.initInvitation();
    }]);


// Only for users invited to the same practice
registrationModule.controller('NewUserController', ['$scope', '$location', '$stateParams', '$modal', 'Alert', 'Auth', 'ModalHandler', 'Practice', 'ProviderInvitation', 'Registration', 'Logger',
    function ($scope, $location, $stateParams, $modal, Alert, Auth, ModalHandler, Practice, ProviderInvitation, Registration, Logger) {
        $scope.alerts = [];

        $scope.invitation = ProviderInvitation.get({invitation_token: $stateParams.invitation_token},
            function (invitation) {
                invitation.newPracticeId = invitation.practice_id; // in case of user invitation - needs this in order to hide security code field

                Logger.log('invitation.newPracticeId = ' + invitation.newPracticeId);

                $scope.practice = Practice.get({practiceId: invitation.newPracticeId}, function(practice) {
                    Logger.log('received practice info: ' + JSON.stringify($scope.practice));
                });
            },
            function (failure) {
                Alert.error($scope.alerts, 'Something happened... Probably, invitation is invalid or was used already.', true);
            }
        );

        $scope.register = function (user) {
            user.practice_id = user.practice.id;
            Registration.save({user: user, invitation_token: $stateParams.invitation_token, security_code: $scope.security_code, skip_security_code: user.newPracticeId == user.practice_id},
                function (success) {
                    Auth.set({token: success.authentication_token, email: success.email, roles: success.roles, is_admin: success.is_admin, id: success.id, practice_id: success.practice_id});
                    Auth.current_user = success;
                    $scope.registrationSuccessful = true;
                },
                function (failure) {
                    Alert.error($scope.alerts, 'Error during registration.', true);
                }
            )
        };

        $scope.closeAlert = function (index) {
            Alert.close($scope.alerts, index);
        };
    }]);
