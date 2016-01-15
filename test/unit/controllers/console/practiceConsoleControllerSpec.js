describe("Testing Practice Console Controller", function() {
    var controller;
    var $scope;

    var userMock = [
        {"id":1,"title":"Dr.","first_name":"Alexei","middle_initial":"","last_name":"Vidmich","password":null,"practice_id":1,
            "created_at":"2015-07-02T00:00:00.000Z","updated_at":"2015-10-26T13:37:19.600Z","email":"alexei@vidmich.com",
            "authentication_token":"FtKY-UwkdE_A4uVT89TJ","roles_mask":11,"removed_at":null,"notification_preference":0,
            "no_login":false,"add_password_token":null,"last_request_at":"2015-10-26T13:37:19.587Z", "status": "registered"},

        {"id":26,"title":"","first_name":"Test","middle_initial":null,"last_name":"Test","password":null,"practice_id":1,
            "created_at":"2015-07-10T00:00:00.000Z","updated_at":"2015-10-21T12:00:21.074Z","email":"slavakravchina@gmail.com",
            "authentication_token":"HG8tEVkgmYJdHNyNjiSz","roles_mask":3,"removed_at":null,"notification_preference":1,
            "no_login":false,"add_password_token":null,"last_request_at":null, "status": "registered"}
    ];

    var practiceMock = {
        addresses: [
            {
                city: "Milford",
                created_at: "2016-01-14T14:28:13.244Z",
                id: 1,
                phone: "508-473-4999",
                practice_id: 1,
                state: "MA",
                street_line_1: "100 Medway Rd, STE 203",
                street_line_2: null,
                updated_at: "2016-01-14T14:28:13.244Z",
                website: "www.davidwolfdds.com",
                zip: "01757"
            }
        ],
        created_at: "2016-01-14T14:28:13.197Z",
        description: null,
        id: 1,
        last_4_digits: null,
        multi_specialty: true,
        name: "David Wolf, DDS, PC",
        owner: {},
        practice_type: {},
        practice_type_id: 6,
        promo_id: null,
        removed_at: null,
        status: null,
        stripe_customer_id: null,
        stripe_subscription_id: null,
        stripe_token: null,
        subscription_active_until: "2016-02-28T14:28:13.203Z",
        trial_period: true,
        updated_at: "2016-01-14T14:28:13.197Z",
        users: [],
    };

    var practiceTypesMock = [
        {"id":10,"code":"lab","name":"Dental Lab","created_at":"2015-12-11T09:18:45.711Z","updated_at":"2015-12-11T09:18:45.711Z",
            "procedures":[{"id":70,"code":"new_prescription","name":"New Prescription","practice_type_id":10,"created_at":"2015-12-11T09:18:45.713Z","updated_at":"2015-12-11T09:18:45.715Z","order_pos":1},{"id":71,"code":"follow_up","name":"Follow-up","practice_type_id":10,"created_at":"2015-12-11T09:18:45.717Z","updated_at":"2015-12-11T09:18:45.719Z","order_pos":2},{"id":72,"code":"other","name":"Other","practice_type_id":10,"created_at":"2015-12-11T09:18:45.721Z","updated_at":"2015-12-11T09:18:45.723Z","order_pos":3}]},
        {"id":6,"code":"general_dentistry","name":"General Dentistry","created_at":"2015-12-11T09:18:45.636Z","updated_at":"2015-12-11T09:18:45.636Z",
            "procedures":[{"id":54,"code":"new_patient_consultation","name":"New Patient Consultation","practice_type_id":6,"created_at":"2015-12-11T09:18:45.639Z","updated_at":"2015-12-11T09:18:45.641Z","order_pos":1},{"id":55,"code":"emergency_care","name":"Emergency Care","practice_type_id":6,"created_at":"2015-12-11T09:18:45.643Z","updated_at":"2015-12-11T09:18:45.645Z","order_pos":2},{"id":56,"code":"follow_up_care","name":"Follow-up Care","practice_type_id":6,"created_at":"2015-12-11T09:18:45.648Z","updated_at":"2015-12-11T09:18:45.650Z","order_pos":3},{"id":57,"code":"other","name":"Other","practice_type_id":6,"created_at":"2015-12-11T09:18:45.652Z","updated_at":"2015-12-11T09:18:45.654Z","order_pos":4}]},
        {"id":7,"code":"oral_pathology","name":"Oral Pathology","created_at":"2015-12-11T09:18:45.656Z","updated_at":"2015-12-11T09:18:45.656Z",
            "procedures":[{"id":58,"code":"consultation","name":"Consultation","practice_type_id":7,"created_at":"2015-12-11T09:18:45.658Z","updated_at":"2015-12-11T09:18:45.660Z","order_pos":1},{"id":59,"code":"biopsy","name":"Biopsy","practice_type_id":7,"created_at":"2015-12-11T09:18:45.662Z","updated_at":"2015-12-11T09:18:45.664Z","order_pos":2},{"id":60,"code":"other","name":"Other","practice_type_id":7,"created_at":"2015-12-11T09:18:45.666Z","updated_at":"2015-12-11T09:18:45.668Z","order_pos":3}]},
        {"id":8,"code":"tmd_sleep_apnea","name":"TMD/Sleep Apnea","created_at":"2015-12-11T09:18:45.670Z","updated_at":"2015-12-11T09:18:45.670Z",
            "procedures":[{"id":61,"code":"consultation","name":"Consultation","practice_type_id":8,"created_at":"2015-12-11T09:18:45.673Z","updated_at":"2015-12-11T09:18:45.675Z","order_pos":1},{"id":62,"code":"tmd_treatment","name":"TMD Treatment","practice_type_id":8,"created_at":"2015-12-11T09:18:45.677Z","updated_at":"2015-12-11T09:18:45.678Z","order_pos":2},{"id":63,"code":"sleep_apnea_appliance","name":"Sleep Apnea Appliance","practice_type_id":8,"created_at":"2015-12-11T09:18:45.681Z","updated_at":"2015-12-11T09:18:45.683Z","order_pos":3},{"id":64,"code":"other","name":"Other","practice_type_id":8,"created_at":"2015-12-11T09:18:45.685Z","updated_at":"2015-12-11T09:18:45.687Z","order_pos":4}]}];

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
                    },
                    showUserSpecialty: function(practiceTypes){
                        return function(specialtyId){
                            return 'Specialty Name';
                        };
                    }
                };
            }]);
            $provide.service('Procedure', ['$q', function($q){
                return {
                    practiceTypes: jasmine.createSpy('practiceTypes').and.returnValue({$promise: $q.when(practiceTypesMock)}),
                };
            }]);
            $provide.service('ModalHandler', [function(){
                var modalInstance;
                return {
                    set: function (modal) {
                        modalInstance = modal;
                    }
                };
            }]);
            $provide.service('ProviderInvitation', function(){});
            $provide.service('User', ['$q', function($q){
                return {
                    delete: function(callback){
                        callback();
                    }
                };
            }]);
            $provide.service('Notification', function(){});
            $provide.service('Address', function(){});
            $provide.service('Practice', function(){});
        });

        inject(function($injector) {
            $rootScope = $injector.get('$rootScope');
            $scope = $rootScope.$new();
            //$consoleHelper = $injector.get('ConsoleHelper');
            controller = $injector.get('$controller');
            //spyOn($consoleHelper,'findPractice').and.callThrough();
            controller('PracticeConsoleController', {
                $scope: $scope,
                Auth: {},
                //ConsoleHelper: $consoleHelper
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
        expect($scope.showUserSpecialty).toBeDefined();
        expect($scope.usersDialog).toBeDefined();
        expect($scope.editDialog).toBeDefined();
        expect($scope.deleteUser).toBeDefined();
        expect($scope.addAddress).toBeDefined();
        expect($scope.removeAddress).toBeDefined();
        expect($scope.saveAddress).toBeDefined();
        expect($scope.savePractice).toBeDefined();
        expect($scope.removePractice).toBeDefined();
        expect($scope.createPractice).toBeDefined();
    });

});
