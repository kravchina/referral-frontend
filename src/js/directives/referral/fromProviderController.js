angular.module('dentalLinks')
    .controller('FromProviderController', ['$scope', 'Auth', 'User', 'USER_ROLES',
        function ($scope, Auth, User, USER_ROLES) {
            $scope.userIsAux = Auth.hasRole(USER_ROLES.aux);
            $scope.currentPracticeProviders = $scope.userIsAux ? User.getOtherProviders({practice_id: $scope.auth.practice_id}) : User.getProviders({practice_id: $scope.auth.practice_id});
        }
    ]);
