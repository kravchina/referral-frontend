angular.module('viewReferrals')
    .controller('ViewReferralsController', ['$scope', '$location', '$stateParams', 'FileUploader', '$timeout', '$anchorScroll', 'Notification', 'Referral', 'Practice', 'PDF', 'Note', 'S3Bucket', 'Attachment', '$modal', 'Logger', 'Auth',  'ModalHandler', 'Spinner', 'File', 'FREE_TRIAL_PERIOD', 'API_ENDPOINT','message', 'ProgressIndicator',
    function ($scope, $location, $stateParams, FileUploader, $timeout, $anchorScroll, Notification, Referral, Practice, PDF, Note, S3Bucket, Attachment, $modal, Logger, Auth, ModalHandler, Spinner, File, FREE_TRIAL_PERIOD, API_ENDPOINT, message, ProgressIndicator) {
        $scope.uploader = new FileUploader();

        $scope.total_size = 0;

        $scope.auth = Auth.get();
        $scope.auth.is_admin = Auth.hasRole('admin');
        if(message){
            Notification.error(message);
        }

        Practice.get({practiceId: $scope.auth.practice_id}, function(practice){
            $scope.paymentNotification = {
                showTrial: practice.trial_period && new Date().getTime() < new Date(practice.subscription_active_until).getTime(),
                expirationDate: new Date(practice.subscription_active_until),
                showSubscriptionCancelled: !practice.trial_period && !practice.stripe_subscription_id && new Date().getTime() < new Date(practice.subscription_active_until).getTime()
            }
        });

        $scope.initModel = function() {
            $scope.referral = Referral.get({id: $stateParams.referral_id}, function (data) {
                    angular.forEach(data.attachments, function(attachment, key){
                        $scope.total_size = $scope.total_size + attachment.attach_file_size;
                    });

                    data.teethChart = data.teeth.split('+');
                    if(data.dest_provider_id < 0){
                        data.dest_provider = {id: data.dest_provider_id, first_name: 'First', last_name: 'Available', firstAvailable: true}
                    } else if (!data.dest_provider) {
                        data.dest_provider = data.dest_provider_invited;
                    }
                },
                function (failure) {
                    Notification.error('Something happened... Data was not retrieved from server.')
                }
            );
        };

        $scope.initModel();

        if($stateParams.isNew){
            var modalInstance = $modal.open({
                templateUrl: 'partials/referral_create_message.html',
                controller: 'ReferralSuccessModalController'
            });
            ModalHandler.set(modalInstance);
            modalInstance.result.then(function() {
                $location.hash('downloadPdf');
                $anchorScroll();
            });
        }

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

                $scope.uploader.scope = $scope;
                $scope.uploader.url = API_ENDPOINT + '/attachment/upload';
                $scope.uploader.alias= 'attach';
                $scope.uploader.formData = [
                    {referral_id: $scope.referral.id},
                    {filename: 'test'}
                ];
                $scope.uploader.headers = {'Authorization' : $scope.auth.token, 'From': $scope.auth.email};


            $scope.now = function () {
                return Date.now();
            };

            var each_file_size_limit = 50 * 1024 * 1024;
            var total_file_size_limit = 100 * 1024 * 1024;


            // Filters
            $scope.uploader.filters.push({
                name: 'fileSizeFilter',
                fn: function (item /*{File|HTMLInputElement}*/) {
                    Logger.log(item);

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
                }
            });

            // REGISTER HANDLERS
            $scope.uploader.onAfterAddingFile = function(item) {

                Logger.info('After adding a file', item);

                // show the loading indicator
                ProgressIndicator.start();
                item.formData.push({last_modified: item.file.lastModifiedDate});
                item.upload();

            };

            $scope.uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
                Logger.info('When adding a file failed', item);
                Notification.error('Something went wrong while adding attachment...');
            };

            $scope.uploader.onAfterAddingAll = function(items){
                Logger.info('After adding all files', items);
            };

            $scope.uploader.onBeforeUploadItem = function(item)  {

                Logger.debug('FORM DATA:', $scope.uploader.formData);
                Logger.debug('SCOPE DATA:', $scope.s3Credentials);
                Logger.info('Before upload', item);


            };

            $scope.uploader.onProgressItem = function(item, progress) {
                Logger.info('Progress: ' + progress, item);
            };

            $scope.uploader.onSuccessItem = function(item, response, status, headers){
                Logger.info('Success', status, item, response);
                response.recentlyAdded = true;  //this flag enables editing attachment date only for recently added attachments
                $scope.referral.attachments.push(response);
            };

            $scope.uploader.onCancelItem = function(item, response, status, headers) {
                Logger.info('Cancel', status, item);
                Notification.info('Attachment upload was cancelled.');
            };

            $scope.uploader.onErrorItem = function(item, response, status, headers) {
                Logger.error('Error', status, item, response);
                Notification.error(response.file[0] ? response.file[0] : 'An error occurred while adding attachment.' );

                // show the loading indicator
                ProgressIndicator.finish();
            };

            $scope.uploader.onCompleteItem = function(item, response, status, headers) {
                Logger.info('Complete', status, item, response);
            };

            $scope.uploader.onProgressAll = function(progress){

                Logger.info('Total progress: ' + progress);
                // show the loading indicator
                ProgressIndicator.set(progress);
            };

            $scope.uploader.onCompleteAll = function() {
                Logger.info('Complete all');

                // show the loading indicator
                ProgressIndicator.finish();
            };
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

        $scope.editDestProviderDialog = function(){
            var modalInstance = $modal.open({
                templateUrl: 'partials/change_dest_provider_form.html',
                controller: 'ChangeDestProviderModalController',
                size: 'sm',
                resolve: {
                    referral: function(){
                        return $scope.referral;
                    }
                }
            });
            ModalHandler.set(modalInstance);
            modalInstance.result.then(function (providerId) {
                $scope.initModel();  // have to reload referrer object from server, because it needs to provide object that has dest_provider attribute and many other customizations.
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
                Notification.error('Something went wrong, note was not saved.');
            });
        };

        $scope.rejectReferral = function (referral) {
            Referral.updateStatus({id: referral.id}, {status: 'active'},
                function (success) {
                    referral.status = 'active';
                    Notification.success('Status was updated successfully!');
                },
                function (failure) {
                    Notification.error('Something went wrong while changing status...');
                });
        };

        $scope.completeReferral = function (referral) {
            if(referral.dest_provider.id == -1){
                Notification.error('To complete this referral a treating provider should be selected, currently First Available is selected');
            } else {
                Referral.updateStatus({id: referral.id }, {status: 'completed'},
                    function (success) {
                        referral.status = 'completed';
                        Notification.success('Status was updated successfully!');
                    },
                    function (failure) {
                        Notification.error('Something went wrong while changing status...');
                    });
            }
        };

        $scope.userBelongsToDestPractice = function () {
            return Auth.get().practice_id == $scope.referral.dest_practice_id;
        };


        $scope.deleteAttachment = function(attachment){
            $scope.referral.attachments.splice($scope.referral.attachments.indexOf(attachment),1);
            Attachment.delete({id: attachment.id});
        };
    }]);

