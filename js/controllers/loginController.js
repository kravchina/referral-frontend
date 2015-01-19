var loginModule = angular.module('login', []);

loginModule.controller('LoginController', ['$scope', 'Auth', 'Alert', 'User', '$location', 'Login', 'redirect', 'Logger',
    function ($scope, Auth, Alert, User, $location, Login, redirect, Logger) {
        var auth = Auth.get();
        if(auth){// user is authenticated by tries to open login window
            $location.path('/history');
        }
        $scope.email = (auth || {}).email;
        $scope.alerts = [];
        $scope.login = function (user) {   /*{'user': {'email': user.email, 'password': user.password }}*/

            Login.login({'user': user},
                function (success) {
                    Auth.set({token: success.token, email: user.email, roles: success.roles, is_admin: success.is_admin, id: success.id, practice_id: success.practice_id});
                    user = User.get({id: success.id});
                    Logger.log(success);
                    Auth.current_user = user;
                    $scope.email = user.email;
                    $location.path(redirect.path);
                },
                function (failure) {
                    Logger.log(failure);
                    Auth.remove();
                    user.password = undefined;
                    $scope.alerts = [];
                    Alert.error($scope.alerts, failure.status == 0 ?'Upstream server connectivity error. Administrator was informed. Please try again later' : 'Unable to login with provided credentials');
                    $scope.$broadcast('focusPassword');
                });
        };
    }]);

