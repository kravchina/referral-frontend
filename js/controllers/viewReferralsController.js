var viewReferralModule = angular.module('viewReferrals', ['ui.bootstrap', 'angularFileUpload']);

viewReferralModule.controller('ViewReferralsController', ['$scope', '$stateParams', '$fileUploader', '$timeout', 'Alert', 'Referral', 'PDF', 'Note', 'S3Bucket', 'Attachment', '$modal', 'dlLogger',
    function ($scope, $stateParams, $fileUploader, $timeout, Alert, Referral, PDF, Note, S3Bucket, Attachment, $modal, dlLogger) {
    $scope.alerts = [];
    PDF.init();
    
    $scope.referral = Referral.get({id: $stateParams.referral_id}, function (success) { },
        function (failure) {
            Alert.push('danger', 'Something happened... Data was not retrieved from server.')
        }
    );


    $scope.referral.$promise.then(function (data) {

        PDF.addParagraph('Patient: ', data.patient.first_name + ' ' + data.patient.last_name);
        PDF.addParagraph('Original provider: ', (data.orig_provider || {}).first_name + ' ' + (data.orig_provider || {}).middle_initial + ' ' + (data.orig_provider || {}).last_name);
        PDF.addParagraph('Destination practice: ', data.dest_provider.practice.name);
        var address = data.dest_provider.practice.address;
        PDF.addParagraph('Practice address: ', address.street_line_1 + ', ' + address.city + ', ' + address.state + ', ' + address.zip);
        PDF.addParagraph('Practice phone: ', address.phone);
        PDF.addParagraph('Practice website: ', address.website);
        PDF.addParagraph('Destination provider: ', (data.dest_provider || {}).first_name + ' ' + (data.dest_provider || {}).middle_initial + ' ' + (data.dest_provider || {}).last_name);
        PDF.addParagraph('Procedure: ', (data.procedure || {}).name + '(' + ((data.procedure || {}).practice_type || {}).name + ')');
        if (data.teeth) {
            data.teethChart = data.teeth.split('+');
            PDF.addParagraph('Teeth: ', data.teethChart.join(', '));
        }
        PDF.addNotes(data.notes);
    });

    $scope.savePdf = function () {
        PDF.save('referral.pdf')
    };

    $scope.noteDialog = function () {
        var modalInstance = $modal.open({
            templateUrl: 'partials/note_form.html',
            controller: 'NoteModalController'
        });

        modalInstance.result.then(function (note) {
            submitNote(note);
        });

    };

    var submitNote = function (note) {
        Note.save({note: {message: note, referral_id: $scope.referral.id}}, function (success) {
            $scope.referral.notes.push({message: note, created_at: Date.now()});
        }, function (failure) {
            Alert.push($scope.alerts, 'danger', 'Something went wrong, note was not saved.');
        });
    };

    $scope.rejectReferral = function (referral) {
        Referral.updateStatus({id: referral.id}, {status: 'sent'},
            function (success) {
                referral.status = 'sent';
                Alert.push($scope.alerts, 'success', 'Status was updated successfully!');
            },
            function (failure) {
                Alert.push($scope.alerts, 'danger', 'Something went wrong while changing status...');
            });
    };

    $scope.completeReferral = function (referral) {
        Referral.updateStatus({id: referral.id }, {status: 'completed'},
            function (success) {
                referral.status = 'completed';
                Alert.push($scope.alerts, 'success', 'Status was updated successfully!');
            },
            function (failure) {
                Alert.push($scope.alerts, 'danger', 'Something went wrong while changing status...');
            });

    };

    $scope.isImage = function (attachment) {
        return attachment.filename.toLowerCase().search(/(jpg|png|gif)$/) >= 0;
    };

    S3Bucket.getCredentials(function (success) {
        var bucket_path = 'uploads/';
        var uploader = $scope.uploader = $fileUploader.create({
            scope: $scope,
            url: 'https://dev1-attachments.s3.amazonaws.com',
            formData: [
                { key: bucket_path + '${filename}' },
                {AWSAccessKeyId: success.s3_access_key_id},
                {acl: 'public-read'},
                {success_action_status: '200'},
                {policy: success.s3_policy},
                {signature: success.s3_signature}
            ]
        });

        $scope.now = function () {
            return Date.now();
        };


        // REGISTER HANDLERS
        uploader.bind('afteraddingfile', function (event, item) {
            dlLogger.info('After adding a file', item);
            item.upload();
        });

        uploader.bind('whenaddingfilefailed', function (event, item) {
            dlLogger.info('When adding a file failed', item);
            Alert.push($scope.alerts, 'danger', 'Something went wrong while adding attachment...');
        });

        uploader.bind('afteraddingall', function (event, items) {
            dlLogger.info('After adding all files', items);
        });

        uploader.bind('beforeupload', function (event, item) {
            dlLogger.debug('FORM DATA:', uploader.formData);
            dlLogger.debug('SCOPE DATA:', $scope.s3Credentials);
            dlLogger.info('Before upload', item);
        });

        uploader.bind('progress', function (event, item, progress) {
            dlLogger.info('Progress: ' + progress, item);
        });

        uploader.bind('success', function (event, xhr, item, response) {
            dlLogger.info('Success', xhr, item, response);
            var attachment = {filename: item.url + '/' + bucket_path + item.file.name, notes: item.notes, referral_id: $scope.referral.id, created_at: Date.now()};
            Attachment.save({attachment: attachment}, function (success) {
                Alert.push($scope.alerts, 'success', 'Attachment was added successfully!');
            });

        });

        uploader.bind('cancel', function (event, xhr, item) {
            dlLogger.info('Cancel', xhr, item);
            Alert.push($scope.alerts, 'info', 'Attachment upload was cancelled.');
        });

        uploader.bind('error', function (event, xhr, item, response) {
            dlLogger.error('Error', xhr, item, response);
            Alert.push($scope.alerts, 'danger', 'Something went wrong while adding attachment...');
        });

        uploader.bind('complete', function (event, xhr, item, response) {
            dlLogger.info('Complete', xhr, item, response);
        });

        uploader.bind('progressall', function (event, progress) {
            dlLogger.info('Total progress: ' + progress);
        });

        uploader.bind('completeall', function (event, items) {
            dlLogger.info('Complete all', items);
        });

    });

    $scope.closeAlert = function (index) {
        $timeout.cancel($scope.alerts[index].promise); //cancel automatic removal
        $scope.alerts.splice(index, 1);
    };
}]);

