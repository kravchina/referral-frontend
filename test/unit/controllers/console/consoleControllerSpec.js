describe("Testing Console Controller", function() {
    var consoleController;
    var $scope = {
        $on : function(){},
        onChangeTab: function() {}

    };
    var $state;

    beforeEach(function(){
        module('ui.router')
        module('console');

        inject(function($injector) {
            $state = $injector.get('$state');
            consoleController = $injector.get('$controller')('ConsoleController', { $scope: $scope, $state: $state});
        });
    });

    it('should have a ConsoleController', function() {
        expect(consoleController).not.toBe(null);
        console.log($scope.tabsData);
    });

    it('should call StateChange', function() {
        spyOn($scope, '$on');
        console.log($scope);
        $scope.$broadcast('$stateChangeSuccess'); // This is what I expect to trigger the `$on` method
        expect($scope.$on).toHaveBeenCalled();;
    });

});