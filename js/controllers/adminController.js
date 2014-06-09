var adminModule = angular.module('admin', ['ui.bootstrap', 'angularPayments']);

// stripeResponseHandler = function(status, response){
//     console.log(response);
//     if(response.error) {
//         // there was an error. Fix it.
//     } else {
//         // got stripe token, now charge it or smt
//         token = response.id
//     }
// }
adminModule.controller('AdminController', ['$scope', '$modal', 'Auth', 'Alert', 'Practice', 'Provider', 'User',
    function ($scope, $modal, Auth, Alert, Practice, Provider, User) {
        // set the stripe publishable key
        Stripe.setPublishableKey('pk_test_TAdWKoNc4HgjFknjuuzsb99p');

        $scope.alerts = [];

        var currentYear = moment().year();
        $scope.years = [ currentYear, currentYear + 1, currentYear + 2, currentYear + 3, currentYear + 4 ];

        $scope.closeAlert = function (index) {
            Alert.close($scope.alerts, index);
        };

        var auth = Auth.get();
        $scope.providers = User.getInvitees({user_id: auth.id });
        $scope.practice = Practice.get({practiceId: auth.practice_id});       

        $scope.savePractice = function (form) {
            
            if (form.$dirty && !form.$invalid) {
                console.log($scope.practice);
                console.log($scope.practice.card_exp_month)
                Stripe.card.createToken({
                    number: $scope.practice.card_number,
                    cvc: $scope.practice.card_cvc,
                    exp_month: $scope.practice.card_exp_month,
                    exp_year: $scope.practice.card_exp_year
                }, function(status, response){
                    console.log(response);
                    if(response.error) {
                        // there was an error. Fix it.
                        Alert.push($scope.alerts, 'danger', 'An error occurred during account update...')
                    } else {
                        // got stripe token, now charge it or smt
                        $scope.practice.stripe_token = response.id

                        Practice.update({practiceId: $scope.practice.id}, {
                            practice: {
                                name: $scope.practice.name,
                                card_number: $scope.practice.card_number,
                                card_cvc: $scope.practice.card_cvc,
                                name_on_card: $scope.practice.name_on_card,
                                card_exp_month: $scope.practice.card_exp_month,
                                card_exp_year: $scope.practice.card_exp_year,
                                stripe_token: $scope.practice.stripe_token,
                                salutation: $scope.practice.salutation,
                                account_first_name: $scope.practice.account_first_name,
                                account_middle_initial: $scope.practice.account_middle_initial,
                                account_last_name: $scope.practice.account_last_name,
                                address_attributes: $scope.practice.address
                            }
                        },
                        function (success) {
                            form.$setPristine();
                            Alert.push($scope.alerts, 'success', 'Account was updated successfully!')
                        },
                        function (failure) {
                            Alert.push($scope.alerts, 'danger', 'An error occurred during account update...')
                        });
                    }
                });
            }
        };


        $scope.usersDialog = function () {
            var modalInstance = $modal.open({
                templateUrl: 'partials/user_form.html',
                controller: 'UserModalController'
            });

            modalInstance.result.then(function (user) {
                $scope.practice.users.push(user);
            });
        };

        $scope.inviteDialog = function () {
            var modalInstance = $modal.open({
                templateUrl: 'partials/provider_form.html',
                controller: 'ProviderModalController'
            });

            modalInstance.result.then(function (provider) {
                $scope.providers.push(provider);
            });
        };

        $scope.deleteUser = function (user) {
            User.delete({id: user.id}, function (success) {
                    $scope.practice.users.splice($scope.practice.users.indexOf(user), 1);
                },
                function (failure) {
                    Alert.push($scope.alerts, 'danger', 'An error occurred during user removal...')
                });
        };

        $scope.deleteProvider = function (provider) {
            Provider.delete({id: provider.id},
                function (success) {
                    $scope.providers.splice($scope.providers.indexOf(provider), 1);
                },
                function (failure) {
                    Alert.push($scope.alerts, 'danger', 'An error occurred during provider removal...')
                });
        }

    }]);