angular.module('dentalLinks')
    .controller('SubscriptionChangeController', ['$scope', '$modal', 'ModalHandler', 'Practice',
        function ($scope, $modal, ModalHandler, Practice) {

            $scope.practice = Practice.get({practiceId: practiceId}, function(practice) {
                Logger.log('existing users = ' + JSON.stringify(practice.users));
            });

            $scope.currentPlan = 'basic';

            $scope.cancelSubscription = function () {
                //change to basic plan
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
        }
    ]);
