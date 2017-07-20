angular.module('admin')
    .controller('AdminSubscriptionController', ['$scope', '$state', '$modal', 'Auth', 'Notification', 'Address', 'ModalHandler', 'Practice', 'Subscription', 'ProviderInvitation', 'User', 'UnsavedChanges', 'FREE_TRIAL_PERIOD', 'Logger',
    function ($scope, $state, $modal, Auth, Notification, Address, ModalHandler, Practice, Subscription, ProviderInvitation, User, UnsavedChanges, FREE_TRIAL_PERIOD, Logger) {

        $scope.practice = Practice.get({practiceId: $scope.$parent.auth.practice_id}, function(practice) {
            Logger.log('existing users = ' + JSON.stringify(practice.users));
            $scope.designation = practice.designation;
//            $scope.paymentNotification = {
//                /*showTrial: !practice.stripe_customer_id && new Date().getTime() < new Date(practice.subscription_active_until).getTime(),
//                showTrialExpired: !practice.stripe_customer_id && new Date().getTime() > new Date(practice.subscription_active_until).getTime(),
//                showSubscriptionSuccess: false,
//                showSubscriptionCancelled: practice.stripe_customer_id && !practice.stripe_subscription_id && new Date().getTime() < new Date(practice.subscription_active_until).getTime(),
//                showSubscriptionExpired: practice.stripe_customer_id && new Date().getTime() > new Date(practice.subscription_active_until).getTime(),
//                */
//                showBasic: !practice.stripe_subscription_id,
//                showMonthly: practice.stripe_subscription_id && practice.subscription_interval === 'month',
//                showAnnual: practice.stripe_subscription_id && practice.subscription_interval === 'year',
//                showDesignation: $scope.designation
//            };
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
                    interval: function () {
                        return interval
                    }
                }
            });
            ModalHandler.set(modalInstance);
            modalInstance.result.then(function (practice) {
                Notification.success('Subscription was changed successfully!');
                $scope.practice = practice;
                $scope.currentPlan = interval;
            });
        };

    }]);