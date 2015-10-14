angular.module('console')
    .controller('PracticeConsoleController', ['$scope', 'Auth', function($scope, Auth){

        $scope.auth = Auth.get() || {};

    }]);
