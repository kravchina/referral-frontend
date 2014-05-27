var adminModule = angular.module('admin', ['ui.bootstrap']);

adminModule.controller('AdminController', ['$scope', '$modal', 'Auth', 'Practice', 'Provider', 'User', function ($scope, $modal, Auth, Practice, Provider, User) {
    var auth = Auth.get();
    $scope.providers = User.getInvitees({user_id: auth.id });
    $scope.account = User.get({id: auth.id});
    $scope.practice = Practice.get({practiceId: auth.practice_id});
    $scope.saveAccount = function () {
        User.update( {id: auth.id }, {user: $scope.account})
    };

    $scope.savePractice = function () {
        Practice.update({practiceId: $scope.practice.id}, {
            practice: {
                name: $scope.practice.name,
                address_attributes: $scope.practice.address
            }
        });
    };


    $scope.usersDialog = function () {
        var modalInstance = $modal.open({
            templateUrl: 'partials/provider_form.html',
            controller: 'ProviderModalController'
        });

        modalInstance.result.then(function (user) {
            $scope.user = user;
        });
    };

    $scope.inviteDialog = function () {
        var modalInstance = $modal.open({
            templateUrl: 'partials/provider_form.html',
            controller: 'ProviderModalController'
        });

        modalInstance.result.then(function (provider) {
            $scope.providers.push(provider);
        });
    };

    $scope.deleteUser = function(user){
        console.log("User delete", user) ;
    };

    $scope.deleteProvider = function(provider){
        console.log("Provider delete", provider) ;
    }

}]);