var adminModule = angular.module('admin', ['ui.bootstrap', 'angularPayments']);

adminModule.controller('AdminController', ['$scope', '$modal', 'Auth', 'Alert', 'ModalHandler', 'Practice', 'ProviderInvitation', 'User', 'UnsavedChanges', 'FREE_TRIAL_PERIOD',
    function ($scope, $modal, Auth, Alert, ModalHandler, Practice, ProviderInvitation, User, UnsavedChanges, FREE_TRIAL_PERIOD) {


        $scope.alerts = [];

        var currentYear = moment().year();
        $scope.years = [ currentYear, currentYear + 1, currentYear + 2, currentYear + 3, currentYear + 4 ];

        $scope.closeAlert = function (index) {
            Alert.close($scope.alerts, index);
        };

        var auth = Auth.get();
        $scope.providers = User.getInvitees({user_id: auth.id });
        $scope.practice = Practice.get({practiceId: auth.practice_id});

        $scope.practice.$promise.then(function (data) {
            console.log($scope.practice);
            console.log(FREE_TRIAL_PERIOD); 
            $scope.trial_end_date = new Date($scope.practice.created_at);
            $scope.trial_end_date.setDate($scope.trial_end_date.getDate() + FREE_TRIAL_PERIOD)
        });    

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
                            Alert.success($scope.alerts, 'Account was updated successfully!')
                        },
                        function (failure) {
                            Alert.error($scope.alerts, 'An error occurred during account update...')
                        });
                
            } else {
                // form is not dirty, we're just getting out of edit state
                UnsavedChanges.setUnsavedChanges(false);
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
                    console.log(success)
                    Alert.success($scope.alerts, 'Subscription was cancelled successfully!');
                    $scope.practice = success
                },
                function (failure) {
                    Alert.error($scope.alerts, 'An error occurred during cancelling subscription...')
                });
        }

        $scope.usersDialog = function () {
            var modalInstance = $modal.open({
                templateUrl: 'partials/user_form.html',
                controller: 'UserModalController'
            });
            ModalHandler.set(modalInstance);
            modalInstance.result.then(function (user) {
                // $scope.practice.users.push(user);
                $scope.providers.push(user);
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
                $scope.providers.push(provider);
            });
        };

        $scope.deleteUser = function (user) {
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
        };

        $scope.deleteProviderInvitation = function (provider) {
            ProviderInvitation.delete({id: provider.id},
                function (success) {
                    $scope.providers.splice($scope.providers.indexOf(provider), 1);
                },
                function (failure) {
                    Alert.error($scope.alerts, 'An error occurred during provider removal...')
                });
        }

        $scope.roleName = function(is_admin, roles_mask){
            return (roles_mask == 2 ? "Doctor" : "Aux") + (is_admin ? ", Admin" : "")
        }

    }]);