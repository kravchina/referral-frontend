angular.module('registration')
// Just for invited providers to some existing practice or to a new practice
    .controller('RegistrationController', ['$scope', '$location', '$stateParams', '$modal', '$state', 'Notification', 'Auth', 'ModalHandler', 'Practice', 'ProviderInvitation', 'Registration', 'Procedure', 'Referral', 'USER_ROLES',
    function ($scope, $location, $stateParams, $modal, $state, Notification, Auth, ModalHandler, Practice, ProviderInvitation, Registration, Procedure, Referral, USER_ROLES) {
        $scope.showPracticeButtons = true;
        $scope.isResend = false;

        $scope.promo = $stateParams.promo;

        $scope.practiceTypes = Procedure.practiceTypes();

        $scope.roles = [
            USER_ROLES.doctor,
            USER_ROLES.aux];


        $scope.initInvitation = function () {
            if ($scope.promo) {
                $scope.invitation = { roles_mask: USER_ROLES.doctor.mask};
                $scope.practice = {}
            } else {
                $scope.invitation = ProviderInvitation.get({invitation_token: $stateParams.invitation_token},
                    function (success) {
                        Referral.countByInvited({id: $scope.invitation.id},
                        function(success){
                            $scope.invitation.referrals_count = success.count;
                        });
                        if(typeof($scope.invitation.roles_mask) === "undefined" || $scope.invitation.roles_mask === null){
                            $scope.invitation.roles_mask = USER_ROLES.doctor.mask;
                        }
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
                $scope.isNewPractice = true;
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
                $scope.isJoinPractice = true;
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
                        practice: invitation.practice,
                        invitation_token: $stateParams.invitation_token,
                        security_code: $scope.security_code,
                        skip_security_code: invitation.newPracticeId == invitation.practice_id
                    },
                    function (success) {
                        Auth.set({token: success.authentication_token, email: success.email, roles: success.roles, id: success.id, practice_id: success.practice_id});
                        Auth.current_user = success;
                        showResultDialog();
                    },
                    function (failure) {
                        Notification.error(failure.data.errors.message[0]);
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
                    Registration.register_with_promo({
                            user: invitation,
                            practice: practice,
                            security_code: $scope.security_code,
                            skip_security_code: true,
                            promo: $scope.promo
                        },
                        function(success){
                            Auth.set({
                                token: success.user.authentication_token,
                                email: success.user.email,
                                roles: success.user.roles,
                                id: success.user.id,
                                practice_id: success.user.practice_id
                            });
                            Auth.current_user = success.user;
                            showResultDialog();
                            console.log('registered a new account: ' + JSON.stringify(success));
                        },
                        function(fail){
                            Notification.error(fail.data.message);

                        });
                },
                function(error){
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

        $scope.checkEmail = function (email){

            ProviderInvitation.validate({email: email, all: true}, function(success){
                $scope.form.email.$invalid = false;
                $scope.form.email.$valid = true;
                $scope.isResend = false;
            }, function(failure){
                $scope.form.email.$invalid = true;
                $scope.form.email.$valid = false;

                if(failure.data.status == 'registered'){
                    $scope.isResend = false;
                    Notification.error('invitation.email.register');
                } else if(failure.data.status == 'invited') {
                    $scope.isResend = true;
                    $scope.resendProvider = failure.data;
                    Notification.error('invitation.email.invited');
                }
            });
        };

        $scope.resend = function(){
            ProviderInvitation.resend({id: $scope.resendProvider.id}, function(success){
                var modalInstance = $modal.open({
                    templateUrl: 'partials/registration_email_send_message.html',
                    controller: 'RegistrationEmailResendModalController'
                });
                ModalHandler.set(modalInstance);
            }, function(failure){
                Notification.error( failure.data.message[0]);
            });
        };

        $scope.discard = function () {
            $scope.initInvitation();
            $scope.showPracticeButtons = true;
        };

        $scope.initInvitation();
    }])
// Only for users invited to the same practice
    .controller('NewUserController', ['$scope', '$location', '$stateParams', '$modal', '$state', 'Notification', 'Auth', 'ModalHandler', 'Practice', 'ProviderInvitation', 'Registration', 'Logger',
    function ($scope, $location, $stateParams, $modal, $state, Notification, Auth, ModalHandler, Practice, ProviderInvitation, Registration, Logger) {

        $scope.invitation = ProviderInvitation.get({invitation_token: $stateParams.invitation_token},
            function (invitation) {
                invitation.newPracticeId = invitation.practice_id; // in case of user invitation - needs this in order to hide security code field

                Logger.log('invitation.newPracticeId = ' + invitation.newPracticeId);

                $scope.practice = Practice.get({practiceId: invitation.newPracticeId}, function (practice) {
                    Logger.log('received practice info: ' + JSON.stringify($scope.practice));
                });
            },
            function (failure) {
                Notification.error('invitation.invalid');
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
                    Auth.set({token: success.authentication_token, email: success.email, roles: success.roles, id: success.id, practice_id: success.practice_id});
                    Auth.current_user = success;
                    showResultDialog();
                },
                function (failure) {
                    Notification.error(failure.data.errors[0]);
                }
            )
        };

    }]);
