adminModule.controller('AdminPracticeController', ['$scope', 'Alert', 'Address', 'Practice', 'User', 'FREE_TRIAL_PERIOD', 'UnsavedChanges', 'PhoneFormatter', 'Logger',
    function ($scope, Alert, Address, Practice, User, FREE_TRIAL_PERIOD, UnsavedChanges, PhoneFormatter, Logger) {
    	
        $scope.PhoneFormatter = PhoneFormatter;

        $scope.practice = Practice.get({practiceId: $scope.$parent.auth.practice_id}, function(practice) {
            Logger.log('existing users = ' + JSON.stringify(practice.users));
        });

        $scope.practice.$promise.then(function (data) {
            Logger.log($scope.practice);
            Logger.log(FREE_TRIAL_PERIOD);
            $scope.trial_end_date = new Date($scope.practice.created_at);
            $scope.trial_end_date.setDate($scope.trial_end_date.getDate() + FREE_TRIAL_PERIOD)
        });  
        // TODO [ak] refactor bad design: savePractice() does not in fact operate on a single form
        $scope.savePractice = function (form) {
            
            if (form.$dirty && !form.$invalid) {
                Logger.log($scope.practice);
                Logger.log($scope.practice.card_exp_month);

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
                                addresses_attributes: $scope.practice.addresses
                            }
                        },
                        function (success) {
                            form.$setPristine();
                            // no UnsavedChanges operations here, we stay on page, callback stays the same, form is now pristine
                            // note: the other tab form might not be pristine here. See #72581022
                            Alert.success($scope.$parent.alerts, 'Account was updated successfully!')
                        },
                        function (failure) {
                            Alert.error($scope.$parent.alerts, 'An error occurred during account update...')
                        });
                
            }
        };

        $scope.addAddress = function(){
            $scope.practice.addresses.push({new: true});
        };

        $scope.removeAddress = function(address){
            function removeAddressFromList(addressToRemove) {
                $scope.practice.addresses.splice($scope.practice.addresses.indexOf(addressToRemove), 1);
            }

            if (address.id){
                //removing address if it is persisted on server-side
                Address.remove({id: address.id}, function(success){
                    removeAddressFromList(address);

                });
            }else{
                //removing address if it is not persisted on server-side
                removeAddressFromList(address);
            }

        };

        // in Admin, unsaved changes should depend on forms from all tabs
        UnsavedChanges.setCbHaveUnsavedChanges(function() {
            var narrowedScope = $scope.$$childHead.$$nextSibling; // TODO [ak] dangerous and non-documented. Find something better
            console.log(narrowedScope.practiceForm);
            return narrowedScope.practiceForm.$dirty;
        });

    }]);