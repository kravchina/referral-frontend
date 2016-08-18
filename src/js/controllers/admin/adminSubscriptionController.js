angular.module('admin')
    .controller('AdminSubscriptionController', ['$scope', '$state', '$modal', 'Auth', 'Notification', 'Address', 'ModalHandler', 'Practice', 'Subscription', 'ProviderInvitation', 'User', 'UnsavedChanges', 'FREE_TRIAL_PERIOD', 'Logger',
    function ($scope, $state, $modal, Auth, Notification, Address, ModalHandler, Practice, Subscription, ProviderInvitation, User, UnsavedChanges, FREE_TRIAL_PERIOD, Logger) {

        $scope.practice = Practice.get({practiceId: $scope.$parent.auth.practice_id}, function(practice) {
            Logger.log('existing users = ' + JSON.stringify(practice.users));
            $scope.paymentNotification = {
                showTrial: !practice.stripe_customer_id && new Date().getTime() < new Date(practice.subscription_active_until).getTime(),
                showTrialExpired: !practice.stripe_customer_id && new Date().getTime() > new Date(practice.subscription_active_until).getTime(),
                showSubscriptionSuccess: false,
                showSubscriptionCancelled: practice.stripe_customer_id && !practice.stripe_subscription_id && new Date().getTime() < new Date(practice.subscription_active_until).getTime(),
                showSubscriptionExpired: practice.stripe_customer_id && new Date().getTime() > new Date(practice.subscription_active_until).getTime()
            };
            $scope.subscriptionPrice = practice.subscription_price;
            $scope.subscriptionInterval = practice.subscription_interval;
            $scope.locationsNumber = practice.addresses.length;
            $scope.refreshEvents();
        });

        $scope.refreshEvents = function(){
            if($scope.practice.stripe_customer_id){
                $scope.events = Subscription.getEvents({customer_id: $scope.practice.stripe_customer_id});
            }
        };

        $scope.isPremium = function(){
            return $scope.practice.stripe_customer_id && $scope.practice.stripe_subscription_id
        };

        $scope.upgradeDialog = function (interval) {
            var modalInstance = $modal.open({
                templateUrl: 'partials/upgrade_form.html',
                controller: 'UpgradeModalController',
                resolve: {
                    practice_id: function () {
                        return $scope.practice.id;
                    },
                    stripe_subscription_id: function () {
                        return $scope.practice.stripe_subscription_id;
                    },
                    interval: function(){
                        return interval
                    }
                }
            });
            ModalHandler.set(modalInstance);
            modalInstance.result.then(function (practice) {
                // $scope.practice.users.push(user);
                $scope.paymentNotification.showSubscriptionSuccess = true;
                $scope.paymentNotification.showTrial = !practice.stripe_customer_id;
                $scope.paymentNotification.showSubscriptionExpired = false;
                $scope.practice = practice;
                $scope.subscriptionPrice = practice.subscription_price;
                $scope.subscriptionInterval = practice.subscription_interval;
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