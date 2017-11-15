angular.module('login')
    .controller('LoginController', ['$scope', '$stateParams', 'Auth', 'User', '$location', 'Login', 'redirect', 'Logger', 'Notification', 'CustomBranding',
    function ($scope, $stateParams, Auth, User, $location, Login, redirect, Logger, Notification, CustomBranding) {
        var auth = Auth.get();
        if (auth) { // user is authenticated but tries to open login window
            $location.path('/history');
        }
        $scope.email = (auth || {}).email;
        if($stateParams.alreadyRegister){
            Notification.error("invitation.exist");
        }
        $scope.pid = $stateParams.pid;

        $scope.loginMode = false;

        $scope.turnOnLoginMode = function() {
            $scope.loginMode = true;
        };

        $scope.login = function (user) {   /*{'user': {'email': user.email, 'password': user.password }}*/

            Login.login({'user': user},
                function (success) {
                    Auth.set({token: success.token, email: user.email, roles: success.roles, id: success.id, practice_id: success.practice_id});
                    user = User.get({id: success.id}, function(success){
                        CustomBranding.remove();
                        if(user.practice && user.practice.designation && user.practice.designation.branding){
                            CustomBranding.apply({pidBased: false, settings: user.practice.designation.branding.ui_data });
                        }
                    });
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

