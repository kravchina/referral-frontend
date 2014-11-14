var modalsModule = angular.module('modals', ['ui.bootstrap']);

modalsModule.controller('PatientModalController', [ '$scope', '$modalInstance', 'Auth', 'ModalHandler', 'Patient', 'fullname', function ($scope, $modalInstance, Auth, ModalHandler, Patient, fullname) {

    /*$scope.patient = patient;*/

    $scope.salutations = ['Mr.', 'Ms.', 'Mrs.', 'Dr.', 'Engr.'];

    if (fullname) {
        var spacePosition = fullname.lastIndexOf(' '); //lastIndexOf is needed for names with several words, like Jean Francois Moullin, where Jean Francois is a name and Moullin is a surname
        var first_name = '';
        var last_name = '';
        if (fullname != '' && spacePosition == -1) {
            first_name = fullname;
        } else {
            first_name = fullname.substr(0, spacePosition);
            last_name = fullname.substr(spacePosition + 1);
        }
        $scope.patient = {'first_name': first_name, 'last_name': last_name};
    }

    $scope.ok = function (patient) {
        patient.practice_id = Auth.getOrRedirect().practice_id;
        Patient.save({patient: patient},
            function (success) {
                ModalHandler.close($modalInstance, success);
            },
            function (failure) {
                $scope.success = false;
                $scope.failure = true;
            });
    };

    $scope.cancel = function () {
        ModalHandler.dismiss($modalInstance);

    };
}]);

modalsModule.controller('NoteModalController', ['$scope', '$modalInstance', 'ModalHandler', function ($scope, $modalInstance, ModalHandler) {
    $scope.ok = function (note) {
        //nothing to do, we cant save note right here because at this stage referral doesn't exist. We can only add new note to the list on the parent page (create referral) and save simultaneously with referral.
        if (note == undefined){
            ModalHandler.dismiss($modalInstance);
        }else{
            ModalHandler.close($modalInstance,note);
        }
        
    };
    $scope.cancel = function () {
        ModalHandler.dismiss($modalInstance);
    };

}]);

modalsModule.controller('ProviderModalController', ['$scope', '$modalInstance', 'ModalHandler', 'ProviderInvitation', 'Alert', 'Auth', 'Spinner', function ($scope, $modalInstance, ModalHandler, ProviderInvitation, Alert, Auth, Spinner) {
    $scope.alerts = [];
    $scope.model = {};
    $scope.$watch( //we need only one-way updates from typeahead, otherwise typeahead works incorrectly
        function () {
            return $scope.model.existingProvider;
        }, function (newVal, oldVal, scope) {
            if (newVal) {
                $scope.model.provider = {id: newVal.id, first_name: newVal.first_name, email: newVal.email, last_name: newVal.last_name};
            }
        });
    $scope.ok = function (provider) {
        provider.inviter_id = Auth.getOrRedirect().id;
        var resultHandlers = {success: function (success) {
            ModalHandler.close($modalInstance, success);
        }, failure: function (failure) {
            Alert.error($scope.alerts, 'Error: ' + failure.data.message);
        }};

        ProviderInvitation.save({provider_invitation: provider}, resultHandlers.success, resultHandlers.failure);
    };
    $scope.closeAlert = function (index) {
        Alert.close($scope.alerts, index);
    };
    $scope.cancel = function () {
        ModalHandler.dismiss($modalInstance);
    };
}]);

modalsModule.controller('PracticeModalController', ['$scope', '$modalInstance', 'ModalHandler','Alert', 'Practice', 'Procedure', function ($scope, $modalInstance, ModalHandler, Alert, Practice, Procedure) {
    $scope.alerts = [];
    $scope.practiceTypes = Procedure.practiceTypes();
    $scope.ok = function (practice) {
        Practice.save({practice: practice},
            function (success) {
                ModalHandler.close($modalInstance,success);
            },
            function (failure) {
                Alert.error($scope.alerts, 'Can\'t create practice.');
            });
    };

    $scope.cancel = function () {
        ModalHandler.dismiss($modalInstance);
    };
}]);

modalsModule.controller('JoinPracticeModalController', ['$scope', '$modalInstance', 'ModalHandler','Alert', 'Practice', 'Spinner', function ($scope, $modalInstance, ModalHandler, Alert, Practice, Spinner) {
    $scope.alerts = [];
    $scope.findPractice = function (searchValue) {
        Spinner.hide(); //workaround that disables spinner to avoid flicker.
        return Practice.searchPractice({search: searchValue }).$promise.then(function (res) {
            Spinner.show();  //workaround that disables spinner to avoid flicker.
            return res;
        });
    };

    $scope.ok = function (practice, securitycode) {
        $modalInstance.close({'practice': practice, 'securitycode': securitycode});
    };

    $scope.cancel = function () {
        ModalHandler.dismiss($modalInstance);
    };
}]);

