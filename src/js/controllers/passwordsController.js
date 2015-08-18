angular.module('passwords')
    .controller('PasswordsController', ['$scope', '$state', '$stateParams', 'Alert', 'Password', function ($scope, $state, $stateParams, Alert, Password) {
    $scope.alerts = [];
    $scope.requestPasswordReset = function (user) {
        Password.reset({'user': user},
            function (result) {
                Alert.success($scope.alerts, 'Success! Please check your email for password reset instructions.');
            },
            function (failure) {
                Alert.error($scope.alerts, 'Error: can\'t change your password. Please try again later.', true);
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
            function (error_result) {
                Alert.error($scope.alerts, 'Error: can\'t change your password. Please try again later.', true);

            });
    };
}]);
