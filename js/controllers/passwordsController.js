var passwordsModule = angular.module('passwords', []);

passwordsModule.controller('PasswordsController', ['$scope', '$stateParams', 'Password', function ($scope, $stateParams, Password) {
    $scope.requestPasswordReset = function (user) {
        Password.reset({'user': user},
            function (result) {
                $scope.success = true;
                $scope.failure = false;
            },
            function (result) {
                $scope.failure = true;
                $scope.success = false;
            })
    };
    $scope.initial = true;
    $scope.success = false;
    $scope.changePassword = function (model) {
        model.reset_password_token = $stateParams.reset_password_token;
        Password.change({'user': model, 'format': 'json'},
            function (success_result) {
                $scope.success = true;
                $scope.failure = false;
            },
            function (error_result) {
                $scope.success = false;
                $scope.failure = true;
            });
    };
}]);
