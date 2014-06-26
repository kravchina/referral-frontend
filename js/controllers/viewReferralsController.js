var viewReferralModule = angular.module('viewReferrals', ['ui.bootstrap', 'angularFileUpload']);

viewReferralModule.controller('ViewReferralsController', ['$scope', '$stateParams', '$fileUploader', '$timeout', 'Alert', 'Referral', 'PDF', 'Note', 'S3Bucket', 'Attachment', '$modal', 'Logger', 'Auth',
    function ($scope, $stateParams, $fileUploader, $timeout, Alert, Referral, PDF, Note, S3Bucket, Attachment, $modal, Logger, Auth) {
        $scope.alerts = [];
        $scope.attachment_alerts = [];

        $scope.total_size = 0;

        PDF.init();

        $scope.referral = Referral.get({id: $stateParams.referral_id}, function (success) {
                angular.forEach(success.attachments, function(attachment, key){
                    console.log(attachment);
                    $scope.total_size = $scope.total_size + attachment.size;
                });

                console.log($scope.total_size);

                if (!success.dest_provider) {
                    success.dest_provider = success.dest_provider_invited;
                }

            },
            function (failure) {
                Alert.error($scope.alerts, 'Something happened... Data was not retrieved from server.')
            }
        );

        $scope.referral.$promise.then(function (data) {
            PDF.addParagraph('Patient: ', data.patient.first_name + ' ' + data.patient.last_name);
            if (data.orig_provider) {
                PDF.addParagraph('Original provider: ', data.orig_provider.first_name + ' ' + data.orig_provider.middle_initial + ' ' + data.orig_provider.last_name);
            }
            if ((data.dest_provider || {}).practice) {
                PDF.addParagraph('Destination practice: ', (data.dest_provider.practice || {}).name);
            }
            var address = ((data.dest_provider || {}).practice || {}).address;
            if (address) {
                PDF.addParagraph('Practice address: ', address.street_line_1 + ', ' + address.city + ', ' + address.state + ', ' + address.zip);
                PDF.addParagraph('Practice phone: ', address.phone);
                PDF.addParagraph('Practice website: ', address.website);
            }
            if (data.dest_provider) {
                PDF.addParagraph('Destination provider: ', (data.dest_provider || {}).first_name + ' ' + (data.dest_provider || {}).middle_initial + ' ' + (data.dest_provider || {}).last_name);
            }
            if (data.procedure) {
                PDF.addParagraph('Procedure: ', data.procedure.name + '(' + (data.procedure.practice_type || {}).name + ')');
            }
            if (data.teeth) {
                data.teethChart = data.teeth.split('+');
                PDF.addParagraph('Teeth: ', data.teethChart.join(', '));
            }
            PDF.addNotes(data.notes);
        });

        var buildFileName = function (suffix) {
            return $scope.referral.patient.first_name + '-' + $scope.referral.patient.last_name + '-' + suffix + '.pdf';
        };

        $scope.savePdf = function () {
            PDF.save(buildFileName('referral'));
        };

        $scope.savePatientPdf = function () {
            PDF.saveForPatient(buildFileName('patient'));
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
                Alert.error($scope.alerts, 'Something went wrong, note was not saved.');
            });
        };

        $scope.rejectReferral = function (referral) {
            Referral.updateStatus({id: referral.id}, {status: 'sent'},
                function (success) {
                    referral.status = 'sent';
                    Alert.success($scope.alerts, 'Status was updated successfully!');
                },
                function (failure) {
                    Alert.error($scope.alerts, 'Something went wrong while changing status...');
                });
        };

        $scope.completeReferral = function (referral) {
            Referral.updateStatus({id: referral.id }, {status: 'completed'},
                function (success) {
                    referral.status = 'completed';
                    Alert.success($scope.alerts, 'Status was updated successfully!');
                },
                function (failure) {
                    Alert.error($scope.alerts, 'Something went wrong while changing status...');
                });

        };

        $scope.isImage = function (attachment) {
            return attachment.filename.toLowerCase().search(/(jpg|png|gif)$/) >= 0;
        };

        $scope.userBelongsToDestPractice = function () {
            return Auth.get().practice_id == $scope.referral.dest_practice_id;
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

            var each_file_size_limit = 50 * 1024 * 1024;
            var total_file_size_limit = 100 * 1024 * 1024;


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
                item.upload();
            });

            uploader.bind('whenaddingfilefailed', function (event, item) {
                Logger.info('When adding a file failed', item);
                Alert.error($scope.alerts, 'Something went wrong while adding attachment...');
            });

            uploader.bind('afteraddingall', function (event, items) {
                Logger.info('After adding all files', items);
            });

            uploader.bind('beforeupload', function (event, item) {
                Logger.debug('FORM DATA:', uploader.formData);
                Logger.debug('SCOPE DATA:', $scope.s3Credentials);
                Logger.info('Before upload', item);
            });

            uploader.bind('progress', function (event, item, progress) {
                Logger.info('Progress: ' + progress, item);
            });

            uploader.bind('success', function (event, xhr, item, response) {
                Logger.info('Success', xhr, item, response);
                var attachment = {filename: item.url + '/' + bucket_path + item.file.name, size: item.file.size, notes: item.notes, referral_id: $scope.referral.id, created_at: Date.now()};
                Attachment.save({attachment: attachment}, function (newAttachment) {
                    $scope.referral.attachments.push(newAttachment);
                    Alert.success($scope.alerts, 'Attachment was added successfully!');
                });

            });

            uploader.bind('cancel', function (event, xhr, item) {
                Logger.info('Cancel', xhr, item);
                Alert.info($scope.alerts, 'Attachment upload was cancelled.');
            });

            uploader.bind('error', function (event, xhr, item, response) {
                Logger.error('Error', xhr, item, response);
                Alert.error($scope.alerts, 'Something went wrong while adding attachment...');
            });

            uploader.bind('complete', function (event, xhr, item, response) {
                Logger.info('Complete', xhr, item, response);
            });

            uploader.bind('progressall', function (event, progress) {
                Logger.info('Total progress: ' + progress);
            });

            uploader.bind('completeall', function (event, items) {
                Logger.info('Complete all', items);
            });

        });

        $scope.closeAlert = function (index) {
            $timeout.cancel($scope.alerts[index].promise); //cancel automatic removal
            $scope.alerts.splice(index, 1);
        };

        $scope.closeAttachmentAlert = function (index) {
            $timeout.cancel($scope.attachment_alerts[index].promise); //cancel automatic removal
            $scope.attachment_alerts.splice(index, 1);
        };
    }]);

