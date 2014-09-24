var createReferralModule = angular.module('createReferrals', ['ui.bootstrap', 'angularFileUpload']);


createReferralModule.controller('CreateReferralsController', ['$scope', '$state', '$stateParams', '$timeout', 'Alert', 'Auth', 'Practice', 'Patient', 'Procedure', 'User', 'Referral', 'S3Bucket', 'Spinner', '$modal', '$fileUploader', 'UnsavedChanges', 'Logger', 'ModalHandler', 'File',
    function ($scope, $state, $stateParams, $timeout, Alert, Auth, Practice, Patient, Procedure, User, Referral, S3Bucket, Spinner, $modal, $fileUploader, UnsavedChanges, Logger, ModalHandler, File) {

        $scope.alerts = [];
        $scope.attachment_alerts = [];

        auth = Auth.get() || {};
        $scope.host = host;
        $scope.token = auth.token;
        $scope.from = auth.email;

        $scope.total_size = 0;

        $scope.hasNewAttachments = false;

        $scope.s3UploadPath = "https://dev1-attachments.s3.amazonaws.com/uploads/";
        $scope.s3HttpUploadPath = "http://dev1-attachments.s3.amazonaws.com/uploads/";

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
                console.log(referral);
                if(referral.dest_provider && referral.dest_provider.practice){
                    $scope.destinationPractice = referral.dest_provider.practice;
                }else{
                    $scope.destinationPractice = {users: [referral.dest_provider_invited], name: 'No practice selected'};

                }

                if (referral.dest_provider_id) {
                    $scope.model.dest_provider = referral.dest_provider_id;
                    $scope.model.provider_invited = false;

                } else {
                    $scope.model.dest_provider = referral.dest_provider_invited_id;
                    $scope.model.provider_invited = true;
                }
                $scope.practiceType = referral.procedure.practice_type;
                $scope.model.referral.id = referral.id;
                $scope.model.referral.procedure_id = referral.procedure.id;

                Procedure.practiceTypes().$promise.then(function (types) {
                    $scope.practiceTypes = types;
                    $scope.onPracticeSelected(referral.procedure);
                });
                $scope.model.referral.notes = referral.notes;

                angular.forEach($scope.model.referral.notes, function(note, key){
                    if (note.user){
                        note['user_first_name'] = note.user.first_name;
                        note['user_last_name'] = note.user.last_name;
                    }
                });
                $scope.attachments = referral.attachments;
                angular.forEach(referral.attachments, function(attachment, key){
                    $scope.total_size = $scope.total_size + attachment.size;
                    attachment['filenameToDownload'] = attachment.filename.replace($scope.s3UploadPath, '').replace($scope.s3HttpUploadPath, '');
                });
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

        $scope.model = {referral: {notes_attributes: [], notes: []}, practice: {}};

        $scope.onPracticeSelected = function (selectedPractice) {
            // refresh items in provider dropdown
            $scope.destinationPractice = selectedPractice;

            // remove currently logged in user from available providers list
            if ($scope.destinationPractice.id == auth.practice_id) {
                angular.forEach($scope.destinationPractice.users, function(user, index, users) {
                    if (user.id == auth.id) {
                        users.splice(index, 1);
                    }
                });
            }

            // select provider, if only one is available
            if ($scope.destinationPractice.users.length == 1) {
                $scope.model.dest_provider = $scope.destinationPractice.users[0].id;
            }

            // select default referral type from practice type
            for (var i = 0; i < $scope.practiceTypes.length; i++) {
                if ($scope.practiceTypes[i].id == selectedPractice.practice_type_id) {
                    $scope.practiceType = $scope.practiceTypes[i];
                    break;
                }
            }
        };

        $scope.now = function () {
            return Date.now();
        };

        var prepareSubmit = function (model) {
            if (model.provider_invited || model.referral.dest_provider_invited_id) {
                model.referral.dest_provider_invited_id = model.dest_provider;
            } else { //if provider was not invited, but existing one was selected.
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

        };

        var uploadAttachments = function(referral_id){
            for (var i = 0; i < $scope.uploader.queue.length; i++) {
                var item = $scope.uploader.queue[i];
                item.formData.push({referral_id: referral_id});
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
                    $scope.model.referral.id = success.id;//todo!!! quickfix for #74094550. Should be redesigned and refactored including all image upload approach.
                    uploadAttachments(success.id);
                    $scope.is_create = false;
                    UnsavedChanges.resetCbHaveUnsavedChanges(); // to make redirect
                    if(!$scope.hasNewAttachments){
                        $state.go('createReferral', {referral_id: success.id}, {reload: true});
                    }

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
                    $scope.model.referral.id = referral.id; //todo!!! quickfix for #74094550. Should be redesigned and refactored including all image upload approach.
                    uploadAttachments(referral.id);
                    $scope.is_create = true;
                    UnsavedChanges.resetCbHaveUnsavedChanges(); // to make redirect
                    if(!$scope.hasNewAttachments){
                        $state.go('viewReferral', {referral_id: referral.id});
                    }
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
            return Patient.searchPatient({practice_id: auth.practice_id, search: searchValue}).$promise.then(function (res) {
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
                controller: 'PatientModalController',
                resolve: {
                    fullname: function () {
                        return $scope.form.patient.$invalid ? $("input[name='patient']").val() : '';
                    }
                }
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
                $scope.form.$setDirty(); // for UnsavedChanges to notice notes being changed
                $scope.model.referral.notes.push({message: note, created_at: Date.now(), user_id: auth.id, user_first_name: Auth.current_user.first_name, user_last_name: Auth.current_user.last_name});
                $scope.model.referral.notes_attributes.push({message: note, created_at: Date.now(), user_id: auth.id, user_first_name: Auth.current_user.first_name, user_last_name: Auth.current_user.last_name});
            });
        };

        var teeth = $scope.teeth = [];
        $scope.toggleTooth = function (toothNumber) {
            $scope.form.$setDirty(); // for UnsavedChanges to notice teeth being changed
            var index = teeth.indexOf(toothNumber);
            if (index == -1) {
                teeth.push(toothNumber);
            } else {
                teeth.splice(index, 1);
            }
        };


        // non-displayed list of attachments to be uploaded on Save or Send
        $scope.model.attachments = [];

        
        var uploader = $scope.uploader = $fileUploader.create({
            scope: $scope,
            url: host + '/attachment/upload',
            formData: [
                {filename: 'test'}
            ],
            headers: {'Authorization' : $scope.token, 'From': $scope.from}
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
            $scope.hasNewAttachments = true;

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
            item['filenameToDownload'] = item.downloadUrl.replace($scope.s3UploadPath, '').replace($scope.s3HttpUploadPath, '');
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
            console.log($scope.model.referral.id)
            UnsavedChanges.resetCbHaveUnsavedChanges(); // to make redirect
            if($scope.is_create){
                $state.go('viewReferral', {referral_id: $scope.model.referral.id}, {reload: true});
            }else{
                $state.go('createReferral', {referral_id: $scope.model.referral.id}, {reload: true});
            }
            

        });
        
        // on Create Referral, form dirtiness defines the presense of unsaved changes
        // UI fields that are not technically form fields (teeth, attachments, notes) should have
        // dedicated change handlers, setting form to dirty
        UnsavedChanges.setCbHaveUnsavedChanges(function() {
            return $scope.form.$dirty;
        });

    }]);
