describe("Testing Practice Console Controller", function() {
    var controller;
    var $scope;

    var practiceMock = [{"id":1,"name":"David Wolf, DDS, PC","description":null,"created_at":"2015-07-02T11:42:26.526Z","updated_at":"2015-10-09T08:37:02.512Z","status":null,"practice_type_id":6,"salutation":"Dr.","account_first_name":"David","account_last_name":"Wolf","account_middle_initial":"M","stripe_token":null,"stripe_customer_id":null,"account_email":"david@davidwolfdds.com","last_4_digits":null,"subscription_active_until":"2015-08-16T11:42:26.527Z","stripe_subscription_id":null,"promo_id":null,"trial_period":true,"practice_type":{"id":6,"code":"general_dentistry","name":"General Dentistry","created_at":"2015-07-02T11:42:23.257Z","updated_at":"2015-07-02T11:42:23.257Z"},"addresses":[{"id":1,"street_line_1":"100 Medway Rd, STE 203","street_line_2":null,"city":"Milford","state":"MA","zip":"01757","created_at":"2015-07-02T11:42:26.675Z","updated_at":"2015-08-27T11:16:04.025Z","phone":"5084734888","website":"www.davidwolfdds.com","practice_id":1},{"id":52,"street_line_1":"test address","street_line_2":null,"city":"test city","state":"IL","zip":"3434334","created_at":"2015-10-16T12:46:46.084Z","updated_at":"2015-10-16T12:46:46.084Z","phone":"2342342342","website":"sdfsfsfsdf","practice_id":1}]}];
    var userMock = [{"id":1,"title":"Dr.","first_name":"Alexei","middle_initial":"","last_name":"Vidmich","password":null,"practice_id":1,"created_at":"2015-07-02T00:00:00.000Z","updated_at":"2015-10-26T13:37:19.600Z","email":"alexei@vidmich.com","authentication_token":"FtKY-UwkdE_A4uVT89TJ","roles_mask":11,"removed_at":null,"notification_preference":0,"no_login":false,"add_password_token":null,"last_request_at":"2015-10-26T13:37:19.587Z"},{"id":26,"title":"","first_name":"Test","middle_initial":null,"last_name":"Test","password":null,"practice_id":1,"created_at":"2015-07-10T00:00:00.000Z","updated_at":"2015-10-21T12:00:21.074Z","email":"slavakravchina@gmail.com","authentication_token":"HG8tEVkgmYJdHNyNjiSz","roles_mask":3,"removed_at":null,"notification_preference":1,"no_login":false,"add_password_token":null,"last_request_at":null}];

    beforeEach(function(){
        module('ui.router')
        module('console');

        module(function($provide){
            $provide.service('ConsoleHelper', ['$q', function($q) {
                return {
                    findPractice: function(scope){
                        return function(searchValue){
                            if(scope.destinationPractice){
                                scope.destinationPractice = {};
                            }
                            return $q.when();//Practice.searchPractice({search: searchValue}).$promise;
                        };
                    },
                    onPracticeSelected: function(scope){
                        return function(selectedPractice){
                            scope.destinationPractice = selectedPractice;
                            scope.destinationPractice.users = userMock;
                        };
                    },
                    showFullRole: function(){
                        return function(roleMask){
                            return roleMask == 2 ? 'Admin' : '';
                        };
                    },
                };
            }]);
        });

        inject(function($injector) {
            $rootScope = $injector.get('$rootScope');
            $scope = $rootScope.$new();
            $consoleHelper = $injector.get('ConsoleHelper');
            controller = $injector.get('$controller');
            spyOn($consoleHelper,'findPractice').and.callThrough();
            controller('PracticeConsoleController', {
                $scope: $scope,
                Auth: {},
                ConsoleHelper: $consoleHelper
            });
        });
    });

    it('should have a PracticeConsoleController', function() {
        expect(controller).not.toBe(null);
    });

    it('test controller methods', function(){
        expect($scope.findPractice).toBeDefined();
        expect($scope.onPracticeSelected).toBeDefined();
        expect($scope.showFullRole).toBeDefined();
    });

});