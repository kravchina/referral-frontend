describe("Testing Reports Console Controller", function() {
    var controller;
    var $scope;

    var dataMock = {
        invitations: {day: [], week: [], ytd: []},
        practices: {day: [], week: [], ytd: []},
        users: {day: [], week: [], ytd: []}
    };

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

        expect($scope.invitations).toBe(dataMock.invitations);
        expect($scope.practices).toBe(dataMock.practices);
        expect($scope.users).toBe(dataMock.users);
    });

});
