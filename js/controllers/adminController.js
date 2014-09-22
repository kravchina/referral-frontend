var adminModule = angular.module('admin', ['ui.bootstrap', 'angularPayments']);

adminModule.controller('AdminController', ['$scope', '$modal', 'Auth', 'Alert', 'ModalHandler', 'Practice', 'ProviderInvitation', 'User', 'UnsavedChanges', 'FREE_TRIAL_PERIOD', 'PhoneFormatter',
    function ($scope, $modal, Auth, Alert, ModalHandler, Practice, ProviderInvitation, User, UnsavedChanges, FREE_TRIAL_PERIOD, PhoneFormatter) {


        $scope.alerts = [];
        
        $scope.PhoneFormatter = PhoneFormatter;
        
        var currentYear = moment().year();
        $scope.years = [ currentYear, currentYear + 1, currentYear + 2, currentYear + 3, currentYear + 4 ];

        $scope.closeAlert = function (index) {
            Alert.close($scope.alerts, index);
        };

        var auth = $scope.auth = Auth.get();
        $scope.invitedColleagues = [];
        $scope.invitedUsers = [];
        User.getInvitees({user_id: auth.id}, function(allInvitees) {
            allInvitees.map(function(invitation) {
                if (invitation.roles_mask) {  // criteria to tell user invitations apart from colleague invitations
                    $scope.invitedUsers.push(invitation);
                } else {
                    $scope.invitedColleagues.push(invitation);
                }
            });
            console.log('invitedUsers = ' + JSON.stringify($scope.invitedUsers));
        });

        $scope.practice = Practice.get({practiceId: auth.practice_id}, function(practice) {
            console.log('existing users = ' + JSON.stringify(practice.users));
        });

        $scope.practice.$promise.then(function (data) {
            console.log($scope.practice);
            console.log(FREE_TRIAL_PERIOD); 
            $scope.trial_end_date = new Date($scope.practice.created_at);
            $scope.trial_end_date.setDate($scope.trial_end_date.getDate() + FREE_TRIAL_PERIOD)
        });    

        // TODO [ak] refactor bad design: savePractice() does not in fact operate on a single form
        $scope.savePractice = function (form) {
            
            if (form.$dirty && !form.$invalid) {
                console.log($scope.practice);
                console.log($scope.practice.card_exp_month);

                Practice.update({practiceId: $scope.practice.id}, {
                            practice: {
                                name: $scope.practice.name,
                                // card_number: $scope.practice.card_number,
                                // card_cvc: $scope.practice.card_cvc,
                                // name_on_card: $scope.practice.name_on_card,
                                // card_exp_month: $scope.practice.card_exp_month,
                                // card_exp_year: $scope.practice.card_exp_year,
                                // stripe_token: $scope.practice.stripe_token,
                                salutation: $scope.practice.salutation,
                                account_first_name: $scope.practice.account_first_name,
                                account_middle_initial: $scope.practice.account_middle_initial,
                                account_last_name: $scope.practice.account_last_name,
                                account_email: $scope.practice.account_email,
                                address_attributes: $scope.practice.address
                            }
                        },
                        function (success) {
                            form.$setPristine();
                            // no UnsavedChanges operations here, we stay on page, callback stays the same, form is now pristine
                            // note: the other tab form might not be pristine here. See #72581022
                            Alert.success($scope.alerts, 'Account was updated successfully!')
                        },
                        function (failure) {
                            Alert.error($scope.alerts, 'An error occurred during account update...')
                        });
                
            }
        };

        $scope.upgradeDialog = function () {
            var modalInstance = $modal.open({
                templateUrl: 'partials/upgrade_form.html',
                controller: 'UpgradeModalController',
                resolve: {
                    practice_id: function () {
                        return $scope.practice.id;
                    },
                    stripe_customer_id: function () {
                        return $scope.practice.stripe_customer_id;
                    }
                }
            });
            ModalHandler.set(modalInstance);
            modalInstance.result.then(function (practice) {
                // $scope.practice.users.push(user);
                $scope.practice = practice
            });
        };

        $scope.cancelSubscription = function () {
            Practice.cancelSubscription({practiceId: $scope.practice.id}, {},
                function (success) {
                    console.log(success);
                    Alert.success($scope.alerts, 'Subscription was cancelled successfully!');
                    $scope.practice = success
                },
                function (failure) {
                    Alert.error($scope.alerts, 'An error occurred during cancelling subscription...')
                });
        };

        $scope.usersDialog = function () {
            var modalInstance = $modal.open({
                templateUrl: 'partials/user_form.html',
                controller: 'UserModalController'
            });
            ModalHandler.set(modalInstance);
            modalInstance.result.then(function (user) {
                $scope.invitedUsers.push(user);
            });
        };

        $scope.passwordDialog = function (user_id) {
            var modalInstance = $modal.open({
                templateUrl: 'partials/user_password_form.html',
                controller: 'UserPasswordModalController',
                resolve: {
                    id: function () {
                        return user_id;
                    }
                }
            });
            ModalHandler.set(modalInstance);
            modalInstance.result.then(function (user) {
                //$scope.practice.users.push(user);
            });
        };

        $scope.inviteDialog = function () {
            var modalInstance = $modal.open({
                templateUrl: 'partials/provider_form.html',
                controller: 'ProviderModalController'
            });
            ModalHandler.set(modalInstance);
            modalInstance.result.then(function (provider) {
                $scope.invitedColleagues.push(provider);
            });
        };

        $scope.deleteUser = function (user) {
            if (user.status) {
                ProviderInvitation.delete({id: user.id}, function (success) {
                        if(success.msg){
                            Alert.error($scope.alerts, success.msg)
                        }else{
                            $scope.invitedUsers.splice($scope.invitedUsers.indexOf(user), 1);
                        }

                    },
                    function (failure) {
                        Alert.error($scope.alerts, 'An error occurred during invitation removal...')
                    });

            } else {
                User.delete({id: user.id}, function (success) {
                        if(success.msg){
                            Alert.error($scope.alerts, success.msg)
                        }else{
                            $scope.practice.users.splice($scope.practice.users.indexOf(user), 1);
                        }

                    },
                    function (failure) {
                        Alert.error($scope.alerts, 'An error occurred during user removal...')
                    });
            }

        };

        $scope.deleteProviderInvitation = function (provider) {
            ProviderInvitation.delete({id: provider.id},
                function (success) {
                    $scope.invitedColleagues.splice($scope.invitedColleagues.indexOf(provider), 1);
                },
                function (failure) {
                    Alert.error($scope.alerts, 'An error occurred during provider removal...')
                });
        };

        $scope.roleName = function(is_admin, roles_mask){
            return (roles_mask == 2 ? "Doctor" : "Aux") + (is_admin ? ", Admin" : "")
        };

        $scope.securityCodeDialog = function (user_id) {
            var modalInstance = $modal.open({
                templateUrl: 'partials/security_code.html',
                controller: 'SecurityCodeModalController'

            });
            ModalHandler.set(modalInstance);

        };

        // in Admin, unsaved changes should depend on forms from all tabs
        UnsavedChanges.setCbHaveUnsavedChanges(function() {
            var narrowedScope = $scope.$$childHead.$$nextSibling; // TODO [ak] dangerous and non-documented. Find something better
            return narrowedScope.accountForm.$dirty || narrowedScope.practiceForm.$dirty;
        });
        
    }]);