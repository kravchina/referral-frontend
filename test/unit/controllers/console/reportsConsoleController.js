describe("Testing Reports Console Controller", function() {
    var controller;
    var $scope;

    var dataMock = {
        invitations: {day: [], week: [], ytd: []},
        practices: {day: [], week: [], ytd: []},
        users: {day: [], week: [], ytd: []},
        event_logs: [{type_event: 'test1_test1'}, {type_event: 'test2_test2'}, {type_event: 'test3_test3'}],
    };
    var eventLogsMock = [{type_event: 'test1_test1', event_name: 'Test1 Test1'}, {type_event: 'test2_test2', event_name: 'Test2 Test2'}, {type_event: 'test3_test3', event_name: 'Test3 Test3'}];
    var oneEventLogsMock = [{type_event: 'test2_test2', event_name: 'Test2 Test2'}];

    beforeEach(function(){
        module('ui.router');
        module('console');

        module(function($provide){
            $provide.service('Report', function(){
                return {
                    get: function(callback){
                        callback(dataMock);
                    }
                }
            });
        });
        inject(function($rootScope, $controller, _Report_) {
            $scope = $rootScope.$new();
            controller = $controller('ReportsConsoleController', { $scope: $scope, Report: _Report_});
        });
    });

    it('should have a ReportsConsoleController', function() {
        expect(controller).not.toBe(null);
        expect(controller).toBeDefined();
    });

    it('check to set data on scope', function(){
        expect($scope.invitations).toBeDefined();
        expect($scope.practices).toBeDefined();
        expect($scope.users).toBeDefined();
        expect($scope.eventLogs).toBeDefined();

        expect($scope.currentPage).toBeDefined();
        expect($scope.itemsPerPage).toBeDefined();
        expect($scope.totalItems).toBeDefined();

        expect($scope.invitations).toBe(dataMock.invitations);
        expect($scope.practices).toBe(dataMock.practices);
        expect($scope.users).toBe(dataMock.users);
        expect($scope.eventLogs).toEqual(eventLogsMock);
    });

    it('check changeEventPage function', function(){
        $scope.currentPage = 2;
        $scope.itemsPerPage = 1;
        $scope.totalItems = eventLogsMock.length;

        expect($scope.eventLogs).toEqual(eventLogsMock);
        $scope.changeEventPage();
        expect($scope.eventLogs).toEqual(oneEventLogsMock);
    });

});
