angular.module('dentalLinks').controller('NavController', ['$scope', '$state', '$modal', 'Auth', 'Logger', 'Login', 'Spinner', 'UnsavedChanges', 'User', 'API_ENDPOINT', 'HTTP_ERROR_EVENTS', 'Notification', 'ProgressIndicator',
    function ($scope, $state, $modal, Auth, Logger, Login, Spinner, UnsavedChanges, User, API_ENDPOINT, HTTP_ERROR_EVENTS, Notification, ProgressIndicator) {

        $scope.env = 'unknown.';
        if (API_ENDPOINT.indexOf('dental-links-prod-1') > -1) $scope.env = '';
        if (API_ENDPOINT.indexOf('dental-links-stage-1') > -1) $scope.env = 'stage1.';
        if (API_ENDPOINT.indexOf('referral-server') > -1) $scope.env = 'dev1.';
        if (API_ENDPOINT.indexOf('localhost') > -1) $scope.env = 'local.';

        $scope.progress = ProgressIndicator.get();

        $scope.loading = Spinner.loading();

        if(Auth.get()){
            Auth.current_user = User.get({id: Auth.get().id});
        }else{
            Auth.current_user = null;
        }

        $scope.$on(HTTP_ERROR_EVENTS.requestTimeout, function(event, args){
            Notification.error("error.http.requestTimeout");
        });

        $scope.$on(HTTP_ERROR_EVENTS.serverError, function(event, args){
            Notification.error("error.http.serverError");
        });

        var showErrorModal = function(message) {
            var modalInstance = $modal.open({
                templateUrl: 'partials/error_modal.html',
                controller: 'ErrorModalController',
                resolve: {
                    message: function(){
                        return message;
                    }
                }
            });
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


