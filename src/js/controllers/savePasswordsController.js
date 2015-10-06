angular.module('passwords')
    .controller('SavePasswordController', ['$scope', '$state', '$stateParams', 'Auth', 'User', 'Notification', function ($scope, $state, $stateParams, Auth, User, Notification) {
        $scope.savePassword = function (model) {
            model.add_password_token = $stateParams.add_password_token;
            User.savePassword({user: model},
                function (success) {
                    Auth.set({token: success.authentication_token, email: success.email, roles: success.roles, is_admin: success.is_admin, id: success.id, practice_id: success.practice_id});
                    Auth.current_user = success;
                    Notification.success("Congratulations! You have successfully logged in with your new password");
                    $state.go('history');
                },
                function (error) {
                    Notification.error('Error: can\'t change your password. Please try again later.');

                });
        };
    }]);
