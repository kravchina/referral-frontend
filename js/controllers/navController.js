dentalLinks.controller('NavController', ['$scope', '$state', 'Auth', 'Logger', 'Login', 'Spinner',  'UnsavedChanges', 'User',
    function ($scope, $state, Auth, Logger, Login, Spinner, UnsavedChanges, User) {

        $scope.progressValue = 0;

        $scope.loading = Spinner.loading();

        if(Auth.get()){
            Auth.current_user = User.get({id: Auth.get().id});
        }else{
            Auth.current_user = null;
        }

        $scope.progressIndicatorStart = function(){
            $scope.loadingProgress = true;
            // $scope.$apply()
        };

        $scope.progressIndicatorEnd = function(){
            $scope.loadingProgress = false;
            $scope.progressValue = 0;
            $scope.$apply()
        };

        $scope.setProgress = function(progress){
            if ($scope.progressValue < progress){
                $scope.progressValue = progress;
                $scope.$apply()
            }
            
        };
        $scope.title = function() {
            var current_user = Auth.current_user;
            return (current_user || {}).title;
        };

        $scope.first_name = function() {
            var current_user = Auth.current_user;
            return (current_user || {}).first_name;
        };

        $scope.last_name = function() {
            var current_user = Auth.current_user;
            return (current_user || {}).last_name;
        };

        $scope.logged = function () {
            return Auth.get() != undefined;
        };

        $scope.logout = function(){
            if (UnsavedChanges.canLeaveSafely()) {
                Logger.log('logout(): allowed');
                Login.logout(function (failure) {
                    Auth.remove();
                    Auth.current_user = null;
                    $state.go('signIn', {}, {reload: true});
                },
                function (failure) {
                    Auth.remove();
                    Auth.current_user = null;
                    $state.go('signIn', {}, {reload: true});
                });
            } else {
                Logger.log('logout(): cancelled');
            }
        }

    }]);


