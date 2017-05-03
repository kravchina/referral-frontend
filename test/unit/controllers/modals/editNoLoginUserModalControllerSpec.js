describe("EditNoLoginUserModalController", function() {

    var $controller, $scope;
    var userServiceMock = {
        update: function (user) { },
        sendPasswordInvitation: function (user) { }
    };

    beforeEach(function(){
        module('ui.router');
        module('modals');
        spyOn(userServiceMock, 'update').and.callThrough();
        spyOn(userServiceMock, 'sendPasswordInvitation').and.callThrough();
        module(function($provide){
            $provide.service('User', function(){
                return userServiceMock;
            });
            $provide.service('Procedure', function(){
                return {
                    practiceTypes: function (user) {
                    }
                };
            });
        });
        inject(function($injector, _User_, _Procedure_) {
            var rootScope = $injector.get('$rootScope');
            $scope = rootScope.$new();
            $controller = $injector.get('$controller')('EditNoLoginUserModalController', { $scope: $scope, showNameControls: true, $modalInstance: null, ModalHandler: null, User: _User_, Auth: null, Alert: null, Logger: null, editUser: null, practiceType: null, Procedure: _Procedure_, practiceAddresses: null});
        });
    });

    it('is not null', function() {
        expect($controller).not.toBe(null);
    });

    it('updates user and sends user password invitation if email is entered', function(){
        var user = {email: 'email@example.com'};
        $scope.save(user);
        expect(userServiceMock.sendPasswordInvitation).toHaveBeenCalled();
        expect(userServiceMock.update).toHaveBeenCalled();
    });

    it('updates user and do not send user password invitation if email is not entered', function(){
        var user = {};
        $scope.save(user);
        expect(userServiceMock.sendPasswordInvitation).not.toHaveBeenCalled();
        expect(userServiceMock.update).toHaveBeenCalled();
    });

});