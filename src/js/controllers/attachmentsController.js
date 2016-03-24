angular.module('dentalLinks').controller('AttachmentsController', ['$scope', 'Notification', 'Auth', 'FileUploader', 'Logger', 'API_ENDPOINT', 'Attachment', '$modal', 'ModalHandler', 'ProgressIndicator',
    function ($scope, Notification, Auth, FileUploader, Logger, API_ENDPOINT, Attachment, $modal, ModalHandler, ProgressIndicator) {
        $scope.now = function () {
            return Date.now();
        };

        $scope.openDatePicker = function(attachment){
            var modalInstance = $modal.open({
                templateUrl: 'partials/date_picker.html',
                controller: 'DatePickerModalController',
                resolve: {
                    currentDate: function(){
                        return attachment.metadata.last_modified;
                    }
                }
            });
            ModalHandler.set(modalInstance);
            modalInstance.result.then(function (date) {
                attachment.metadata.last_modified = date; //we need write-enabled property so it is necessary
            });
        };

        $scope.deleteAttachment = function(attachment){
            if(typeof attachment.id !== 'undefined'){
                $scope.attachments.splice($scope.attachments.indexOf(attachment),1);
                Attachment.delete({id: attachment.id});
            }
            else{
                $scope.uploader.queue.splice($scope.uploader.queue.indexOf(attachment),1);
            }
        };

        $scope.current_user = Auth.current_user;

        $scope.token = Auth.get().token;
        $scope.from = Auth.get().email;

        // non-displayed list of attachments to be uploaded on Save or Send
        $scope.model.attachments = [];
        $scope.total_size = 0;

        angular.forEach($scope.attachments, function (attachment, key) {
            $scope.total_size += $scope.total_size + attachment.size;
        });

        var uploader = $scope.uploader = new FileUploader({
            scope: $scope,
            url: API_ENDPOINT + '/attachment/upload',
            alias: 'attach',
            formData: [
                {filename: ''}
            ],
            headers: {'Authorization': $scope.token, 'From': $scope.from}
        });

        var each_file_size_limit = 50 * 1024 * 1024;
        var total_file_size_limit = 100 * 1024 * 1024;

        $scope.attachment_error = false;

// Filters
        uploader.filters.push({
            name: 'fileSizeFilter',
            fn: function (item /*{File|HTMLInputElement}*/) {

                if (item.size > each_file_size_limit) {
                    Notification.error('Files larger than ' + parseInt(each_file_size_limit/1048576) + ' MB are not accepted.');
                    return false;
                }

                if ($scope.total_size + item.size > total_file_size_limit) {
                    Notification.error('You can not upload files with more than ' + parseInt(total_file_size_limit/1048576) + ' MB size.');
                    return false;
                }

                $scope.total_size = $scope.total_size + item.size;

                return true;
            }
        });

// REGISTER HANDLERS

        uploader.onAfterAddingFile = function(item){
            Logger.info('After adding a file', item);
            item.metadata = {last_modified: item.file.lastModifiedDate}; //workaround - we need writable property (File object has read-only File.lastModifiedDate) to be able to change the date of the file according to https://www.pivotaltracker.com/story/show/84423098
            item.formData.push(item.metadata);
        };

        uploader.onWhenAddingFileFailed = function(item) {
            Logger.info('When adding a file failed', item);
            if(!Notification.get().message || Notification.get().type != 'danger') {
                Notification.error('Adding file failed. Please try again later.')
            }
        };

        uploader.onAfterAddingAll = function(items) {
            Logger.info('After adding all files', items);
            $scope.form.$setDirty(); // for UnsavedChanges to notice attachments being changed
        };

        uploader.onBeforeUploadItem = function(item) {

            Logger.debug('FORM DATA:', uploader.formData);
            Logger.debug('SCOPE DATA:', $scope.s3Credentials);
            Logger.info('Before upload', item);

            // show the loading indicator
            ProgressIndicator.start();

        };

        uploader.onProgressItem = function(item, progress){
            Logger.info('Progress: ' + progress, item);
        };

        uploader.onSuccessItem = function(item, response, status, headers) {
            Logger.info('Success', item, response);
            item.downloadUrl = response.attach_file_name;
        };

        uploader.onCancelItem = function(item, response, status, headers) {
            Logger.info('Cancel', response, item);
            Notification.info('Attachment was cancelled.')
        };

        uploader.onErrorItem = function(item, response, status, headers) {
            Logger.error('Error', response, item, status);
            ProgressIndicator.finish();
            $scope.errorMessage = response.file? response.file[0] : response.attach? response.attach[0] : 'An error occurred during attachment upload. Please try again later.';
            Notification.error( $scope.errorMessage);
        };

        uploader.onCompleteItem = function(item, response, status, headers){
            Logger.info('Complete', status, item, response);
            if (status == 201 && $scope && $scope.attachments) {
                $scope.attachments.push(response);
            }
        };

        uploader.onProgressAll = function(progress) {

            Logger.info('Total progress: ' + progress);

            // show the loading indicator
           ProgressIndicator.set(progress);
        };

        uploader.onCompleteAll = function()  {//todo finish updating file upload component
            var queue = uploader.queue;
            Logger.info('Complete all', queue);
            queue.length = 0; //empty uploader queue

            // show the loading indicator
            ProgressIndicator.finish();
            queue.redirectCallback($scope.errorMessage);

        };
    }]
);
