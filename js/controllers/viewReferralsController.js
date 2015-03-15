var viewReferralModule = angular.module('viewReferrals', ['ui.bootstrap', 'angularFileUpload']);

viewReferralModule.controller('ViewReferralsController', ['$scope', '$stateParams', '$fileUploader', '$timeout', 'Alert', 'Referral', 'PDF', 'Note', 'S3Bucket', 'Attachment', '$modal', 'Logger', 'Auth',  'ModalHandler', 'Spinner', 'File', 'FREE_TRIAL_PERIOD', 'API_ENDPOINT','message',
    function ($scope, $stateParams, $fileUploader, $timeout, Alert, Referral, PDF, Note, S3Bucket, Attachment, $modal, Logger, Auth, ModalHandler, Spinner, File, FREE_TRIAL_PERIOD, API_ENDPOINT, message) {
        $scope.alerts = [];
        $scope.attachment_alerts = [];

        $scope.total_size = 0;

        $scope.auth = Auth.get();
        if(message){
            Alert.error($scope.attachment_alerts, message);
        }

        Auth.current_user.$promise.then(function (data) {
            $scope.stripe_customer_id = data.practice.stripe_customer_id;
            $scope.trial_end_date = new Date(data.practice.created_at);
            $scope.trial_end_date.setDate($scope.trial_end_date.getDate() + FREE_TRIAL_PERIOD)
        });

        $scope.referral = Referral.get({id: $stateParams.referral_id}, function (data) {
                angular.forEach(data.attachments, function(attachment, key){
                    $scope.total_size = $scope.total_size + attachment.size;
                });

                data.teethChart = data.teeth.split('+');
                if(data.dest_provider_id < 0){
                    data.dest_provider = {id: data.dest_provider_id, first_name: 'First', last_name: 'Available', firstAvailable: true}
                } else if (!data.dest_provider) {
                    data.dest_provider = data.dest_provider_invited;
                }
            },
            function (failure) {
                Alert.error($scope.alerts, 'Something happened... Data was not retrieved from server.')
            }
        );
        $scope.openDatePicker = function(attachment){
            var modalInstance = $modal.open({
                templateUrl: 'partials/date_picker.html',
                controller: 'DatePickerModalController',
                resolve: {
                    currentDate: function(){
                        return attachment.last_modified;
                    }
                }
            });
            ModalHandler.set(modalInstance);
            modalInstance.result.then(function (date) {
                Attachment.update({id:attachment.id}, {last_modified: date}, function(success){
                    attachment.last_modified = date;
                });
            });
        };

        $scope.referral.$promise.then(function (data) {
            Logger.debug('Filling in PDF data...');
            PDF.prepare(data);
            Logger.debug('Filled in PDF data.');

            var uploader = $scope.uploader = $fileUploader.create({
                scope: $scope,
                url: API_ENDPOINT + '/attachment/upload',
                formData: [
                    {referral_id: $scope.referral.id},
                    {filename: 'test'}
                ],
                headers: {'Authorization' : $scope.auth.token, 'From': $scope.auth.email}
            });

            $scope.now = function () {
                return Date.now();
            };

            var each_file_size_limit = 50 * 1024 * 1024;
            var total_file_size_limit = 100 * 1024 * 1024;


            // Filters
            uploader.filters.push(function (item /*{File|HTMLInputElement}*/) {
                Logger.log(item);

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
                response.recentlyAdded = true;  //this flag enables editing attachment date only for recently added attachments
                $scope.referral.attachments.push(response);

            });

            uploader.bind('cancel', function (event, xhr, item) {
                Logger.info('Cancel', xhr, item);
                Alert.info($scope.alerts, 'Attachment upload was cancelled.');
            });

            uploader.bind('error', function (event, xhr, item, error) {
                Logger.error('Error', xhr, item, error);
                Alert.error($scope.attachment_alerts, error.file[0] ? error.file[0] : 'An error occurred while adding attachment.' );

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
            PDF.save(buildFileName('referral'));
        };

        $scope.savePatientPdf = function () {
            PDF.saveForPatient(buildFileName('patient'));
        };

        $scope.editPatientDialog = function(){
            var modalInstance = $modal.open({
                templateUrl: 'partials/patient_form.html',
                controller: 'EditPatientModalController',
                resolve: {
                    patientForEdit: function(){
                        return $scope.referral.patient;
                    }
                }
            });
            ModalHandler.set(modalInstance);
            modalInstance.result.then(function (patient) {
                $scope.referral.patient = patient;
            });
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
            Note.save({note: {message: note, referral_id: $scope.referral.id, user_id: $scope.auth.id}}, function (success) {
                $scope.referral.notes.push({message: note, created_at: Date.now(), user: {first_name: Auth.current_user.first_name, last_name: Auth.current_user.last_name}});
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

