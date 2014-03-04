var dentalLinksControllers = angular.module('dentalLinksControllers', []);

var serverUrl = 'http://localhost:3000';

post_request = function (http, action, data, options, success_callback, error_callback) {
    http.post(serverUrl + action, data, options).success(success_callback).error(error_callback)
};

get_request = function (http, action, options, success_callback, error_callback) {
    http.get(serverUrl + action, options).success(success_callback).error(error_callback);
};


dentalLinksControllers.controller('LoginController', ['$scope', '$http', '$window', '$location',
    function ($scope, $http, $window, $location) {
        $scope.authenticated = $window.sessionStorage.token ? true : false;
        $scope.login = function (user) {
            post_request($http, '/sign_in', {'user': {'email': user.email, 'password': user.password }}, {}, function (data) {
                $window.sessionStorage.token = data.token;
                $window.sessionStorage.email = user.email;
                $scope.email = user.email;
                $scope.message = 'Successful login. Welcome!';
                $scope.authenticated = true;
                $location.path('/referral');

            }, function (data) {
                delete $window.sessionStorage.token;
                delete $window.sessionStorage.email;
                $scope.message = 'Error: invalid username or password';
                $scope.authenticated = false;
            });
        };
        $scope.logout = function () {
            $scope.email = null;
            $scope.message = null;
            $scope.isAuthenticated = false;
            delete $window.sessionStorage.token;
            delete $window.sessionStorage.email;
            $location.path('/login').replace();
        };
    }]);

dentalLinksControllers.controller('PracticeInvitationsController', ['$scope', '$http', function ($scope, $http) {
    $scope.invite_practice = function (practice) {
        post_request($http, '/practice_invitations', {'practice': practice, email: $scope.email, authentication_token: $scope.token
        }, function (data) {
            $scope.invite_practice_result = data;
        }, function (data) {
            $scope.invite_practice_result = data;
        });
    }
}]);

dentalLinksControllers.controller('ReferralsController', ['$scope', 'Practice', 'Patient', 'Referral', function ($scope, Practice, Patient, Referral) {

    $scope.patients = Patient.query();

    $scope.practices = Practice.query();

    $scope.initial = true;

    $scope.createReferral = function (model) {

        $scope.create_referral_result = Referral.save(model, function (data) {
            $scope.success = true;
            $scope.initial = false;
            $scope.patients = Patient.query();
            $scope.practices = Practice.query();
        }, function (data) {
            $scope.success = false;
            $scope.initial = false;
        });

    }
}]);

dentalLinksControllers.controller('UsersController', ['$scope', 'Practice', function ($scope, Practice) {
    $scope.roles = [
        {'mask': 0, 'name': 'admin'},
        {'mask': 2, 'name': 'doctor'},
        {'mask': 4, 'name': 'aux'}
    ];
    $scope.practices = Practice.query();

    $scope.create_user = function (user) {
        post_request($http, '/sign_up', {'user': user, email: $scope.email, authentication_token: $scope.token}, function (data) {
            $scope.create_user_result = data;
        });
    }
}]);

dentalLinksControllers.controller('PasswordsController', ['$scope', '$routeParams', 'Password', function ($scope, $routeParams, Password) {
    $scope.requestPasswordReset = function (user) {
        Password.reset({'user': user}, function (result) {
            $scope.success = true;
            $scope.initial = false;
        }, function (result) {
            $scope.success = false;
            $scope.initial = false;
        })
    };
    $scope.initial = true;
    $scope.success = false;
    $scope.changePassword = function (model) {


        model.reset_password_token = $routeParams.reset_password_token;
        Password.change({'user': model, 'format': 'json'},
            function (success_result) {
                $scope.success = true;
                $scope.initial = false;
            },
            function (error_result) {
                $scope.success = false;
                $scope.initial = false;
            });
    };
}]);
