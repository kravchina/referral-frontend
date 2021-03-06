angular.module('dentalLinks')
    .controller('SubscriptionChangeController', ['$scope', '$uibModal', 'ModalHandler', 'Practice', 'Auth', 'Notification', '$stateParams',
        function ($scope, $uibModal, ModalHandler, Practice, Auth, Notification, $stateParams) {
            $scope.fromRegistration = ($stateParams.fromRegistration === 'true');
            $scope.practice = Practice.get({practiceId: Auth.get().practice_id}, function(practice) {
                $scope.currentPlan = $scope.practice.stripe_subscription_id ? $scope.practice.subscription_interval : 'basic';
            });


            $scope.cancelSubscription = function () {
                //change to basic plan
                if ($scope.currentPlan !== 'basic') {
                    var modalInstance = $uibModal.open({
                        templateUrl: 'partials/downgrade_confirmation.html',
                        controller: 'DowngradeModalController'
                    });
                    ModalHandler.set(modalInstance);
                    modalInstance.result.then(function (practice) {
                        Practice.cancelSubscription({practiceId: $scope.practice.id}, {},
                            function (success) {
                                Notification.success('Subscription was downgraded to basic successfully!');
                                $scope.currentPlan = 'basic';
                                $scope.practice = success;
                            },
                            function (failure) {
                                Notification.error('An error occurred during downgrading subscription...')
                            });
                    });
                }
            };

            $scope.upgradeDialog = function (interval) {
                if ($scope.currentPlan !== interval) {
                    var modalInstance = $uibModal.open({
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
                }
            };
        }
    ]);
