var loginModule = angular.module('login', []);

loginModule.controller('LoginController', ['$scope', 'Auth', 'User', '$location', 'Login', 'redirect',
    function ($scope, Auth, User, $location, Login, redirect) {
        var auth = Auth.get();
        $scope.authenticated = auth;
        $scope.email = (auth || {}).email;
        $scope.login = function (user) {   /*{'user': {'email': user.email, 'password': user.password }}*/
            Login.login({'user': {'email': user.email, 'password': user.password }},
                function (success) {
                    Auth.set({token: success.token, email: user.email, roles: success.roles, id: success.id, practice_id: success.practice_id});

                    user = User.get({id: success.id});
                    Auth.current_user = user;

                    $scope.email = user.email;
                    $scope.authenticated = true;
                    $location.path(redirect.path);
                    $scope.result = {success: true};

                },
                function (failure) {
                    Auth.remove();
                    $scope.authenticated = false;
                    $scope.result = {failure: true};
                });
        };
        $scope.logged = function () {
            return Auth.get();
        };
        $scope.logout = function () {
            Login.logout(function () {
                    Auth.remove();
                    Auth.current_user = null;
                    $scope.email = null;
                    $scope.message = null;
                    $scope.authenticated = false;
                    $scope.result = {};
                    $location.path('/sign_in');
                }
            );

        };

        $scope.existingReferralId = 7;


    }]);

