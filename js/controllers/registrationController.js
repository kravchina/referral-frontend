var registrationModule = angular.module('registration', []);

registrationModule.controller('RegistrationController', ['$scope', '$location', '$stateParams', 'Alert', 'Auth', 'Practice', 'ProviderInvitation', 'Registration', function ($scope, $location, $stateParams, Alert, Auth, Practice, ProviderInvitation, Registration) {
    $scope.alerts = [];
    $scope.user = ProviderInvitation.get({invitation_token: $stateParams.invitation_token}, function (success) {
        },
        function (failure) {
            Alert.push($scope.alerts, 'danger', 'Something happened... Probably, invitation is invalid or was used already.')
        }
    );

    $scope.findPractice = function (searchValue) {
        return Practice.searchPractice({search: searchValue }).$promise.then(function (res) {
            return res;
        });
    };

    $scope.register = function (user) {
        user.practice_id = 1;
        Registration.save({user: user, invitation_token: $stateParams.invitation_token},
            function (success) {
                Alert.push($scope.alerts, 'success', 'You have successfully registered!');
                Auth.set({token: success.authentication_token, email: success.email, roles: success.roles, id: success.id, practice_id: success.practice_id});
                Auth.current_user = success;
                $location.path('/admin');
            },
            function (failure) {
                Alert.push($scope.alerts, 'danger', 'Error during registration.')
            }
        )
    }
}]);
