adminModule.controller('AdminSubscriptionController', ['$scope', '$state', '$modal', 'Auth', 'Alert', 'Address', 'ModalHandler', 'Practice', 'ProviderInvitation', 'User', 'UnsavedChanges', 'FREE_TRIAL_PERIOD', 'Logger',
    function ($scope, $state, $modal, Auth, Alert, Address, ModalHandler, Practice, ProviderInvitation, User, UnsavedChanges, FREE_TRIAL_PERIOD, Logger) {
        $scope.practice = Practice.get({practiceId: $scope.$parent.auth.practice_id}, function(practice) {
            Logger.log('existing users = ' + JSON.stringify(practice.users));
            $scope.paymentNotification = {
                showTrial: practice.trial_period && new Date().getTime() < new Date(practice.subscription_active_until).getTime(),
                showTrialExpired: practice.trial_period && new Date().getTime() > new Date(practice.subscription_active_until).getTime(),
                showSubscriptionExpired: !practice.trial_period && new Date().getTime() > new Date(practice.subscription_active_until).getTime()
            }
        });

        $scope.isPremium = function(){
            return $scope.practice.stripe_customer_id && $scope.practice.stripe_subscription_id
        };

        $scope.upgradeDialog = function () {
            var modalInstance = $modal.open({
                templateUrl: 'partials/upgrade_form.html',
                controller: 'UpgradeModalController',
                resolve: {
                    practice_id: function () {
                        return $scope.practice.id;
                    },
                    stripe_subscription_id: function () {
                        return $scope.practice.stripe_subscription_id;
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

    }]);