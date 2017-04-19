angular.module('passwords')
    .controller('PasswordsController', ['$scope', '$state', '$stateParams', 'Notification', 'Password', function ($scope, $state, $stateParams, Notification, Password) {
    $scope.requestPasswordReset = function (user) {
        Password.reset({'user': user},
            function (result) {
                Notification.success('Success! Please check your email for password reset instructions.');
            },
            function (failure) {
                Notification.error(failure.data.error);
            })
    };
    $scope.initial = true;
    $scope.success = false;
    $scope.changePassword = function (model) {
        model.reset_password_token = $stateParams.reset_password_token;
        Password.change({'user': model, 'format': 'json'},
            function (success_result) {
                $state.go('signIn');
            },
            function (failure) {
                var error = failure.data.errors;
                if (error.reset_password_token){
                    Notification.error('reset_password_token.invalid');
                } else {
                    Notification.error(error.message[0]);
                }
            });
    };
}]);
