var dentalLinksControllers = angular.module('dentalLinksControllers', ['ui.bootstrap']);

dentalLinksControllers.controller('LoginController', ['$scope', '$window', '$location', 'Login',
    function ($scope, $window, $location, Login) {
        $scope.authenticated = $window.sessionStorage.token ? true : false;
        $scope.email = $window.sessionStorage.email;
        $scope.login = function (user) {   /*{'user': {'email': user.email, 'password': user.password }}*/
            Login.login({'user': {'email': user.email, 'password': user.password }},
                function (success) {
                    $window.sessionStorage.token = success.token;
                    $window.sessionStorage.email = user.email;
                    $scope.email = user.email;
                    $scope.message = 'Successful login. Welcome!';
                    $scope.authenticated = true;
                    $location.path('/referral');
                    $scope.success = true;
                    $scope.failure = false;
                },
                function (failure) {
                    delete $window.sessionStorage.token;
                    delete $window.sessionStorage.email;
                    $scope.message = 'Error: invalid username or password';
                    $scope.authenticated = false;

                    $scope.success = false;
                    $scope.failure = true;
                });
        };
        $scope.logout = function () {
            Login.logout(function () {
                    $scope.email = null;
                    $scope.message = null;
                    $scope.isAuthenticated = false;
                    delete $window.sessionStorage.token;
                    delete $window.sessionStorage.email;
                    $location.path('/login');
                }
            );

        };
    }]);

dentalLinksControllers.controller('ReferralsController', ['$scope', 'Practice', 'Patient', 'Referral', '$modal', function ($scope, Practice, Patient, Referral, $modal) {

    $scope.patients = Patient.query();

    $scope.practices = Practice.query();

    $scope.model = {referral: {}, practice: {}};

    $scope.createReferral = function (model) {

        $scope.create_referral_result = Referral.save(model,
            function (data) {
                $scope.patients = Patient.query();
                $scope.practices = Practice.query();

                $scope.success = true;
                $scope.failure = false;
            },
            function (data) {
                $scope.failure = true;
                $scope.success = false;

            });

    };


    $scope.patientDialog = function () {

        var modalInstance = $modal.open({
            templateUrl: 'partials/patient_form.html',
            controller: 'PatientModalController'/*,
            resolve: {
                items: function () {
                    return $scope.items;
                }
            }*/
        });

        modalInstance.result.then(function (patient) {
            $scope.patients.push(patient);
            $scope.model.referral.patient_id = patient.id;
        });
    };

    $scope.practiceDialog = function(){
        var modalInstance = $modal.open({
            templateUrl: 'partials/practice_form.html',
            controller: 'PracticeModalController'
        });

        modalInstance.result.then(function (practice_invite) {
            $scope.practices.push(practice_invite);
            $scope.model.practice.practice_id = practice_invite.id;
        });
    }
}]);

dentalLinksControllers.controller('PatientModalController', [ '$scope', '$modalInstance', 'Patient', function ($scope, $modalInstance, Patient) {

    /*$scope.patient = patient;*/

    $scope.ok = function (patient) {
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


dentalLinksControllers.controller('PracticeModalController', ['$scope', '$modalInstance', 'PracticeInvitation', function ($scope, $modalInstance, PracticeInvitation){
    $scope.ok = function (practice_invite) {
        PracticeInvitation.save({practice: practice_invite},
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

//not used now
dentalLinksControllers.controller('UsersController', ['$scope', 'Practice', function ($scope, Practice) {
    $scope.roles = [
        {'mask': 0, 'name': 'admin'},
        {'mask': 2, 'name': 'doctor'},
        {'mask': 4, 'name': 'aux'}
    ];
    $scope.practices = Practice.query();
}]);

dentalLinksControllers.controller('PasswordsController', ['$scope', '$routeParams', 'Password', function ($scope, $routeParams, Password) {
    $scope.requestPasswordReset = function (user) {
        Password.reset({'user': user},
            function (result) {
                $scope.success = true;
                $scope.failure = false;
            },
            function (result) {
                $scope.failure = true;
                $scope.success = false;

            })
    };
    $scope.initial = true;
    $scope.success = false;
    $scope.changePassword = function (model) {


        model.reset_password_token = $routeParams.reset_password_token;
        Password.change({'user': model, 'format': 'json'},
            function (success_result) {
                $scope.success = true;
                $scope.failure = false;
            },
            function (error_result) {
                $scope.success = false;
                $scope.failure = true;
            });
    };
}]);


dentalLinksControllers.controller('ReferralsViewController', ['$scope', '$routeParams', 'Referral', function ($scope, $routeParams, Referral) {
    $scope.referral = Referral.get({id: $routeParams.referral_id});
    $scope.acceptReferral = function (referral) {
        Referral.updateStatus({id: referral.id }, {status: 'accepted'},
            function (success) {
                referral.status = 'accepted';
                $scope.acceptSuccess = true;
                $scope.failure = false;
            },
            function (failure) {
                $scope.acceptSuccess = false;
                $scope.failure = true;
            });

    };

    $scope.rejectReferral = function (referral) {
        Referral.updateStatus({id: referral.id}, {status: 'rejected'},
            function (success) {
                referral.status = 'rejected';
                $scope.acceptSuccess = true;
                $scope.failure = false;

            },
            function (failure) {
                $scope.acceptSuccess = false;
                $scope.failure = true;

            });
    };

    $scope.completeReferral = function (referral) {
        Referral.updateStatus({id: referral.id }, {status: 'completed'},
            function (success) {
                referral.status = 'completed';
                $scope.completeSuccess = true;
                $scope.failure = false;
            },
            function (failure) {
                $scope.completeSuccess = false;
                $scope.failure = true;
            });

    };
}]);