modalsModule.controller('UserModalController', ['$scope', '$modalInstance', 'ModalHandler', 'ProviderInvitation', 'Auth', 'Alert', 'Logger', function ($scope, $modalInstance, ModalHandler, ProviderInvitation, Auth, Alert, Logger) {
    $scope.result = {};
    $scope.alerts = [];
    
    $scope.ok = function (user) {
        user.practice_id = Auth.getOrRedirect().practice_id;
        user.inviter_id = Auth.getOrRedirect().id;
        ProviderInvitation.save({provider_invitation: user}, function (success) {
            ModalHandler.close($modalInstance,success);
        },  function (failure) {
            Logger.log(failure);
            $.each(failure.data, function(key, value){
                Alert.error($scope.alerts, 'Error: ' + key + " " + value[0]);
            });
            
            Logger.log($scope.alerts);
        });
    };
    $scope.cancel = function () {
        ModalHandler.dismiss($modalInstance);
    };
}]);

modalsModule.controller('UpgradeModalController', ['$scope', '$modalInstance', 'ModalHandler', 'ProviderInvitation', 'Auth', 'Alert', 'Practice', 'Logger', 'STRIPE_KEY', 'practice_id', 'stripe_customer_id', function ($scope, $modalInstance, ModalHandler, ProviderInvitation, Auth, Alert, Practice, Logger, STRIPE_KEY, practice_id, stripe_customer_id) {
    $scope.result = {};
    $scope.alerts = [];

    var currentYear = moment().year();
    $scope.years = [ currentYear, currentYear + 1, currentYear + 2, currentYear + 3, currentYear + 4 ];

    $scope.stripe_customer_id = stripe_customer_id;
    Logger.log($scope.stripe_customer_id);
    // set the stripe publishable key
    Stripe.setPublishableKey(STRIPE_KEY);

    $scope.ok = function (payment_info) {
        Stripe.card.createToken({
                    number: payment_info.card_number,
                    cvc: payment_info.card_cvc,
                    exp_month: payment_info.card_exp_month,
                    exp_year: payment_info.card_exp_year
                }, function(status, response){
                    Logger.log(response);
                    if(response.error) {
                        // there was an error. Fix it.
                        Alert.error($scope.alerts, 'An error occurred during account update...')
                    } else {
                        // got stripe token, now charge it or smt
                        payment_info.stripe_token = response.id;
                        Logger.log(payment_info);

                        Practice.update({practiceId: practice_id}, {
                                        practice: {
                                            name_on_card: payment_info.name_on_card,
                                            stripe_token: payment_info.stripe_token
                                        }
                            },
                                    function (success) {
                                        Logger.log(success);
                                        Alert.success($scope.alerts, 'Account was upgraded successfully!');
                                        ModalHandler.close($modalInstance,success);
                                    },
                                    function (failure) {
                                        Alert.error($scope.alerts, 'An error occurred during account update...')
                                    });
                    }
                });
    };
    $scope.cancel = function () {
        ModalHandler.dismiss($modalInstance);
    };
}]);

modalsModule.controller('EditUserModalController', ['$scope', '$modalInstance', 'ModalHandler', 'User', 'Auth', 'Alert', 'Logger', 'user', function ($scope, $modalInstance, ModalHandler, User, Auth, Alert, Logger, currentUser) {
    $scope.result = {};
    $scope.alerts = [];
    Logger.log(currentUser.id);
    $scope.user = {is_admin: currentUser.is_admin};//for now we need only is_admin property to be set
    $scope.ok = function (user) {
        
        if(user.password != user.password_confirmation){
            Alert.error($scope.alerts, 'Error: Password does not mactch');
            return;
        }

        User.update({id: currentUser.id}, {user: user}, function (success) {
            Logger.log(success);
            ModalHandler.close($modalInstance,success);
        },  function (failure) {
            Logger.log(failure);
            if(failure.data.password){
                Alert.error($scope.alerts, 'Error: Password ' + failure.data.password[0]);
            }else{
                Alert.error($scope.alerts, 'Error: ' + failure.data.message);
            }
            
        });
    };
    $scope.cancel = function () {
        ModalHandler.dismiss($modalInstance);
    };
}]);

modalsModule.controller('SecurityCodeModalController', ['$scope', '$modalInstance', 'ModalHandler', 'Auth', 'SecurityCode', function ($scope, $modalInstance, ModalHandler, Auth, SecurityCode) {
    $scope.securityCode = SecurityCode.get({practice_id: Auth.get().practice_id});
    $scope.cancel = function () {
        ModalHandler.dismiss($modalInstance);
    };
}]);

