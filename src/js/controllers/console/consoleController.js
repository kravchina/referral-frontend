angular.module('console')
    .controller('ConsoleController', ['$scope', '$state', function($scope, $state){
        $scope.tabsData = [{
            heading: 'Practice',
            route: 'console.practice',
            class: 'glyphicon glyphicon-home',
            active: false
        },
        {
            heading: 'Reports',
            route: 'console.reports',
            class: 'glyphicon glyphicon-list-alt',
            active: false
        },
        {
            heading: 'Utilities',
            route: 'console.utilities',
            class: 'glyphicon glyphicon-wrench',
            active: false
        },
        {
            heading: 'Plugin',
            route: 'console.plugin',
            class: 'glyphicon glyphicon-cog',
            active: false
        }];

        $scope.active = function(route){
            return $state.is(route);
        };

        $scope.$on("$stateChangeSuccess", function() {
            $scope.tabsData.forEach(function(tab) {
                tab.active = $scope.active(tab.route);
            });
        });

        $scope.onChangeTab = function(data){
            $scope.tabsData.forEach(function(tab) {
                tab.active = $scope.active(tab.route);
            });
        };
    }]);
