angular.module('console')
    .controller('ReportsConsoleController', ['$scope', 'Report', function($scope, Report){
        var eventLogs = [];
        $scope.invitations = $scope.practices = $scope.users = $scope.eventLogs = {};
        $scope.currentPage = 1;
        $scope.itemsPerPage = 10;
        $scope.totalItems = 0;

        $scope.changeEventPage = function(){
            $scope.eventLogs = eventLogs
                .slice((($scope.currentPage - 1) * $scope.itemsPerPage), ($scope.currentPage * $scope.itemsPerPage));
        };

        Report.get(function(success){
            $scope.invitations = success.invitations;
            $scope.practices = success.practices;
            $scope.users = success.users;
            $scope.totalItems = success.event_logs.length;
            success.event_logs.forEach(function(item){
                item.event_name = item.type_event.split('_').map(function(item){
                    return item.charAt(0).toUpperCase() + item.slice(1);
                }).join(' ');

                eventLogs.push(item);
            });
            $scope.changeEventPage();
        });

    }]);
