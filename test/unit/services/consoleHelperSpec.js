describe("Testing ConsoleHelper service", function() {
    var ConsoleHelper, $scope, User, Practice, Role, $rootScope;

    var selectedPractice = {
        id: 1,
    };

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

    var invitationMock = [
        {"id":3,"first_name":"Invited","last_name":"Doctor2","email":"slavakravchina+invited34324232312134@gmail.com",
            "token":"d81156601401b792b588d411103d2fc86a4630ba","status":"invited","inviter_id":2,"registered_user_id":null,
            "created_at":"2015-12-18T16:15:20.812Z","updated_at":"2015-12-18T16:15:20.812Z","roles_mask":3,"practice_id":1,
            "removed_at":null,"reminded_at":null}
    ];

    var searchValue = 'David';
    var rolesMask = 3;

    var outputData = [{id: 'admin', name: 'Admin'}, {id: 'doctor', name: 'Doctor'}];

    beforeEach(function(){
        module('console');

        module(function($provide) {
            $provide.service('User', function($q){
                return {
                    getAllUsers: jasmine.createSpy('getAllUsers').and.returnValue({$promise: $q.when(userMock)}),
                };
            });
            $provide.service('Practice', function($q){
                return {
                    superUserSearchPractice: jasmine.createSpy('superUserSearchPractice').and.returnValue($q.defer().promise),
                };
            });
            $provide.service('Role', function(){
                return {
                    getFromMask: jasmine.createSpy('getFromMask').and.returnValue(outputData),
                };
            });
            $provide.service('ProviderInvitation', function($q){
                return {
                    searchProviderInvitation: jasmine.createSpy('getFromMask').and.returnValue($q.defer().promise),
                    practice: jasmine.createSpy('practice').and.returnValue({$promise: $q.when(invitationMock)}),
            };
        });
        });

        inject(function($injector, _ConsoleHelper_, _User_, _Practice_, _Role_){
            $rootScope = $injector.get('$rootScope');
            $scope = $rootScope.$new();
            ConsoleHelper = _ConsoleHelper_;
            User = _User_;
            Practice = _Practice_;
            Role = _Role_;
        });

    });



    it('should have all functions defined', function() {
        expect(angular.isFunction(ConsoleHelper.findPractice)).toBe(true);
        expect(angular.isFunction(ConsoleHelper.onPracticeSelected)).toBe(true);
        expect(angular.isFunction(ConsoleHelper.showFullRole)).toBe(true);
    });

    it('tracks that the spies were called', function() {
        ConsoleHelper.onPracticeSelected($scope)(selectedPractice);
        expect(User.getAllUsers).toHaveBeenCalled();

        ConsoleHelper.findPractice($scope)(searchValue);
        expect(Practice.superUserSearchPractice).toHaveBeenCalled();

        ConsoleHelper.showFullRole()(rolesMask);
        expect(Role.getFromMask).toHaveBeenCalled();
    });

    it('check all functions are work correct', function(){
        ConsoleHelper.onPracticeSelected($scope)(selectedPractice);
        $rootScope.$apply();
        expect($scope.destinationPractice).toBe(selectedPractice);
        expect($scope.destinationPracticeUsers.length).toBe(3);
        expect(ConsoleHelper.showFullRole()(rolesMask)).toBe('Admin, Doctor');
    })

});