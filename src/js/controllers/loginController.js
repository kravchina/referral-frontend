angular.module('login')
    .controller('LoginController', ['$scope', '$stateParams', 'Auth', 'User', '$location', 'Login', 'redirect', 'Logger', 'Notification',
    function ($scope, $stateParams, Auth, User, $location, Login, redirect, Logger, Notification) {
        var auth = Auth.get();
        if (auth) { // user is authenticated but tries to open login window
            $location.path('/history');
        }
        $scope.email = (auth || {}).email;
        if($stateParams.alreadyRegister){
            Notification.error("invitation.exist");
        }
        $scope.pid = $stateParams.pid;
        $scope.login = function (user) {   /*{'user': {'email': user.email, 'password': user.password }}*/

            Login.login({'user': user},
                function (success) {
                    Auth.set({token: success.token, email: user.email, roles: success.roles, id: success.id, practice_id: success.practice_id});
                    user = User.get({id: success.id});
                    Logger.log(success);
                    Auth.current_user = user;
                    $scope.email = user.email;
                    $location.url(redirect.path);
                },
                function (failure) {
                    Logger.log(failure);
                    Auth.remove();
                    user.password = undefined;
                    Notification.error(failure.status === 0 ?'Upstream server connectivity error.  Please try again later' : 'Unable to login with provided credentials');
                    $scope.$broadcast('focusPassword');
                });
        };
    }]);

