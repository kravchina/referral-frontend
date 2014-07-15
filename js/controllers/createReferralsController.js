var createReferralModule = angular.module('createReferrals', ['ui.bootstrap', 'angularFileUpload']);

createReferralModule.controller('CreateReferralsController', ['$scope', '$state', '$stateParams', 'Alert', 'Auth', 'Practice', 'Patient', 'Procedure', 'User', 'Referral', 'S3Bucket', 'Spinner', '$modal', '$fileUploader', 'UnsavedChanges', 'Logger', 'ModalHandler', 'File',
    function ($scope, $state, $stateParams, Alert, Auth, Practice, Patient, Procedure, User, Referral, S3Bucket, Spinner, $modal, $fileUploader, UnsavedChanges, Logger, ModalHandler, File) {

        $scope.alerts = [];
        $scope.attachment_alerts = [];

        if ($stateParams.referral_id) {
            Logger.debug('Referral id present, getting referral #' + $stateParams.referral_id + '...');
            Referral.get({id: $stateParams.referral_id}).$promise.then(function (referral) {
                Logger.debug('Got referral #' + $stateParams.referral_id + ', referral status: ' + referral.status);
                if ('draft' != referral.status) {
                    Logger.debug('Redirecting to viewReferral...');
                    $state.go('viewReferral', {referral_id: $stateParams.referral_id});
                    return;
                }

                Logger.debug('Setting $scope values from obtained referral...');
                $scope.patient = referral.patient;
                $scope.destinationPractice = referral.dest_provider.practice;
                $scope.model.dest_provider = referral.dest_provider_id;
                $scope.practiceType = referral.procedure.practice_type;
                $scope.model.referral.id = referral.id;
                $scope.model.referral.procedure_id = referral.procedure.id;

                Procedure.practiceTypes().$promise.then(function (types) {
                    $scope.practiceTypes = types;
                    $scope.updatePracticeType(referral.procedure);
                });
                $scope.model.referral.notes = referral.notes;
                $scope.attachments = referral.attachments;
                teeth = $scope.teeth = referral.teeth.split('+');
                Logger.debug('Set $scope values from obtained referral.');
            });

        }

        $scope.isImage = File.isImage;

        $scope.closeAlert = function (index) {
            Alert.close($scope.alerts, index);
        };

        $scope.closeAttachmentAlert = function (index) {
            Alert.close($scope.attachment_alerts, index);
        };

        $scope.procedures = Procedure.query();

        $scope.practiceTypes = Procedure.practiceTypes();

        $scope.providers = User.query(function (success) {
        }, function (failure) {
            Alert.error($scope.alerts, 'Server doesn\'t respond. Please try again later');
        });

        $scope.model = {referral: {notes_attributes: [], notes: []}, practice: {}};

        $scope.updatePracticeType = function (item) {
            for (var i = 0; i < $scope.practiceTypes.length; i++) {
                if ($scope.practiceTypes[i].id == item.practice_type_id) {
                    $scope.practiceType = $scope.practiceTypes[i];
                    break;
                }
            }
        };

        $scope.now = function () {
            return Date.now();
        };

        var prepareSubmit = function (model) {
            if (!model.referral.dest_provider_invited_id) {
                //if provider was not invited, but existing one was selected.
                /*We have two different situations
                 1)when provider was invited (but not registered)
                 in that case we save dest_provider_invited_id that is a foreign key from provider_invitations table
                 2)provider is registered and selected from dropdown
                 in that case we save dest_provider_id that is a foreign key from users table
                 * */
                model.referral.dest_provider_id = model.dest_provider;
            }
            model.referral.dest_practice_id = $scope.destinationPractice.id;
            model.referral.patient_id = $scope.patient.id;
            model.referral.teeth = teeth.join('+');
            for (var i = 0; i < $scope.uploader.queue.length; i++) {
                var item = $scope.uploader.queue[i];
                item.upload();
            }

        };

        $scope.saveTemplate = function (model) {

            prepareSubmit(model);
            var resultHandlers = {
                success: function (success) {
                    $scope.model.referral.id = success.id;
                    $scope.model.attachments = [];
                    $scope.model.referral.notes_attributes = [];
                    Alert.success($scope.alerts, 'Template was saved successfully!');
                    UnsavedChanges.setUnsavedChanges(false);

                }, failure: function (failure) {
                    Alert.error($scope.alerts, 'An error occurred during referral template creation...');

                }};
            if ($scope.model.referral.id) {
                //edit existing referral
                Referral.update({id: $scope.model.referral.id}, model, resultHandlers.success, resultHandlers.failure);
            } else {
                Referral.saveTemplate(model, resultHandlers.success, resultHandlers.failure);
            }
        };

        $scope.createReferral = function (model) {
            var resultHandlers = {
                success: function (referral) {
                    Logger.debug('Sent referral #' + referral.id);
                    Alert.success($scope.alerts, 'Referral was sent successfully!');
                    UnsavedChanges.setUnsavedChanges(false);
                    $state.go('viewReferral', {referral_id: referral.id});
                },
                failure: function (failure) {
                    Alert.error($scope.alerts, 'An error occurred during referral creation...');
                }
            };


            prepareSubmit(model);
            if (model.referral.id) {
                model.referral.status = 'new';
                Referral.update({id: model.referral.id}, model, resultHandlers.success, resultHandlers.failure);
            } else {
                Referral.save(model, resultHandlers.success, resultHandlers.failure);
            }
        };

        $scope.findPatient = function (searchValue) {
            Spinner.hide(); //workaround that disables spinner to avoid flicker.
            return Patient.searchPatient({practice_id: Auth.get().practice_id, search: searchValue}).$promise.then(function (res) {
                Spinner.show();
                return res;
            });
        };

        $scope.findPractice = function (searchValue) {
            Spinner.hide(); //workaround that disables spinner to avoid flicker.
            return Practice.searchPractice({search: searchValue }).$promise.then(function (res) {
                Spinner.show();
                return res;
            });
        };

        $scope.patientDialog = function () {
            var modalInstance = $modal.open({
                templateUrl: 'partials/patient_form.html',
                controller: 'PatientModalController'
            });
            ModalHandler.set(modalInstance);
            modalInstance.result.then(function (patient) {
                $scope.patient = patient;
                $scope.form.patient.$setValidity('editable', true);
            });
        };

        $scope.providerDialog = function () {
            var modalInstance = $modal.open({
                templateUrl: 'partials/provider_form.html',
                controller: 'ProviderModalController'
            });
            ModalHandler.set(modalInstance);
            modalInstance.result.then(function (provider) {
                $scope.destinationPractice = $scope.destinationPractice || {users: [], name: ''};
                $scope.destinationPractice.users.push(provider);
                $scope.model.dest_provider = provider.id;
                $scope.model.referral.dest_provider_invited_id = provider.id;
                //$scope.provider = provider;
            });
        };

        $scope.noteDialog = function () {
            var modalInstance = $modal.open({
                templateUrl: 'partials/note_form.html',
                controller: 'NoteModalController'
            });
            ModalHandler.set(modalInstance);
            modalInstance.result.then(function (note) {
                processFormChange(note);
                $scope.model.referral.notes.push({message: note, created_at: Date.now()});
                $scope.model.referral.notes_attributes.push({message: note, created_at: Date.now()});
            });
        };

        var teeth = $scope.teeth = [];
        $scope.toggleTooth = function (toothNumber) {
            processFormChange(toothNumber);
            var index = teeth.indexOf(toothNumber);
            if (index == -1) {
                teeth.push(toothNumber);
            } else {
                teeth.splice(index, 1);
            }
        };


        // non-displayed list of attachments to be uploaded on Save or Send
        $scope.model.attachments = [];

        S3Bucket.getCredentials(function (success) {
            var bucket_path = 'uploads/';
            var uploader = $scope.uploader = $fileUploader.create({
                scope: $scope,
                url: 'https://dev1-attachments.s3.amazonaws.com/',
                formData: [
                    { key: bucket_path + '${filename}' },
                    {AWSAccessKeyId: success.s3_access_key_id},
                    {acl: 'public-read'},
                    {success_action_status: '200'},
                    {policy: success.s3_policy},
                    {signature: success.s3_signature}
                ]
            });

            var each_file_size_limit = 50 * 1024 * 1024;
            var total_file_size_limit = 100 * 1024 * 1024;

            var total_size = 0;

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

                if (total_size + item.size > total_file_size_limit) {
                    Alert.error($scope.attachment_alerts, 'You can not upload files with more than 100 MB size.');
                    return false;
                }

                total_size = total_size + item.size;

                return true;
            });

            // REGISTER HANDLERS

            uploader.bind('afteraddingfile', function (event, item) {
                Logger.info('After adding a file', item);
                // marking an attachment for saving
                $scope.model.attachments.push({url: item.url + bucket_path + item.file.name, notes: item.notes, size: item.file.size});
                processFormChange(item);

            });

            uploader.bind('whenaddingfilefailed', function (event, item) {
                Logger.info('When adding a file failed', item);
                Alert.error($scope.alerts, 'Adding file failed. Please try again later.')
            });

            uploader.bind('afteraddingall', function (event, items) {
                Logger.info('After adding all files', items);
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
                item.downloadUrl = item.url + bucket_path + item.file.name;
            });

            uploader.bind('cancel', function (event, xhr, item) {
                Logger.info('Cancel', xhr, item);
                Alert.info($scope.alerts, 'Attachment was cancelled.')
            });

            uploader.bind('error', function (event, xhr, item, response) {
                Logger.error('Error', xhr, item, response);
                Alert.error($scope.alerts, 'An error occured during attachment upload. Please try again later.')
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

        // VERY ugly. But I needed a quick way of finding out when this particular form is changed, in order to warn for unsaved changes.
        // Property $dirty on this form isn't set up properly, i.e. it doesn't cover the teeth, notes, etc.
        // Even assuming that data are toggled changed when form is simply shown would not be a solution, because after saving it's possible to start over again on the same form by simply modifying its controls.

        var processFormChange = function(newVal) {
            Logger.log('Changed a field to "' + newVal + '"');
            UnsavedChanges.setUnsavedChanges(true);
        };

        $scope.$watch('patient', processFormChange);
        $scope.$watch('destinationPractice', processFormChange);
        $scope.$watch('model.referral.dest_provider_id', processFormChange);
        $scope.$watch('practiceType', processFormChange);
        $scope.$watch('model.referral.procedure_id', processFormChange);
        // teeth caught in $scope.toggleTooth
        // attachments caught in afteraddingfile handler
        // notes caught in $scope.noteDialog

    }]);

