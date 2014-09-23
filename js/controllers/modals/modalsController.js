var modalsModule = angular.module('modals', ['ui.bootstrap']);

modalsModule.controller('PatientModalController', [ '$scope', '$modalInstance', 'Auth', 'ModalHandler', 'Patient', 'fullname', function ($scope, $modalInstance, Auth, ModalHandler, Patient, fullname) {

    /*$scope.patient = patient;*/

    $scope.salutations = ['Mr.', 'Ms.', 'Mrs.', 'Dr.', 'Engr.'];

    var spacePosition = fullname.lastIndexOf(' '); //lastIndexOf is needed for names with several words, like Jean Francois Moullin, where Jean Francois is a name and Moullin is a surname
    var first_name = '';
    var last_name = '';
    if(fullname != '' && spacePosition == -1){
        first_name = fullname;
    }else{
        first_name = fullname.substr(0, spacePosition);
        last_name = fullname.substr(spacePosition + 1);
    }

    $scope.patient = {'first_name': first_name, 'last_name': last_name};
    

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

modalsModule.controller('ProviderModalController', ['$scope', '$modalInstance', 'ModalHandler', 'ProviderInvitation', 'Alert', 'Auth', function ($scope, $modalInstance, ModalHandler, ProviderInvitation, Alert, Auth) {
    $scope.alerts = [];
    $scope.ok = function (provider) {
        provider.inviter_id = Auth.getOrRedirect().id;
        ProviderInvitation.save({provider_invitation: provider}, function (success) {
            ModalHandler.close($modalInstance,success);
        }, function (failure) {
            Alert.error($scope.alerts, 'Error: ' + failure.data.message);
        });
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

modalsModule.controller('UserModalController', ['$scope', '$modalInstance', 'ModalHandler', 'ProviderInvitation', 'Auth', 'Alert', function ($scope, $modalInstance, ModalHandler, ProviderInvitation, Auth, Alert) {
    $scope.result = {};
    $scope.alerts = [];
    
    $scope.ok = function (user) {
        user.practice_id = Auth.getOrRedirect().practice_id;
        user.inviter_id = Auth.getOrRedirect().id;
        ProviderInvitation.save({provider_invitation: user}, function (success) {
            ModalHandler.close($modalInstance,success);
        },  function (failure) {
            console.log(failure);
            $.each(failure.data, function(key, value){
                Alert.error($scope.alerts, 'Error: ' + key + " " + value[0]);
            });
            
            console.log($scope.alerts);
        });
    };
    $scope.cancel = function () {
        ModalHandler.dismiss($modalInstance);
    };
}]);

modalsModule.controller('UpgradeModalController', ['$scope', '$modalInstance', 'ModalHandler', 'ProviderInvitation', 'Auth', 'Alert', 'Practice', 'STRIPE_KEY', 'practice_id', 'stripe_customer_id', function ($scope, $modalInstance, ModalHandler, ProviderInvitation, Auth, Alert, Practice, STRIPE_KEY, practice_id, stripe_customer_id) {
    $scope.result = {};
    $scope.alerts = [];

    var currentYear = moment().year();
    $scope.years = [ currentYear, currentYear + 1, currentYear + 2, currentYear + 3, currentYear + 4 ];

    $scope.stripe_customer_id = stripe_customer_id;
    console.log($scope.stripe_customer_id);
    // set the stripe publishable key
    Stripe.setPublishableKey(STRIPE_KEY);

    $scope.ok = function (payment_info) {
        Stripe.card.createToken({
                    number: payment_info.card_number,
                    cvc: payment_info.card_cvc,
                    exp_month: payment_info.card_exp_month,
                    exp_year: payment_info.card_exp_year
                }, function(status, response){
                    console.log(response);
                    if(response.error) {
                        // there was an error. Fix it.
                        Alert.error($scope.alerts, 'An error occurred during account update...')
                    } else {
                        // got stripe token, now charge it or smt
                        payment_info.stripe_token = response.id;
                        console.log(payment_info);

                        Practice.update({practiceId: practice_id}, {
                                        practice: {
                                            name_on_card: payment_info.name_on_card,
                                            stripe_token: payment_info.stripe_token
                                        }
                            },
                                    function (success) {
                                        console.log(success);
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

modalsModule.controller('UserPasswordModalController', ['$scope', '$modalInstance', 'ModalHandler', 'User', 'Auth', 'Alert', 'id', function ($scope, $modalInstance, ModalHandler, User, Auth, Alert, id) {
    $scope.result = {};
    $scope.alerts = [];
    console.log(id);
    $scope.ok = function (user) {
        
        if(user.password != user.password_confirmation){
            Alert.error($scope.alerts, 'Error: Password does not mactch');
            return;
        }

        User.changePassword({id: id}, {new_password: user.password}, function (success) {
            console.log(success);
            ModalHandler.close($modalInstance,success);
        },  function (failure) {
            console.log(failure);
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

