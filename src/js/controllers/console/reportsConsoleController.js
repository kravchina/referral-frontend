angular.module('console')
    .controller('ReportsConsoleController', ['$scope', 'Report', function($scope, Report){
        $scope.invitations = $scope.practices = $scope.users = {};

        Report.get(function(success){
            $scope.invitations = success.invitations;
            $scope.practices = success.practices;
            $scope.users = success.users;
        });
    }]);
