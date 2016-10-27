angular.module('console')
    .controller('PluginConsoleController', ['$scope', 'FileUploader', 'DclPluginUpdate', 'API_ENDPOINT', 'Auth', '$modal', 'ModalHandler', 'Notification', 'ProgressIndicator',
    function($scope, FileUploader, DclPluginUpdate, API_ENDPOINT, Auth, $modal, ModalHandler, Notification, ProgressIndicator){
        $scope.allVersions = [];
        $scope.selectedVersion = null;
        $scope.token = Auth.get().token;
        $scope.from = Auth.get().email;

        DclPluginUpdate.query(function (success) {
            $scope.allVersions = success;
            console.log(success);
        });

        var uploader = $scope.uploader = new FileUploader({
            scope: $scope,
            url: API_ENDPOINT + '/dcl_plugin_updates',
            alias: 'plugin',
            method: 'PUT',
            headers: {'Authorization': $scope.token, 'From': $scope.from}
        });

        uploader.onAfterAddingFile = function(item){
            console.log('After adding a file', item);
            item.url += '/' + $scope.selectedVersion.id;
            ProgressIndicator.start();
            item.upload();
        };

        uploader.onSuccessItem = function(item, response) {
            $scope.allVersions = $scope.allVersions.map(function(item){
                if(item.id == response.id) {
                    return response;
                }
                return item;
            });
            $scope.selectedVersion = response;
            ProgressIndicator.finish();
        };

        uploader.onProgressAll = function(progress) {
            ProgressIndicator.set(progress);
        };

        $scope.addVersion = function(){
            var modalInstance = $modal.open({
                templateUrl: 'partials/add_plugin_version_modal.html',
                controller: 'AddPluginVersionModalController'
            });
            ModalHandler.set(modalInstance);
            modalInstance.result.then(function (data) {
                var versionParts = data.split('.');
                DclPluginUpdate.save({od_version: data, major_part: versionParts[0], minor_part: versionParts[1], build_part: versionParts[2]}, function(success){
                    $scope.allVersions.push(success);
                    Notification.success('Version successfully added');
                }, function(failure){
                    console.log('failure: ', failure)
                });
            });
        };

        $scope.selectVersion = function(version){
            $scope.selectedVersion = version;
        };
    }]);