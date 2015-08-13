dentalLinks.controller('NavController', ['$scope', '$state', '$modal', 'Auth', 'Logger', 'Login', 'Spinner', 'UnsavedChanges', 'User', 'API_ENDPOINT', 'HTTP_ERROR_EVENTS',
    function ($scope, $state, $modal, Auth, Logger, Login, Spinner, UnsavedChanges, User, API_ENDPOINT, HTTP_ERROR_EVENTS) {

        $scope.env = 'unknown.';
        if (API_ENDPOINT.indexOf('dental-links-prod-1') > -1) $scope.env = '';
        if (API_ENDPOINT.indexOf('dental-links-stage-1') > -1) $scope.env = 'stage1.';
        if (API_ENDPOINT.indexOf('referral-server') > -1) $scope.env = 'dev1.';
        if (API_ENDPOINT.indexOf('localhost') > -1) $scope.env = 'local.';

        $scope.progressValue = 0;

        $scope.checkModal = null;

        $scope.loading = Spinner.loading();

        if(Auth.get()){
            Auth.current_user = User.get({id: Auth.get().id});
        }else{
            Auth.current_user = null;
        }

        $scope.$on(HTTP_ERROR_EVENTS.requestTimeout, function(event, args){
            showErrorModal('error.http.requestTimeout');
        });

        $scope.$on(HTTP_ERROR_EVENTS.serverError, function(event, args){
            showErrorModal('error.http.serverError');
        });

        var showErrorModal = function(message) {
            if(!$scope.checkModal){
                var modalInstance = $modal.open({
                    templateUrl: 'partials/error_modal.html',
                    controller: 'ErrorModalController',
                    resolve: {
                        message: function(){
                            return message;
                        }
                    }
                });
                $scope.checkModal = modalInstance;
            }
            $scope.checkModal.result.then(function(){
                $scope.checkModal = null;
            });

        };

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
                Login.logout(function (success) {
                    Logger.debug('Logout succeeded', success);
                    Auth.remove();
                    Auth.current_user = null;
                    $state.go('signIn', {}, {reload: true});
                },
                function (failure) {
                    Logger.debug('Logout failed', failure);
                    Auth.remove();
                    Auth.current_user = null;
                    $state.go('signIn', {}, {reload: true});
                });
            } else {
                Logger.log('logout(): cancelled');
            }
        }

    }]);


