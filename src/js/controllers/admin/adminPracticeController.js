angular.module('admin')
    .controller('AdminPracticeController', ['$scope', '$modal', 'ModalHandler', 'Alert', 'Address', 'Practice', 'User', 'FREE_TRIAL_PERIOD', 'UnsavedChanges', 'PhoneFormatter', 'Logger', 'PracticeEditMode',
    function ($scope, $modal, ModalHandler, Alert, Address, Practice, User, FREE_TRIAL_PERIOD, UnsavedChanges, PhoneFormatter, Logger, PracticeEditMode) {

        $scope.PhoneFormatter = PhoneFormatter;

        $scope.practice = Practice.get({practiceId: $scope.$parent.auth.practice_id}, function (practice) {
            Logger.log('existing users = ' + JSON.stringify(practice.users));
            $scope.practiceLocationsNumber = practice.addresses.length;
        });

        $scope.practice.$promise.then(function (data) {
            Logger.log($scope.practice);
            Logger.log(FREE_TRIAL_PERIOD);
            $scope.trial_end_date = new Date($scope.practice.created_at);
            $scope.trial_end_date.setDate($scope.trial_end_date.getDate() + FREE_TRIAL_PERIOD)
        });
        var updatePractice = function (form) {
            Practice.update({practiceId: $scope.practice.id}, {
                    practice: {
                        name: $scope.practice.name,
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
                    $scope.practiceLocationsNumber = success.addresses.length;
                    $scope.practice.addresses = success.addresses;
                    // no UnsavedChanges operations here, we stay on page, callback stays the same, form is now pristine
                    // note: the other tab form might not be pristine here. See #72581022
                    Alert.success($scope.$parent.alerts, 'Account was updated successfully!')
                },
                function (failure) {
                    Alert.error($scope.$parent.alerts, 'An error occurred during account update...')
                });
        };
        var prorate_required = function () {
            return $scope.practice.stripe_subscription_id && $scope.practice.addresses.length != $scope.practiceLocationsNumber;
        };

        $scope.savePractice = function (form) {

            if (form.$dirty && !form.$invalid) {
                Logger.log($scope.practice);
                Logger.log($scope.practice.card_exp_month);

                if (prorate_required()) {
                    var modalInstance = $modal.open({
                        templateUrl: 'partials/subscription_change_notification.html',
                        controller: 'SubscriptionChangeModalController',
                        resolve: {
                            locationsNumber: function () {
                                return $scope.practice.addresses.length;
                            },
                            cancelCallback: function(){
                                return function(){
                                    PracticeEditMode.on();
                                }
                            }
                        }
                    });
                    ModalHandler.set(modalInstance);
                    modalInstance.result.then(function (message) {
                        updatePractice(form);
                    });
                } else {
                    updatePractice(form);
                }
            }
        };

        $scope.addAddress = function () {
            if ($scope.practice.addresses.length < 20) {
                $scope.practice.addresses.push({new: true});
            }
        };

        $scope.removeAddress = function (address) {
            function removeAddressFromList(addressToRemove) {
                $scope.practice.addresses.splice($scope.practice.addresses.indexOf(addressToRemove), 1);
                $scope.practiceLocationsNumber--;
            }

            if (address.id) {
                if ($scope.practice.stripe_subscription_id) {
                    var modalInstance = $modal.open({
                        templateUrl: 'partials/subscription_change_notification.html',
                        controller: 'SubscriptionChangeModalController',
                        resolve: {
                            locationsNumber: function () {
                                return $scope.practice.addresses.length - 1;
                            },
                            cancelCallback: function(){
                                return function(){
                                    //we have nothing to do on cancel here
                                };
                            }
                        }
                    });
                    ModalHandler.set(modalInstance);
                    modalInstance.result.then(function (message) {
                        //removing address if it is persisted on server-side
                        Address.remove({id: address.id}, function (success) {
                            removeAddressFromList(address);

                        });
                    });
                } else {
                    Address.remove({id: address.id}, function (success) {
                        removeAddressFromList(address);

                    });
                }
            } else {
                //removing address if it is not persisted on server-side
                removeAddressFromList(address);
            }
        };

        // in Admin, unsaved changes should depend on forms from all tabs
        UnsavedChanges.setCbHaveUnsavedChanges(function () {
            var narrowedScope = $scope.$$childHead.$$nextSibling; // TODO [ak] dangerous and non-documented. Find something better
            console.log(narrowedScope.practiceForm);
            return narrowedScope.practiceForm.$dirty;
        });

    }]);