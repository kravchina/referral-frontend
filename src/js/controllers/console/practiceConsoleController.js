angular.module('console')
    .controller('PracticeConsoleController', ['$scope', 'Auth', 'ConsoleHelper',
    function($scope, Auth, ConsoleHelper){

        $scope.onPracticeSelected = ConsoleHelper.onPracticeSelected($scope);

        $scope.findPractice = ConsoleHelper.findPractice($scope);

        $scope.showFullRole = ConsoleHelper.showFullRole();

    }]);
