describe("Testing Utilities Console Controller", function() {
    var controller;
    var $scope, $state;

    beforeEach(function(){
        module('ui.router')
        module('console');

        inject(function($injector) {
            $state = $injector.get('$state');
            $rootScope = $injector.get('$rootScope');
            $scope = $rootScope.$new();
            controller = $injector.get('$controller')('UtilitiesConsoleController', { $scope: $scope, $state: $state});
        });
    });

    it('should have a UtilitiesConsoleController', function() {
        expect(controller).not.toBe(null);
    });

});