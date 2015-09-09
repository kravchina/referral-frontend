angular.module('dentalLinks').controller('AttachmentsController', ['$scope', 'Notification', 'Auth', '$fileUploader', 'Logger', 'API_ENDPOINT', 'Attachment', '$modal', 'ModalHandler',
    function ($scope, Notification, Auth, $fileUploader, Logger, API_ENDPOINT, Attachment, $modal, ModalHandler) {

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

        var uploader = $scope.uploader = $fileUploader.create({
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
        uploader.filters.push(function (item /*{File|HTMLInputElement}*/) {

            if (item.size > each_file_size_limit) {
                Notification.error('You can not upload a file with more than 50 MB size.');
                return false;
            }

            if ($scope.total_size + item.size > total_file_size_limit) {
                Notification.error('You can not upload files with more than 100 MB size.');
                return false;
            }

            $scope.total_size = $scope.total_size + item.size;

            return true;
        });

// REGISTER HANDLERS

        uploader.bind('afteraddingfile', function (event, item) {
            Logger.info('After adding a file', item);
            item.metadata = {last_modified: item.file.lastModifiedDate}; //workaround - we need writable property (File object has read-only File.lastModifiedDate) to be able to change the date of the file according to https://www.pivotaltracker.com/story/show/84423098
            item.formData.push(item.metadata);
        });

        uploader.bind('whenaddingfilefailed', function (event, item) {
            Logger.info('When adding a file failed', item);
            Notification.error('Adding file failed. Please try again later.')
        });

        uploader.bind('afteraddingall', function (event, items) {
            Logger.info('After adding all files', items);
            $scope.form.$setDirty(); // for UnsavedChanges to notice attachments being changed
        });

        uploader.bind('beforeupload', function (event, item) {

            Logger.debug('FORM DATA:', uploader.formData);
            Logger.debug('SCOPE DATA:', $scope.s3Credentials);
            Logger.info('Before upload', item);

            // show the loading indicator
            $scope.$parent.progressIndicatorStart()

        });

        uploader.bind('progress', function (event, item, progress) {
            Logger.info('Progress: ' + progress, item);
        });

        uploader.bind('success', function (event, xhr, item, response) {
            Logger.info('Success', xhr, item, response);
            item.downloadUrl = response.attach_file_name;
        });

        uploader.bind('cancel', function (event, xhr, item) {
            Logger.info('Cancel', xhr, item);
            Notification.info('Attachment was cancelled.')
        });

        uploader.bind('error', function (event, xhr, item, error) {
            Logger.error('Error', xhr, item, error);
            $scope.errorMessage = error.file[0]? error.file[0] : 'An error occurred during attachment upload. Please try again later.';
            Notification.error( $scope.errorMessage);
        });

        uploader.bind('complete', function (event, xhr, item, response) {
            Logger.info('Complete', xhr, item, response);
            if (xhr.status == 201 && $scope && $scope.attachments) {
                $scope.attachments.push(response);
            }
        });

        uploader.bind('progressall', function (event, progress) {

            Logger.info('Total progress: ' + progress);

            // show the loading indicator
            $scope.$parent.setProgress(progress)
        });

        uploader.bind('completeall', function (event, queue) {
            Logger.info('Complete all', queue);
            queue.length = 0; //empty uploader queue

            // show the loading indicator
            $scope.$parent.progressIndicatorEnd();
            queue.redirectCallback($scope.errorMessage);

        });
    }]
);
