describe("Testing Practice Console Controller", function() {
    var controller;
    var $scope;

    var userMock = [
        {"id":1,"title":"Dr.","first_name":"Alexei","middle_initial":"","last_name":"Vidmich","password":null,"practice_id":1,
            "created_at":"2015-07-02T00:00:00.000Z","updated_at":"2015-10-26T13:37:19.600Z","email":"alexei@vidmich.com",
            "authentication_token":"FtKY-UwkdE_A4uVT89TJ","roles_mask":11,"removed_at":null,"notification_preference":0,
            "no_login":false,"add_password_token":null,"last_request_at":"2015-10-26T13:37:19.587Z"},

        {"id":26,"title":"","first_name":"Test","middle_initial":null,"last_name":"Test","password":null,"practice_id":1,
            "created_at":"2015-07-10T00:00:00.000Z","updated_at":"2015-10-21T12:00:21.074Z","email":"slavakravchina@gmail.com",
            "authentication_token":"HG8tEVkgmYJdHNyNjiSz","roles_mask":3,"removed_at":null,"notification_preference":1,
            "no_login":false,"add_password_token":null,"last_request_at":null}
    ];

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
                            return $q.when();
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
                    showInviteLink: function(){
                        return function(user){
                            return 'http://localhost/register/token'
                        };
                    }
                };
            }]);
            $provide.service('ModalHandler', function(){});
            $provide.service('ProviderInvitation', function(){});
            $provide.service('User', function(){});
            $provide.service('Notification', function(){});
            $provide.service('Address', function(){});
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
        expect($scope.showInviteLink).toBeDefined();
        expect($scope.usersDialog).toBeDefined();
        expect($scope.editDialog).toBeDefined();
        expect($scope.deleteUser).toBeDefined();
        expect($scope.addAddress).toBeDefined();
        expect($scope.removeAddress).toBeDefined();
        expect($scope.saveAddress).toBeDefined();
    });

});
