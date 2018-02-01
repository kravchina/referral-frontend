angular.module('admin')
    .controller('AdminPracticeController', ['$scope', '$uibModal', 'ModalHandler', 'Notification', 'Address', 'Practice', 'FREE_TRIAL_PERIOD', 'UnsavedChanges', 'Logger', 'PracticeEditMode', 'Procedure', 'ApiKey', 'clipboard',
    function ($scope, $uibModal, ModalHandler, Notification, Address, Practice, FREE_TRIAL_PERIOD, UnsavedChanges, Logger, PracticeEditMode, Procedure, ApiKey, clipboard) {

        $scope.showWarning = false;
        $scope.currentPracticeType = {};
        $scope.practiceTypes = Procedure.practiceTypes({'include_procedures': false});
        $scope.practice = Practice.get({practiceId: $scope.$parent.auth.practice_id}, function (practice) {
            Logger.log('existing users = ' + JSON.stringify(practice.users));
            $scope.currentPracticeType = practice.practice_type;
            $scope.practiceLocationsNumber = practice.addresses.length;
        });

        $scope.practice.$promise.then(function (data) {
            Logger.log($scope.practice);
            Logger.log(FREE_TRIAL_PERIOD);
            $scope.trial_end_date = new Date($scope.practice.created_at);
            $scope.trial_end_date.setDate($scope.trial_end_date.getDate() + FREE_TRIAL_PERIOD);
        });
        var updatePractice = function (form) {
            Practice.update({practiceId: $scope.practice.id}, {
                    practice: {
                        name: $scope.practice.name,
                        practice_type_id: $scope.practice.practice_type.id,
                        addresses_attributes: $scope.practice.addresses
                    }
                },
                function (success) {
                    var newAddressNotification = '';
                    $scope.practice.addresses.forEach(function(address){
                        if(typeof(address.new) !== 'undefined' && address.new) {
                            newAddressNotification = ' All users in this practice are now associated with new location. Please edit user settings to change location assignments if necessary.';
                        }
                    });
                    form.$setPristine();
                    $scope.currentPracticeType = $scope.practice.practice_type;
                    $scope.showWarning = false;
                    $scope.practiceLocationsNumber = success.addresses.length;
                    $scope.practice.addresses = success.addresses;
                    // no UnsavedChanges operations here, we stay on page, callback stays the same, form is now pristine
                    // note: the other tab form might not be pristine here. See #72581022
                    Notification.success('Account was updated successfully!' + newAddressNotification);
                },
                function (failure) {
                    Notification.error('An error occurred during account update...');
                });
        };
        var prorate_required = function () {
            return $scope.practice.stripe_subscription_id && $scope.practice.addresses.length != $scope.practiceLocationsNumber;
        };

        $scope.changePracticeType = function(newValue){
            if($scope.currentPracticeType.code === newValue.code){
                $scope.showWarning = false;
            } else {
                if($scope.currentPracticeType.code !== 'multi_specialty' && newValue.code === 'multi_specialty') {
                    $scope.showWarning = 'first_warning';
                } else {
                    $scope.showWarning = 'second_warning';
                }
            }
        };

        $scope.savePractice = function (form) {

            if (form.$dirty && !form.$invalid) {
                Logger.log($scope.practice);
                Logger.log($scope.practice.card_exp_month);

                if (prorate_required()) {
                    var modalInstance = $uibModal.open({
                        templateUrl: 'partials/subscription_change_notification.html',
                        controller: 'SubscriptionChangeModalController',
                        resolve: {
                            locationsNumber: function () {
                                return $scope.practice.addresses.length;
                            },
                            subscriptionPrice: function () {
                                return $scope.practice.subscription_price;
                            },
                            basePrice: function(){
                                return $scope.practice.base_price;
                            },
                            subscriptionInterval: function () {
                                return $scope.practice.subscription_interval;
                            },
                            cancelCallback: function () {
                                return function () {
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

        $scope.addApiKey = function(practice){
           ApiKey.generate({ practice_id: practice.id},{} ,function(success){
               practice.api_keys.push(success)
           }, function(failure){
               Notification.error(failure.data.error? failure.data.error : "Error: can't create API key")
           });
        };

        $scope.removeApiKey = function (apiKey) {
            ApiKey.remove({id: apiKey.id}, function (success) {
                $scope.practice.api_keys.forEach(function (current_key, index, array) {
                    if (current_key.id === apiKey.id && current_key.api_key === apiKey.api_key) {
                        array.splice(index, 1);
                    }
                });
            }, function (error) {
                Notification.error("Error: can't remove API key");
            });
        };

        $scope.copyToClipboard = function(value, message){
            clipboard.copyText(value);
            Notification.info(message + ' <b>' + value + '</b> was copied to clipboard');
        };

        $scope.changeSendUsageStatistics = function(value) {
            Practice.update({practiceId: $scope.practice.id}, {
                    practice: {
                        send_usage_statistics: value,
                        addresses_attributes: $scope.practice.addresses
                    }
                },
                function (success) {
                    Notification.success('Account was updated successfully!');
                },
                function (failure) {
                    Notification.error('An error occurred during account update...');
                });
        };


        $scope.removeAddress = function (address) {
            function removeAddressFromList(addressToRemove) {
                $scope.practice.addresses.splice($scope.practice.addresses.indexOf(addressToRemove), 1);
                $scope.practiceLocationsNumber--;
            }

            if (address.id) {
                if ($scope.practice.stripe_subscription_id) {
                    var modalInstance = $uibModal.open({
                        templateUrl: 'partials/subscription_change_notification.html',
                        controller: 'SubscriptionChangeModalController',
                        resolve: {
                            locationsNumber: function () {
                                return $scope.practice.addresses.length - 1;
                            },
                            subscriptionPrice: function () {
                                return $scope.practice.subscription_price;
                            },
                            subscriptionInterval: function () {
                                return $scope.practice.subscription_interval;
                            },
                            basePrice: function(){
                                return $scope.practice.base_price;
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
            return $scope.practiceForm.$dirty;
        });

    }]);