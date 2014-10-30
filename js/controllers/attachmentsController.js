dentalLinks.controller('AttachmentsController', ['$scope', 'Alert', 'Auth', '$fileUploader', 'Logger',
    function ($scope, Alert, Auth, $fileUploader, Logger) {

        $scope.now = function () {
            return Date.now();
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
            url: host + '/attachment/upload',
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
            //var type = uploader.isHTML5 ? item.type : '/' + item.value.slice(item.value.lastIndexOf('.') + 1);
            //type = '|' + type.toLowerCase().slice(type.lastIndexOf('/') + 1) + '|';
            //return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;

            console.log(item);

            if (item.size > each_file_size_limit) {
                Alert.error($scope.attachment_alerts, 'You can not upload a file with more than 50 MB size.');
                return false;
            }

            if ($scope.total_size + item.size > total_file_size_limit) {
                Alert.error($scope.attachment_alerts, 'You can not upload files with more than 100 MB size.');
                return false;
            }

            $scope.total_size = $scope.total_size + item.size;

            return true;
        });

// REGISTER HANDLERS

        uploader.bind('afteraddingfile', function (event, item) {
            Logger.info('After adding a file', item);
            // marking an attachment for saving
            // $scope.model.attachments.push({url: item.url + bucket_path + item.file.name, notes: item.notes, size: item.file.size});
            item.formData.push({last_modified: item.file.lastModifiedDate});
        });

        uploader.bind('whenaddingfilefailed', function (event, item) {
            Logger.info('When adding a file failed', item);
            Alert.error($scope.alerts, 'Adding file failed. Please try again later.')
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
            item.downloadUrl = response.filename;
        });

        uploader.bind('cancel', function (event, xhr, item) {
            Logger.info('Cancel', xhr, item);
            Alert.info($scope.alerts, 'Attachment was cancelled.')
        });

        uploader.bind('error', function (event, xhr, item, response) {
            Logger.error('Error', xhr, item, response);
            Alert.error($scope.alerts, 'An error occurred during attachment upload. Please try again later.')
        });

        uploader.bind('complete', function (event, xhr, item, response) {
            Logger.info('Complete', xhr, item, response);
        });

        uploader.bind('progressall', function (event, progress) {

            Logger.info('Total progress: ' + progress);

            // show the loading indicator
            $scope.$parent.setProgress(progress)
        });

        uploader.bind('completeall', function (event, queue) {
            Logger.info('Complete all', queue);

            // show the loading indicator
            $scope.$parent.progressIndicatorEnd();
            console.log($scope.model.referral.id);
            queue.redirectCallback();

        });
    }]
);
