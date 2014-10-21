var viewReferralModule = angular.module('viewReferrals', ['ui.bootstrap', 'angularFileUpload']);

viewReferralModule.controller('ViewReferralsController', ['$scope', '$stateParams', '$fileUploader', '$timeout', 'Alert', 'Referral', 'PDF', 'Note', 'S3Bucket', 'Attachment', '$modal', 'Logger', 'Auth',  'ModalHandler', 'Spinner', 'File', 'FREE_TRIAL_PERIOD',
    function ($scope, $stateParams, $fileUploader, $timeout, Alert, Referral, PDF, Note, S3Bucket, Attachment, $modal, Logger, Auth, ModalHandler, Spinner, File, FREE_TRIAL_PERIOD) {
        $scope.alerts = [];
        $scope.attachment_alerts = [];

        $scope.total_size = 0;

        auth = Auth.get() || {};
        $scope.token = auth.token;
        $scope.from = auth.email;

        Auth.current_user.$promise.then(function (data) {
            $scope.stripe_customer_id = data.practice.stripe_customer_id;
            console.log(FREE_TRIAL_PERIOD); 
            $scope.trial_end_date = new Date(data.practice.created_at);
            $scope.trial_end_date.setDate($scope.trial_end_date.getDate() + FREE_TRIAL_PERIOD)
        });

        $scope.referral = Referral.get({id: $stateParams.referral_id}, function (data) {
                angular.forEach(data.attachments, function(attachment, key){
                    $scope.total_size = $scope.total_size + attachment.size;
                });

                angular.forEach(data.notes, function(note, key){
                    if (note.user){
                        note['user_first_name'] = note.user.first_name;
                        note['user_last_name'] = note.user.last_name;
                    }
                });

                data.teethChart = data.teeth.split('+');

                console.log($scope.total_size);

                if (!data.dest_provider) {
                    data.dest_provider = data.dest_provider_invited;
                }

                console.log(data);

            },
            function (failure) {
                Alert.error($scope.alerts, 'Something happened... Data was not retrieved from server.')
            }
        );

        $scope.referral.$promise.then(function (data) {
            Logger.debug('Filling in PDF data...');
            PDF.prepare(data);
            Logger.debug('Filled in PDF data.');

            var uploader = $scope.uploader = $fileUploader.create({
                scope: $scope,
                url: host + '/attachment/upload',
                formData: [
                    {referral_id: $scope.referral.id},
                    {filename: 'test'}
                ],
                headers: {'Authorization' : $scope.token, 'From': $scope.from}
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

                // show the loading indicator
                $scope.$parent.progressIndicatorStart();
                item.formData.push({last_modified: item.file.lastModifiedDate});
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
                $scope.referral.attachments.push(response);
            });

            uploader.bind('cancel', function (event, xhr, item) {
                Logger.info('Cancel', xhr, item);
                Alert.info($scope.alerts, 'Attachment upload was cancelled.');
            });

            uploader.bind('error', function (event, xhr, item, response) {
                Logger.error('Error', xhr, item, response);
                Alert.error($scope.alerts, 'Something went wrong while adding attachment...');

                // show the loading indicator
                $scope.$parent.progressIndicatorEnd()
            });

            uploader.bind('complete', function (event, xhr, item, response) {
                Logger.info('Complete', xhr, item, response);
            });

            uploader.bind('progressall', function (event, progress) {

                Logger.info('Total progress: ' + progress);
                // show the loading indicator
                $scope.$parent.setProgress(progress)
            });

            uploader.bind('completeall', function (event, items) {
                Logger.info('Complete all', items);

                // show the loading indicator
                $scope.$parent.progressIndicatorEnd()

            });
        });


        var buildFileName = function (suffix) {
            return $scope.referral.patient.first_name + '-' + $scope.referral.patient.last_name + '-' + suffix + '.pdf';
        };

        $scope.savePdf = function () {
            Spinner.show();
            $timeout(function () {
                PDF.save(buildFileName('referral'));
                Spinner.hide();
            }, 50);

        };

        $scope.savePatientPdf = function () {
            Spinner.show();
            $timeout(function () {
                PDF.saveForPatient(buildFileName('patient'));
                Spinner.hide();
            }, 50);
        };

        $scope.noteDialog = function () {
            var modalInstance = $modal.open({
                templateUrl: 'partials/note_form.html',
                controller: 'NoteModalController'
            });
            ModalHandler.set(modalInstance);
            modalInstance.result.then(function (note) {
                submitNote(note);
            });

        };

        var submitNote = function (note) {
            Note.save({note: {message: note, referral_id: $scope.referral.id, user_id: auth.id}}, function (success) {
                $scope.referral.notes.push({message: note, created_at: Date.now(), user_first_name: Auth.current_user.first_name, user_last_name: Auth.current_user.last_name});
            }, function (failure) {
                Alert.error($scope.alerts, 'Something went wrong, note was not saved.');
            });
        };

        $scope.rejectReferral = function (referral) {
            Referral.updateStatus({id: referral.id}, {status: 'active'},
                function (success) {
                    referral.status = 'active';
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

        $scope.userBelongsToDestPractice = function () {
            return Auth.get().practice_id == $scope.referral.dest_practice_id;
        };

        $scope.closeAlert = function (index) {
            $timeout.cancel($scope.alerts[index].promise); //cancel automatic removal
            $scope.alerts.splice(index, 1);
        };

        $scope.closeAttachmentAlert = function (index) {
            $timeout.cancel($scope.attachment_alerts[index].promise); //cancel automatic removal
            $scope.attachment_alerts.splice(index, 1);
        };
    }]);

