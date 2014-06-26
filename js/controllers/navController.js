dentalLinks.controller('NavController', ['$scope', '$state', 'Auth', 'Logger', 'Login', 'Spinner',  'UnsavedChanges', 'User',
    function ($scope, $state, Auth, Logger, Login, Spinner, UnsavedChanges, User) {

<<<<<<< HEAD
        $scope.loading = false;
        $scope.progressValue = 0;
=======
        $scope.loading = Spinner.loading();
>>>>>>> 2d8d193076e6dd0b544ff808ecafe4be45171f09

        if(Auth.get()){
            Auth.current_user = User.get({id: Auth.get().id});
        }else{
            Auth.current_user = null;
        }

<<<<<<< HEAD
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

=======
>>>>>>> 2d8d193076e6dd0b544ff808ecafe4be45171f09
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
                Login.logout(function () {
                    Auth.remove();
                    Auth.current_user = null;
                    $state.go('signIn', {}, {reload: true});
                });
            } else {
                Logger.log('logout(): cancelled');
            }
        }

    }]);


