describe("Testing Plugin Console Controller", function() {
    var controller;
    var $scope;

    var dataMock = [
        {
            id: 1,
            major_part: 16,
            minor_part: 4,
            build_part: 50,
            od_version: "16.4.50",
            download_count: 0,
            plugin_file_name: "5c67b1b73cabf4626974b5a09e76de668a229aeb.dll",
            plugin_updated_at: "2016-11-06T14:10:51.525Z",
            plugin_url: "//dev-kravchina-attachments.s3.amazonaws.com/plugin/16.4.50/0488f2b01ff26254d07318516bb50b1fe4a5f2be.dll?1478441451",
            plugin_version: "2016-11-06T16:10:50.000Z",
            updated_at: "2016-11-06T14:10:51.577Z",
            created_at: "2016-10-26T14:09:02.884Z"
        },
        {
            id: 2,
            major_part: 16,
            minor_part: 3,
            build_part: 30,
            od_version: "16.3.30",
            download_count: 0,
            plugin_file_name: "5c67b1b73cabf4626974b5a09e76de668a229aeb.dll",
            plugin_updated_at: "2016-11-06T14:10:51.525Z",
            plugin_url: "//dev-kravchina-attachments.s3.amazonaws.com/plugin/16.4.50/0488f2b01ff26254d07318516bb50b1fe4a5f2be.dll?1478441451",
            plugin_version: "2016-11-06T16:10:50.000Z",
            updated_at: "2016-11-06T14:10:51.577Z",
            created_at: "2016-10-26T14:09:02.884Z"
        }
    ];

    var pluginDeleteMock = {
        id: 2,
        major_part: 16,
        minor_part: 3,
        build_part: 30,
        od_version: "16.3.30",
        download_count: 0,
        updated_at: "2016-11-06T14:10:51.577Z",
        created_at: "2016-10-26T14:09:02.884Z"
    };

    var authMock = {
        token: 'auth_token',
        email: 'test@email.com'
    };

    beforeEach(function(){
        module('ui.router');
        module('console');

        module(function($provide){
            $provide.service('DclPluginUpdate', function(){
                return {
                    query: jasmine.createSpy('query').and.callFake(function(callback){
                        callback(dataMock);
                    }),
                    delete: jasmine.createSpy('delete').and.callFake(function(param, callback){
                        callback(dataMock);
                    }),
                    deletePlugin: jasmine.createSpy('delete').and.callFake(function(param, callback){
                        callback(pluginDeleteMock);
                    })
                }
            });

            $provide.service('ModalHandler', [function(){
                var modalInstance;
                return {
                    set: function (modal) {
                        modalInstance = modal;
                    }
                };
            }]);

            $provide.service('Notification', function(){
                return {
                    success: function(message){
                        return message;
                    }
                };
            });

            $provide.service('Auth', function(){
                return {
                    get: function(){
                        return authMock;
                    }
                };
            });

            $provide.service('FileUploader', function(){
                return jasmine.createSpy('FileUploader');
            });
        });
        inject(function($rootScope, $controller, _DclPluginUpdate_) {
            $scope = $rootScope.$new();
            controller = $controller('PluginConsoleController',
                {
                    $scope: $scope,
                    DclPluginUpdate: _DclPluginUpdate_,
                    API_ENDPOINT: {},
                    ProgressIndicator: {}
                }
                );
        });
    });

    it('should have a PluginConsoleController', function() {
        expect(controller).not.toBe(null);
        expect(controller).toBeDefined();
    });

    it('check to set data on scope', function(){
        expect($scope.allVersions).toBeDefined();
        expect($scope.selectedVersion).toBeDefined();
        expect($scope.token).toBeDefined();
        expect($scope.from).toBeDefined();

        expect($scope.allVersions).toBe(dataMock);
        expect($scope.token).toBe(authMock.token);
        expect($scope.from).toBe(authMock.email);
    });

    it('check deleteVersion function', function(){
        $scope.deleteVersion({id: 2});
        expect($scope.allVersions.length).toBe(1);
    });

    it('check deletePlugin function', function(){
        $scope.deletePlugin({id: 0});
        expect($scope.allVersions[1]).toEqual(pluginDeleteMock);
        expect($scope.selectedVersion).toEqual(pluginDeleteMock);
    });

});
