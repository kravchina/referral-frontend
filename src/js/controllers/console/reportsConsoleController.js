angular.module('console')
    .controller('ReportsConsoleController', ['$scope', 'Report', function($scope, Report){
        var eventLogs = [];
        $scope.invitationsRadio = $scope.practicesRadio = $scope.usersRadio = 'day';
        $scope.currentPage = 1;
        $scope.itemsPerPage = 10;
        $scope.totalItems = 0;

        $scope.changeEventPage = function(){
            $scope.eventLogs = eventLogs
                .slice((($scope.currentPage - 1) * $scope.itemsPerPage), ($scope.currentPage * $scope.itemsPerPage));
        };

        $scope.toggleInvitations = function(timeType){
            Report.getInvitations({time_type: timeType }, function(success){
                $scope.invitations = success;
            });
        };

        $scope.togglePractices = function(timeType){
            Report.getPractices({time_type: timeType }, function(success){
                $scope.practices = success;
            });
        };

        $scope.toggleUsers = function(timeType){
            Report.getUsers({time_type: timeType }, function(success){
                $scope.users = success;
            });
        };

        Report.get(function(success){
            $scope.referrals = success.referrals;
            $scope.info = success;

            $scope.totalItems = success.event_logs.length;
            success.event_logs.forEach(function(item){
                item.event_name = item.type_event.split('_').map(function(item){
                    return item.charAt(0).toUpperCase() + item.slice(1);
                }).join(' ');

                eventLogs.push(item);
            });
            $scope.total_referrals = success.total_referrals;
            $scope.total_active_accounts = success.total_active_accounts;
            $scope.total_active_practices = success.total_active_practices;
            $scope.toggleInvitations('day');
            $scope.togglePractices('day');
            $scope.toggleUsers('day');
            $scope.changeEventPage();
        });

    }]);
