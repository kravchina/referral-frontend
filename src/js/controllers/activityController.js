angular.module('activity')
    .controller('ActivityController', ['$scope', 'Auth', 'Activity', 'Logger', 'Practice', function ($scope, Auth, Activity, Logger, Practice) {
        $scope.limitTo = 20;
        $scope.activities = [];
        $scope.trackableType = null;
        $scope.action = null;
        $scope.practice = {id: null};
        $scope.findActivitiesByDateRange = function (start, end) {
            $scope.start_date = start;
            $scope.end_date = end;
            $scope.busy = true;
            Activity.find({practice_id: $scope.practice.id, start_date: start.toISOString(), end_date: end.toISOString(), activity_type: $scope.action? $scope.action : null, trackable_type: $scope.trackableType ? $scope.trackableType : null, limit: $scope.limitTo},
                function(data){
                    Logger.log(data);
                    $scope.activities = data.activities;
                    $scope.activities_total_count = data.activities_total_count;
                    $scope.busy = false;
                });
        };

        $scope.findActivitiesByAction = function () {
            Logger.log($scope.query);
            $scope.busy = true;
            Activity.find({practice_id: $scope.practice.id, start_date: $scope.start_date.toISOString(), end_date: $scope.end_date.toISOString(), activity_type: $scope.action? $scope.action : null, trackable_type: $scope.trackableType ? $scope.trackableType : null, limit: $scope.limitTo},
                function(data){
                    $scope.activities = data.activities;
                    $scope.activities_total_count = data.activities_total_count;
                    $scope.busy = false;
                });
        };

        $scope.findActivitiesByModel = function(){
            $scope.busy = true;
            Activity.find({practice_id: $scope.practice.id, start_date: $scope.start_date.toISOString(), end_date: $scope.end_date.toISOString(), activity_type: $scope.action? $scope.action : null, trackable_type: $scope.trackableType ? $scope.trackableType : null, limit: $scope.limitTo},
                function(data){
                    $scope.activities = data.activities;
                    $scope.activities_total_count = data.activities_total_count;
                    $scope.busy = false;
                });
        };

        $scope.addMoreItems = function(){
            $scope.busy = true;
            var offset = $scope.activities.length;
            Activity.find({practice_id: $scope.practice.id, start_date: $scope.start_date.toISOString(), end_date: $scope.end_date.toISOString(), activity_type: $scope.action? $scope.action : null, trackable_type: $scope.trackableType ? $scope.trackableType : null, limit: $scope.limitTo, offset: offset},
                function(data){
                    for(var i=0; i < data.activities.length; i++){
                        $scope.activities.push(data.activities[i]);
                    }
                    $scope.activities_total_count = data.activities_total_count;
                    $scope.busy = false;
                });
        };

        $scope.findActivitiesByDateRange(moment(0), moment().endOf('day'));

        $scope.findPractice = function(searchValue){
            return Practice.searchPractice({search: searchValue}).$promise
        };

        $scope.filterByPractice = function(selectedPractice){
            $scope.busy = true;
            $scope.practice = selectedPractice;
            Activity.find({practice_id: selectedPractice.id, start_date: $scope.start_date.toISOString(), end_date: $scope.end_date.toISOString(), activity_type: $scope.action? $scope.action : null,  limit: $scope.limitTo},
                function(data){
                    $scope.activities = data.activities;
                    $scope.activities_total_count = data.activities_total_count;
                    $scope.busy = false;
            });
        }
    }]);
