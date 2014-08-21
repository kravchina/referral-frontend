var modalsModule = angular.module('modals', ['ui.bootstrap']);

modalsModule.controller('PatientModalController', [ '$scope', '$modalInstance', 'Auth', 'Patient', 'fullname', function ($scope, $modalInstance, Auth, Patient, fullname) {

    /*$scope.patient = patient;*/

    $scope.salutations = ['Mr.', 'Ms.', 'Mrs.', 'Dr.', 'Engr.'];

    space_pos = fullname.indexOf(' ');
    var first_name = '';
    var last_name = '';
    if(fullname != '' && space_pos == -1){
        var first_name = fullname.substr(0, Math.ceil(fullname.length/2));
        var last_name = fullname.substr(Math.ceil(fullname.length/2));
        
    }else{
        var first_name = fullname.substr(0, space_pos);
        var last_name = fullname.substr(space_pos + 1);
    }

    $scope.patient = {'first_name': first_name, 'last_name': last_name};
    

    $scope.ok = function (patient) {
        patient.practice_id = Auth.getOrRedirect().practice_id;
        Patient.save({patient: patient},
            function (success) {
                $modalInstance.close(success);
            },
            function (failure) {
                $scope.success = false;
                $scope.failure = true;
            });
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);

modalsModule.controller('NoteModalController', ['$scope', '$modalInstance', 'Note', function ($scope, $modalInstance, Note) {
    $scope.ok = function (note) {
        //nothing to do, we cant save note right here because at this stage referral doesn't exist. We can only add new note to the list on the parent page (create referral) and save simultaneously with referral.
        if (note == undefined){
            $modalInstance.dismiss('cancel');
        }else{
            $modalInstance.close(note);
        }
        
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

}]);

modalsModule.controller('ProviderModalController', ['$scope', '$modalInstance', 'ProviderInvitation', 'Alert', 'Auth', function ($scope, $modalInstance, ProviderInvitation, Alert, Auth) {
    $scope.alerts = [];
    $scope.ok = function (provider) {
        provider.inviter_id = Auth.getOrRedirect().id;
        ProviderInvitation.save({provider_invitation: provider}, function (success) {
            $modalInstance.close(success);
        }, function (failure) {
            Alert.error($scope.alerts, 'Error: ' + failure.data.message);
        });
    };
    $scope.closeAlert = function (index) {
        Alert.close($scope.alerts, index);
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);

modalsModule.controller('PracticeModalController', ['$scope', '$modalInstance', 'Alert', 'Practice', 'Procedure', function ($scope, $modalInstance, Alert, Practice, Procedure) {
    $scope.alerts = [];
    $scope.practiceTypes = Procedure.practiceTypes();
    $scope.ok = function (practice) {
        Practice.save({practice: practice},
            function (success) {
                $modalInstance.close(success);
            },
            function (failure) {
                Alert.error($scope.alerts, 'Can\'t create practice.');
            });
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);

modalsModule.controller('UserModalController', ['$scope', '$modalInstance', 'ProviderInvitation', 'Auth', 'Alert', function ($scope, $modalInstance, ProviderInvitation, Auth, Alert) {
    $scope.result = {};
    $scope.alerts = [];
    
    $scope.ok = function (user) {
        user.practice_id = Auth.getOrRedirect().practice_id;
        user.inviter_id = Auth.getOrRedirect().id;
        ProviderInvitation.save({provider_invitation: user}, function (success) {
            $modalInstance.close(success);
        },  function (failure) {
            console.log(failure);
            Alert.error($scope.alerts, 'Error: ' + failure.data.message);
            console.log($scope.alerts);
        });
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);

modalsModule.controller('UpgradeModalController', ['$scope', '$modalInstance', 'ProviderInvitation', 'Auth', 'Alert', 'Practice', 'STRIPE_KEY', 'practice_id', function ($scope, $modalInstance, ProviderInvitation, Auth, Alert, Practice, STRIPE_KEY, practice_id) {
    $scope.result = {};
    $scope.alerts = [];

    var currentYear = moment().year();
    $scope.years = [ currentYear, currentYear + 1, currentYear + 2, currentYear + 3, currentYear + 4 ];

    console.log(practice_id)
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
                        console.log(payment_info)

                        Practice.update({practiceId: practice_id}, {
                                        practice: {

                                            card_number: payment_info.card_number,
                                            card_cvc: payment_info.card_cvc,
                                            name_on_card: payment_info.name_on_card,
                                            card_exp_month: payment_info.card_exp_month,
                                            card_exp_year: payment_info.card_exp_year,
                                            stripe_token: payment_info.stripe_token,
                                            
                                        }
                                    },
                                    function (success) {
                                        console.log(success)
                                        Alert.success($scope.alerts, 'Account was upgraded successfully!');
                                        $modalInstance.close(success);
                                    },
                                    function (failure) {
                                        Alert.error($scope.alerts, 'An error occurred during account update...')
                                    });
                    }
                });
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);

modalsModule.controller('UserPasswordModalController', ['$scope', '$modalInstance', 'User', 'Auth', 'Alert', 'id', function ($scope, $modalInstance, User, Auth, Alert, id) {
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
            $modalInstance.close(success);
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
        $modalInstance.dismiss('cancel');
    };
}]);

