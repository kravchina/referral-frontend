var registrationModule = angular.module('registration', []);


// Just for invited providers to some existing practice or to a new practice
registrationModule.controller('RegistrationController', ['$scope', '$location', '$stateParams', '$modal', '$state', 'Alert', 'Auth', 'ModalHandler', 'Practice', 'ProviderInvitation', 'Registration', 'Procedure', 'Promo',
    function ($scope, $location, $stateParams, $modal, $state, Alert, Auth, ModalHandler, Practice, ProviderInvitation, Registration, Procedure, Promo) {
        $scope.alerts = [];
        $scope.showPracticeButtons = true;

        $scope.promo = $stateParams.promo;

        $scope.practiceTypes = Procedure.practiceTypes();


        $scope.initInvitation = function () {
            if ($scope.promo) {
                $scope.invitation = {};
                $scope.practice = {}
            } else {
                $scope.invitation = ProviderInvitation.get({invitation_token: $stateParams.invitation_token},
                    function (success) {
                    },
                    function (failure) {
                        $state.go('signIn', {alreadyRegister: true});
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

        $scope.joinPracticeDialog = function () {
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

        var showResultDialog = function(){
            var modalInstance = $modal.open({
                templateUrl: 'partials/registration_result.html',
                controller: 'RegistrationResultController'
            });
            ModalHandler.set(modalInstance);
            modalInstance.result.then(function (res) {
                $state.go('history');
            });
        };

        // this function is used in case of registration through an invitation
        $scope.register = function (invitation) {
            $scope.submitted = true;
            if ($scope.form.$valid && ($scope.invitation.newPracticeId || $scope.invitation.practice)) {
                invitation.practice_id = invitation.practice.id;
                Registration.save({
                        user: invitation,
                        invitation_token: $stateParams.invitation_token,
                        security_code: $scope.security_code,
                        skip_security_code: invitation.newPracticeId == invitation.practice_id
                    },
                    function (success) {
                        Auth.set({token: success.authentication_token, email: success.email, roles: success.roles, is_admin: success.is_admin, id: success.id, practice_id: success.practice_id});
                        Auth.current_user = success;
                        showResultDialog();
                    },
                    function (failure) {
                        $scope.alerts = [];//reset alerts array, because we need only one error message at a time. Pivotal's ticket #82268450.
                        Alert.error($scope.alerts, 'Error: ' + failure.data.errors[0], true);
                    }
                )
            }
        };

        // this function is used instead of register() in case of registration through promotion
        $scope.createPracticeAndRegister = function (practice, invitation) {
            $scope.submitted = true;
            if ($scope.form.$valid) {
                //we check first, that email is new and was not used for invitation
                ProviderInvitation.validate({email: invitation.email}, function(success){
                    Practice.save({
                            practice: practice,
                            promo: $scope.promo,
                            user: invitation
                        },
                        function (success) {
                            console.log('created practice: ' + JSON.stringify(success));

                            invitation.practice_id = success.id;

                            Registration.save({
                                    user: invitation,
                                    invitation_token: $stateParams.invitation_token,
                                    security_code: $scope.security_code,
                                    skip_security_code: true,
                                    promo: $scope.promo
                                },
                                function (success) {
                                    Auth.set({
                                        token: success.authentication_token,
                                        email: success.email,
                                        roles: success.roles,
                                        is_admin: success.is_admin,
                                        id: success.id,
                                        practice_id: success.practice_id
                                    });
                                    Auth.current_user = success;
                                    showResultDialog();
                                    console.log('registered a new account: ' + JSON.stringify(success));
                                },
                                function (failure) {
                                    $scope.alerts = [];

                                    if (failure.data.errors.email) {
                                        Alert.error($scope.alerts, failure.data.errors.email[0], true);
                                    } else {
                                        Alert.error($scope.alerts, failure.data.errors[0], true);
                                    }
                                }
                            );
                        },
                        function (failure) {
                            $scope.alerts = [];

                            if(failure.data.error === 'user.exists') {
                                Alert.error($scope.alerts, failure.data.error, true);
                            } else {
                                Alert.error($scope.alerts, 'practice.create.failed', true);
                            }
                        });


                }, function(error){
                    if(error.status === 302){
                        var modalInstance = $modal.open({
                            templateUrl: 'partials/invitation_validation_result.html',
                            controller: 'InvitationValidationController',
                            resolve: {
                                invitation: function () {
                                    return error.data;
                                }
                            }

                        });
                        ModalHandler.set(modalInstance);
                        modalInstance.result.then(function (res) {

                        });
                    }
                });


            }

        };

        $scope.discard = function () {
            $scope.initInvitation();
            $scope.showPracticeButtons = true;
        };

        $scope.closeAlert = function (index) {
            Alert.close($scope.alerts, index);
        };

        $scope.initInvitation();
    }]);


// Only for users invited to the same practice
registrationModule.controller('NewUserController', ['$scope', '$location', '$stateParams', '$modal', '$state', 'Alert', 'Auth', 'ModalHandler', 'Practice', 'ProviderInvitation', 'Registration', 'Logger',
    function ($scope, $location, $stateParams, $modal, $state, Alert, Auth, ModalHandler, Practice, ProviderInvitation, Registration, Logger) {
        $scope.alerts = [];

        $scope.invitation = ProviderInvitation.get({invitation_token: $stateParams.invitation_token},
            function (invitation) {
                invitation.newPracticeId = invitation.practice_id; // in case of user invitation - needs this in order to hide security code field

                Logger.log('invitation.newPracticeId = ' + invitation.newPracticeId);

                $scope.practice = Practice.get({practiceId: invitation.newPracticeId}, function (practice) {
                    Logger.log('received practice info: ' + JSON.stringify($scope.practice));
                });
            },
            function (failure) {
                Alert.error($scope.alerts, 'invitation.invalid', true);
            }
        );

        var showResultDialog = function(){
            var modalInstance = $modal.open({
                templateUrl: 'partials/registration_result.html',
                controller: 'RegistrationResultController'
            });
            ModalHandler.set(modalInstance);
            modalInstance.result.then(function (res) {
                $state.go('history');
            });
        };

        $scope.register = function (user) {
            user.practice_id = user.practice.id;
            Registration.save({user: user, invitation_token: $stateParams.invitation_token, security_code: $scope.security_code, skip_security_code: user.newPracticeId == user.practice_id},
                function (success) {
                    Auth.set({token: success.authentication_token, email: success.email, roles: success.roles, is_admin: success.is_admin, id: success.id, practice_id: success.practice_id});
                    Auth.current_user = success;
                    showResultDialog();
                },
                function (failure) {
                    Alert.error($scope.alerts, failure.data.errors[0], true);
                }
            )
        };

        $scope.closeAlert = function (index) {
            Alert.close($scope.alerts, index);
        };
    }]);
