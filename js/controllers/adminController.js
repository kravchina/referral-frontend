var adminModule = angular.module('admin', ['ui.bootstrap', 'angularPayments']);

adminModule.controller('AdminController', ['$scope', '$modal', 'Auth', 'Alert', 'Address', 'ModalHandler', 'Practice', 'ProviderInvitation', 'User', 'UnsavedChanges', 'FREE_TRIAL_PERIOD', 'PhoneFormatter', 'Logger',
    function ($scope, $modal, Auth, Alert, Address, ModalHandler, Practice, ProviderInvitation, User, UnsavedChanges, FREE_TRIAL_PERIOD, PhoneFormatter, Logger) {


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
            Logger.log('invitedUsers = ' + JSON.stringify($scope.invitedUsers));
        });

        $scope.practice = Practice.get({practiceId: auth.practice_id}, function(practice) {
            Logger.log('existing users = ' + JSON.stringify(practice.users));
        });

        $scope.practice.$promise.then(function (data) {
            Logger.log($scope.practice);
            Logger.log(FREE_TRIAL_PERIOD);
            $scope.trial_end_date = new Date($scope.practice.created_at);
            $scope.trial_end_date.setDate($scope.trial_end_date.getDate() + FREE_TRIAL_PERIOD)
        });    

        // TODO [ak] refactor bad design: savePractice() does not in fact operate on a single form
        $scope.savePractice = function (form) {
            
            if (form.$dirty && !form.$invalid) {
                Logger.log($scope.practice);
                Logger.log($scope.practice.card_exp_month);

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
                                addresses_attributes: $scope.practice.addresses
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
                    Logger.log(success);
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

        $scope.editDialog = function (editUser) {
            var modalInstance = $modal.open({
                templateUrl: 'partials/edit_user_form.html',
                controller: 'EditUserModalController',
                resolve: {
                    editUser: function () {
                        return editUser;
                    }
                }
            });
            ModalHandler.set(modalInstance);
            modalInstance.result.then(function (user) {
                editUser.is_admin = user.is_admin; //update user's role after editing
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

        $scope.addAddress = function(){
            $scope.practice.addresses.push({new: true});
        };

        $scope.removeAddress = function(address){
            function removeAddressFromList(addressToRemove) {
                $scope.practice.addresses.splice($scope.practice.addresses.indexOf(addressToRemove), 1);
            }

            if (address.id){
                //removing address if it is persisted on server-side
                Address.remove({id: address.id}, function(success){
                    removeAddressFromList(address);

                });
            }else{
                //removing address if it is not persisted on server-side
                removeAddressFromList(address);
            }

        };

        // in Admin, unsaved changes should depend on forms from all tabs
        UnsavedChanges.setCbHaveUnsavedChanges(function() {
            var narrowedScope = $scope.$$childHead.$$nextSibling; // TODO [ak] dangerous and non-documented. Find something better
            return narrowedScope.accountForm.$dirty || narrowedScope.practiceForm.$dirty;
        });
        
    }]);