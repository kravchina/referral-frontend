angular.module('registration')
// Just for invited providers to some existing practice or to a new practice
    .controller('RegistrationController', ['$scope', '$location', '$stateParams', '$modal', '$state', 'Notification', 'Auth', 'ModalHandler', 'Practice', 'ProviderInvitation', 'Registration', 'Procedure', 'Referral', 'USER_ROLES',
    function ($scope, $location, $stateParams, $modal, $state, Notification, Auth, ModalHandler, Practice, ProviderInvitation, Registration, Procedure, Referral, USER_ROLES) {
        $scope.practice = {};
        $scope.isResend = false;

        $scope.promo = $stateParams.promo;

        $scope.practiceTypes = Procedure.practiceTypes();

        $scope.roles = [
            USER_ROLES.doctor,
            USER_ROLES.aux
        ];


        $scope.initInvitation = function () {
            if ($scope.promo) {
                $scope.invitation = { roles_mask: USER_ROLES.doctor.mask};
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
        $scope.register = function (practice, invitation) {
            $scope.submitted = true;
            if(!invitation.practice_id) {
                $scope.setSpecialty(practice, invitation);
            }
            if ($scope.form.$valid) {
                //invitation.practice_id = invitation.practice.id;
                Registration.save({
                        user: invitation,
                        practice: practice,
                        invitation_token: $stateParams.invitation_token,
                        security_code: '',
                        skip_security_code: true
                    },
                    function (success) {
                        Auth.set({token: success.authentication_token, email: success.email, roles: success.roles, id: success.id, practice_id: success.practice_id});
                        Auth.current_user = success;
                        if (invitation.practice_id) {
                            showResultDialog();
                        } else {
                            $state.go('change_subscription', {fromRegistration: true});
                        }
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
            $scope.setSpecialty(practice, invitation);
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
                            var modalInstance = $modal.open({
                                templateUrl: 'partials/promo_registration_result.html',
                                controller: 'PromoRegistrationResultController'
                            });
                            ModalHandler.set(modalInstance);
                            modalInstance.result.then(function (res) {
                                $state.go('signIn');
                            });
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
                    Notification.error('invitation.email.invited', {resend: function(){
                        ProviderInvitation.resend({id: $scope.resendProvider.id}, function(success){
                            var modalInstance = $modal.open({
                                templateUrl: 'partials/registration_email_send_message.html',
                                controller: 'RegistrationEmailResendModalController'
                            });
                            ModalHandler.set(modalInstance);
                        }, function(failure){
                            Notification.error(failure.data.message[0]);
                        });
                    }});
                }
            });
        };

        $scope.setSpecialty = function (practice, invitation) {
            if(!invitation.specialty_type_id) {
                $scope.practiceTypes.forEach(function(item){
                    if(item.code == 'general_dentistry') {
                        invitation.specialty_type_id = item.id;
                    }
                });
            }
            if(practice.multi_specialty) {
                $scope.practiceTypes.forEach(function(item){
                    if(item.code == 'multi_specialty') {
                        practice.practice_type_id = item.id;
                    }
                });
            } else {
                practice.practice_type_id = invitation.specialty_type_id;
            }
            if(invitation.roles_mask == USER_ROLES.aux.mask) {
                invitation.specialty_type_id = '';
            }
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
        };

        $scope.initInvitation();
    }])
