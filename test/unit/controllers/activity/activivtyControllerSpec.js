describe("ActivityController", function() {

    var $controller, $scope;
    var activitiesDataMock =  {activities: ['firstActivity'], activities_total_count: 1};
    var activityServiceMoreItemsMock = {
        find: function(){
            callback(activitiesDataMock);
        }
    };
    var activityServiceMock = {
        find: function(requestData, callback){
            callback(activitiesDataMock);
        }};


    beforeEach(function(){
        module('ui.router');
        module('activity');
        spyOn(activityServiceMock, 'find').and.callThrough();
        spyOn(activityServiceMoreItemsMock, 'find');
        module(function($provide){
            $provide.service('Activity', function(){
                return activityServiceMock;

            });

            $provide.service('Practice', function(){
                return {
                    searchPractice: function(searchValue){
                    }
                }
            });
        });
        inject(function($injector, _Activity_, _Practice_) {
            var rootScope = $injector.get('$rootScope');
            $scope = rootScope.$new();
            $controller = $injector.get('$controller')('ActivityController', { $scope: $scope, Activity: _Activity_, Practice: _Practice_});
        });
    });

    it('is not null', function() {
        expect($controller).not.toBe(null);
    });

    it('sets activities on load ', function(){
        expect(activityServiceMock.find).toHaveBeenCalled();
        expect($scope.activities).toBeDefined();
        expect($scope.activities_total_count).toEqual(1);
        expect($scope.activities).toContain(activitiesDataMock.activities[0]);
    });

    it('adds activities on scrolling', function(){
        $scope.activities = activitiesDataMock.activities;
        $scope.practice.id = 1;
        $scope.start_date = new Date();
        $scope.end_date = new Date();
        $scope.limitTo = 1;
        expect(activityServiceMoreItemsMock.find).toHaveBeenCalled();
        expect($scope.activities).toBeDefined();
        expect($scope.activities_total_count).toEqual(1);
        //$scope.addMoreItems();
        expect($scope.activities_total_count).toEqual(2);
    });

});