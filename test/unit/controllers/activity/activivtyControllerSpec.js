describe("ActivityController", function() {

    var $controller, $scope;
    var activityServiceMock = {
        find: function(requestData, callback){
            callback( {activities: ['activityItem'], activities_total_count: 1});
        }};


    beforeEach(function(){
        module('ui.router');
        module('activity');
        spyOn(activityServiceMock, 'find').and.callThrough();
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
        expect($scope.activities).toContain('activityItem');
    });

    it('adds activities on scrolling', function(){
        $scope.practice = {id:1};
        $scope.start_date = new Date();
        $scope.end_date = new Date();
        $scope.limitTo = 1;
        $scope.offset = 1;
        expect(activityServiceMock.find).toHaveBeenCalled();
        expect($scope.activities).toBeDefined();
        expect($scope.activities.length).toEqual(1);
        $scope.addMoreItems();
        expect(activityServiceMock.find).toHaveBeenCalled();
        expect($scope.activities.length).toEqual(2);
    });

});