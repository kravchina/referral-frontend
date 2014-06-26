dentalLinks.controller('NavController', ['$scope', 'Auth', 'User', '$state', 'Login', 'redirect', 'UnsavedChanges', 'dlLogger',
    function ($scope, Auth, User, $state, Login, redirect, UnsavedChanges, dlLogger) {

        $scope.loading = false;
        $scope.progressValue = 0;

        if(Auth.get()){
            Auth.current_user = User.get({id: Auth.get().id});
        }else{
            Auth.current_user = null;
        }

        $scope.loadingIndicatorStart = function(){
            $scope.loading = true;
            $scope.$apply()
        }

        $scope.loadingIndicatorEnd = function(){
            $scope.loading = false;
            $scope.$apply()
        }

        $scope.progressIndicatorStart = function(){
            $scope.loadingProgress = true;
            $scope.$apply()
        }

        $scope.progressIndicatorEnd = function(){
            $scope.loadingProgress = false;
            $scope.progressValue = 0;
            $scope.$apply()
        }

        $scope.setProgress = function(progress){
            if ($scope.progressValue < progress){
                $scope.progressValue = progress;
                $scope.$apply()
            }
            
        }

        $scope.first_name = function() {
            var current_user = Auth.current_user;
            return (current_user || {}).first_name;
        }

        $scope.last_name = function() {
            var current_user = Auth.current_user;
            return (current_user || {}).last_name;
        }

        $scope.logged = function () {
            return Auth.get() != undefined;
        };

        $scope.logout = function(){
            if (UnsavedChanges.canLeaveSafely()) {
                dlLogger.log('logout(): allowed');
                Login.logout(function () {
                    Auth.remove();
                    Auth.current_user = null;
                    $state.go('signIn', {}, {reload: true});
                });
            } else {
                dlLogger.log('logout(): cancelled');
            }
        }

    }]);


