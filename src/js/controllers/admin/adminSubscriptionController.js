angular.module('admin')
    .controller('AdminSubscriptionController', ['$scope', '$state', '$modal', 'Auth', 'Notification', 'Address', 'ModalHandler', 'Practice', 'ProviderInvitation', 'User', 'UnsavedChanges', 'FREE_TRIAL_PERIOD', 'BASE_SUBSCRIPTION_PRICE', 'Logger',
    function ($scope, $state, $modal, Auth, Notification, Address, ModalHandler, Practice, ProviderInvitation, User, UnsavedChanges, FREE_TRIAL_PERIOD, BASE_SUBSCRIPTION_PRICE, Logger) {

        $scope.baseSubscriptionPrice = BASE_SUBSCRIPTION_PRICE;

        $scope.practice = Practice.get({practiceId: $scope.$parent.auth.practice_id}, function(practice) {
            Logger.log('existing users = ' + JSON.stringify(practice.users));
            $scope.paymentNotification = {
                showTrial: practice.trial_period && new Date().getTime() < new Date(practice.subscription_active_until).getTime(),
                showTrialExpired: practice.trial_period && new Date().getTime() > new Date(practice.subscription_active_until).getTime(),
                showSubscriptionSuccess: false,
                showSubscriptionCancelled: !practice.trial_period && !practice.stripe_subscription_id && new Date().getTime() < new Date(practice.subscription_active_until).getTime(),
                showSubscriptionExpired: !practice.trial_period && new Date().getTime() > new Date(practice.subscription_active_until).getTime()
            };

            $scope.locationsNumber = practice.addresses.length;

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
                $scope.paymentNotification.showSubscriptionSuccess = true;
                $scope.paymentNotification.showTrial = practice.trial_period;
                $scope.showSubscriptionExpired = false;
                $scope.practice = practice;
            });
        };

        $scope.cancelSubscription = function () {
            Practice.cancelSubscription({practiceId: $scope.practice.id}, {},
                function (success) {
                    Logger.log(success);
                    Notification.success('Subscription was cancelled successfully!');
                    $scope.practice = success;
                    $scope.paymentNotification.showSubscriptionCancelled = true;
                    $scope.paymentNotification.showSubscriptionSuccess = false;
                },
                function (failure) {
                    Notification.error('An error occurred during cancelling subscription...')
                });
        };

    }]);