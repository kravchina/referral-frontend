describe("Testing Console Controller", function() {
    var consoleController;
    var $scope, $state;

    beforeEach(function(){
        module('ui.router')
        module('console');

        inject(function($injector) {
            $state = $injector.get('$state');
            $rootScope = $injector.get('$rootScope');
            $scope = $rootScope.$new();
            consoleController = $injector.get('$controller')('ConsoleController', { $scope: $scope, $state: $state});
        });
    });

    it('should have a ConsoleController', function() {
        expect(consoleController).not.toBe(null);
    });

    it('check route is active', function() {
        $state.is = function(state){
            return state == 'active.route.name';
        };

        var isActive = $scope.active('active.route.name');

        expect(isActive).toBe(true);
    });

    it('check route is inactive', function() {
        $state.is = function(state){
            return state == 'active.route.name';
        };

        var isActive = $scope.active('another.route.name');

        expect(isActive).toBe(false);
    });

    it('check state change', function() {
        $state.is = function(state){
            return state == 'console.reports';
        };
        $rootScope.$broadcast('$stateChangeSuccess');
        expect($scope.tabsData[1].active).toBe(true);
    });

    it('check onChangeTab function', function() {
        $state.is = function(state){
            return state == 'console.utilities';
        };
        $scope.onChangeTab();
        expect($scope.tabsData[2].active).toBe(true);
    });

});