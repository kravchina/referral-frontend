var adminModule = angular.module('admin', ['ui.bootstrap']);

adminModule.controller('AdminController', ['$scope', '$modal', 'Auth', 'Practice', 'Provider', 'User',
    function ($scope, $modal, Auth, Practice, Provider, User) {
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
                card_number: $scope.practice.card_number,
                name_on_card: $scope.practice.name_on_card,
                card_exp_month: $scope.practice.card_exp_month,
                card_exp_year: $scope.practice.card_exp_year,
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
        User.delete({id: user.id}, function(success){
            $scope.practice.users.splice($scope.practice.users.indexOf(user), 1);
        });
    };

    $scope.deleteProvider = function(provider){
        Provider.delete({id: provider.id}, function(success){
            $scope.providers.splice($scope.providers.indexOf(provider), 1);
        });
    }

}]);