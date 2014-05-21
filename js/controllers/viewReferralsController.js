var viewReferralModule = angular.module('viewReferrals', ['ui.bootstrap', 'angularFileUpload']);

viewReferralModule.controller('ViewReferralsController', ['$scope', '$stateParams', '$fileUploader', '$timeout', 'Referral', 'PDF', 'Note', 'S3Bucket', 'Attachment', '$modal', function ($scope, $stateParams, $fileUploader, $timeout, Referral, PDF, Note, S3Bucket, Attachment, $modal) {
    $scope.alerts = [];

    var pushAlert = function (type, message) {
        var alert = { type: type, message: message, promise: $timeout(function () {
            $scope.alerts.splice($scope.alerts.indexOf(alert), 1);
        }, 5000) };
        $scope.alerts.push(alert);

    };

    $scope.referral = Referral.get({id: $stateParams.referral_id}, function (success) {

        }, function (failure) {
            pushAlert('danger', 'Something happened... Data was not retrieved from server.')
        }
    );


    $scope.referral.$promise.then(function (data) {

        PDF.addParagraph('Patient: ' + data.patient.first_name + ' ' + data.patient.last_name);
        PDF.addParagraph('Original provider: ' + data.orig_provider.first_name + ' ' + data.orig_provider.middle_initial + ' ' + data.orig_provider.last_name);
        PDF.addParagraph('Destination provider: ' + data.dest_provider.first_name + ' ' + data.dest_provider.middle_initial + ' ' + data.dest_provider.last_name);
        PDF.addParagraph('Procedure: ' + data.procedure.name + '(' + data.procedure.practice_type.name + ')');
        if (data.teeth) {
            data.teeth = data.teeth.split('+');
            PDF.addParagraph('Teeth: ' + data.teeth.join(', '));
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
            pushAlert('danger', 'Something went wrong, note was not saved.');
        });
    };

    $scope.acceptReferral = function (referral) {
        Referral.updateStatus({id: referral.id }, {status: 'accepted'},
            function (success) {
                referral.status = 'accepted';
                $scope.acceptSuccess = true;
                $scope.failure = false;
            },
            function (failure) {
                $scope.acceptSuccess = false;
                $scope.failure = true;
            });

    };

    $scope.rejectReferral = function (referral) {
        Referral.updateStatus({id: referral.id}, {status: 'rejected'},
            function (success) {
                referral.status = 'rejected';
                $scope.acceptSuccess = true;
                $scope.failure = false;

            },
            function (failure) {
                $scope.acceptSuccess = false;
                $scope.failure = true;

            });
    };

    $scope.completeReferral = function (referral) {
        Referral.updateStatus({id: referral.id }, {status: 'completed'},
            function (success) {
                referral.status = 'completed';
                $scope.completeSuccess = true;
                $scope.failure = false;
            },
            function (failure) {
                $scope.completeSuccess = false;
                $scope.failure = true;
            });

    };

    $scope.isImage = function (attachment) {
        return attachment.filename.toLowerCase().search(/(jpg|png|gif)$/) >= 0;
    };

    $scope.attachmentThumbClass = function (attachmentFilename) {
        var type = attachmentFilename.slice(attachmentFilename.lastIndexOf('.') + 1);
        switch (type) {
            case 'doc':
            case 'docx':
                return 'attach-word';
            case 'xls':
            case 'xlsx':
                return 'attach-excel';
            case 'pdf':
                return 'attach-pdf';
            default :
                return 'attach-file';
        }
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
            console.info('After adding a file', item);
            item.upload();
        });

        uploader.bind('whenaddingfilefailed', function (event, item) {
            console.info('When adding a file failed', item);
            pushAlert('danger', 'Something went wrong while adding attachment...');
        });

        uploader.bind('afteraddingall', function (event, items) {
            console.info('After adding all files', items);
        });

        uploader.bind('beforeupload', function (event, item) {
            console.debug('FORM DATA:', uploader.formData);
            console.debug('SCOPE DATA:', $scope.s3Credentials);
            console.info('Before upload', item);
        });

        uploader.bind('progress', function (event, item, progress) {
            console.info('Progress: ' + progress, item);
        });

        uploader.bind('success', function (event, xhr, item, response) {
            console.info('Success', xhr, item, response);
            var attachment = {filename: item.url + '/' + bucket_path + item.file.name, notes: item.notes, referral_id: $scope.referral.id, created_at: Date.now()};
            Attachment.save({attachment: attachment}, function (success) {
                var index = $scope.uploader.queue.indexOf(item);
                $scope.uploader.queue.splice(index, 1);
                $scope.referral.attachments.push(attachment);
            });

        });

        uploader.bind('cancel', function (event, xhr, item) {
            console.info('Cancel', xhr, item);
            pushAlert('info', 'Attachment upload was cancelled.');
        });

        uploader.bind('error', function (event, xhr, item, response) {
            console.error('Error', xhr, item, response);
            pushAlert('danger', 'Something went wrong while adding attachment...')
        });

        uploader.bind('complete', function (event, xhr, item, response) {
            console.info('Complete', xhr, item, response);
        });

        uploader.bind('progressall', function (event, progress) {
            console.info('Total progress: ' + progress);
        });

        uploader.bind('completeall', function (event, items) {
            console.info('Complete all', items);
        });

    });

    $scope.closeAlert = function (index) {
        $timeout.cancel($scope.alerts[index].promise); //cancel automatic removal
        $scope.alerts.splice(index, 1);
    };
}]);

