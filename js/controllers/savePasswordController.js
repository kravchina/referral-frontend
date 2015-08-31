var passwordsModule = angular.module('passwords', []);

passwordsModule.controller('SavePasswordController', ['$scope', '$state', '$stateParams', 'Alert', 'User', function ($scope, $state, $stateParams, Alert, User) {
    $scope.alerts = [];
    $scope.savePassword = function (model) {
        model.add_password_token = $stateParams.add_password_token;
        User.savePassword({user: model},
            function (success_result) {
                $state.go('signIn');
            },
            function (error_result) {
                Alert.error($scope.alerts, 'Error: can\'t change your password. Please try again later.', true);

            });
    };
}]);
