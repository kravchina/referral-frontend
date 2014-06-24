var createReferralModule = angular.module('createReferrals', ['ui.bootstrap', 'angularFileUpload']);

createReferralModule.controller('CreateReferralsController', ['$scope', '$stateParams', 'Alert', 'Practice', 'Patient', 'Procedure', 'User', 'Referral', 'S3Bucket', '$modal', '$fileUploader', 'dentalLinksUnsavedChangesService', 'dlLogger',
    function ($scope, $stateParams, Alert, Practice, Patient, Procedure, User, Referral, S3Bucket, $modal, $fileUploader, dentalLinksUnsavedChangesService, dlLogger) {

        $scope.alerts = [];
        $scope.attachment_alerts = [];
        
        var self = this;

        if ($stateParams.referral_id) {
            Referral.get({id: $stateParams.referral_id}).$promise.then(function (referral) {
                $scope.patient = referral.patient;
                $scope.destinationPractice = referral.dest_provider.practice;
                $scope.model.referral.dest_provider_id = referral.dest_provider_id;
                $scope.practiceType = referral.procedure.practice_type;
                $scope.model.referral.procedure_id = referral.procedure.id;

                Procedure.practiceTypes().$promise.then(function (types) {
                    $scope.practiceTypes = types;
                    $scope.updatePracticeType(referral.procedure);
                });
                $scope.model.referral.notes_attributes = referral.notes;
                $scope.attachments = referral.attachments;
                teeth = $scope.teeth = referral.teeth.split('+');
            });

        }

        $scope.isImage = function (attachment) {
            return attachment.filename.toLowerCase().search(/(jpg|png|gif)$/) >= 0;
        };

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
            Alert.push($scope.alerts, 'danger', 'Server doesn\'t respond. Please try again later');
        });

        $scope.model = {referral: {notes_attributes: []}, practice: {}};

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
                    Alert.push($scope.alerts, 'success', 'Template was saved successfully!');
                    dentalLinksUnsavedChangesService.setUnsavedChanges(false);
                }, failure: function (failure) {
                    Alert.push($scope.alerts, 'danger', 'An error occurred during referral template creation...');
                }};
            if ($stateParams.referral_id) {
                //edit existing referral
                Referral.update({id: $stateParams.referral_id}, model, resultHandlers.success, resultHandlers.failure);
            } else {
                Referral.saveTemplate(model, resultHandlers.success, resultHandlers.failure);
            }
        };

        $scope.createReferral = function (model) {

            prepareSubmit(model);

            $scope.create_referral_result = Referral.save(model,
                function (success) {
                    Alert.push($scope.alerts, 'success', 'Referral was sent successfully!');
                    dentalLinksUnsavedChangesService.setUnsavedChanges(false);
                },
                function (failure) {
                    Alert.push($scope.alerts, 'danger', 'An error occurred during referral creation...');
                });

        };

        $scope.findPatient = function (searchValue) {
            return Patient.searchPatient({search: searchValue}).$promise.then(function (res) {
                return res;
            });
        };

        $scope.findPractice = function (searchValue) {
            return Practice.searchPractice({search: searchValue }).$promise.then(function (res) {
                return res;
            });
        };

        $scope.patientDialog = function () {
            var modalInstance = $modal.open({
                templateUrl: 'partials/patient_form.html',
                controller: 'PatientModalController'
            });

            modalInstance.result.then(function (patient) {
                $scope.patient = patient;
            });
        };

        $scope.providerDialog = function () {
            var modalInstance = $modal.open({
                templateUrl: 'partials/provider_form.html',
                controller: 'ProviderModalController'
            });

            modalInstance.result.then(function (provider) {
                $scope.destinationPractice = $scope.destinationPractice || {users: [], name: ''};
                $scope.destinationPractice.users.push(provider);
                $scope.model.referral.dest_provider_id = provider.id;
                //$scope.provider = provider;
            });
        };

        $scope.noteDialog = function () {
            var modalInstance = $modal.open({
                templateUrl: 'partials/note_form.html',
                controller: 'NoteModalController'
            });

            modalInstance.result.then(function (note) {
                self.processFormChange(note);
                $scope.model.referral.notes_attributes.push({message: note, created_at: Date.now()});
            });
        };

        var teeth = $scope.teeth = [];
        $scope.toggleTooth = function (toothNumber) {
            self.processFormChange(toothNumber);
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
            uploader.filters.push(function(item /*{File|HTMLInputElement}*/) {
                //var type = uploader.isHTML5 ? item.type : '/' + item.value.slice(item.value.lastIndexOf('.') + 1);
                //type = '|' + type.toLowerCase().slice(type.lastIndexOf('/') + 1) + '|';
                //return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;

                console.log(item);

                if (item.size > each_file_size_limit){
                    Alert.push($scope.attachment_alerts, 'danger', 'You can not upload a file with more than 50 MB size.');
                    
                    return false;
                }

                if (total_size + item.size > total_file_size_limit){
                    Alert.push($scope.attachment_alerts, 'danger', 'You can not upload files with more than 100 MB size.');
                    return false;
                }
                
                total_size = total_size + item.size;

                return true;
                
              
            });

            // REGISTER HANDLERS

            uploader.bind('afteraddingfile', function (event, item) {
                dlLogger.info('After adding a file', item);
                // marking an attachment for saving
                $scope.model.attachments.push({url: item.url + bucket_path + item.file.name, notes: item.notes, size: item.file.size});
                self.processFormChange(item);
            });

            uploader.bind('whenaddingfilefailed', function (event, item) {
                dlLogger.info('When adding a file failed', item);
                Alert.push($scope.alerts, 'danger', 'Adding file failed. Please try again later.')
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
            });

            uploader.bind('cancel', function (event, xhr, item) {
                dlLogger.info('Cancel', xhr, item);
                Alert.push($scope.alerts, 'info', 'Attachment was cancelled.')
            });

            uploader.bind('error', function (event, xhr, item, response) {
                dlLogger.error('Error', xhr, item, response);
                Alert.push($scope.alerts, 'danger', 'An error occured during attachment upload. Please try again later.')
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
        
        // VERY ugly. But I needed a quick way of finding out when this particular form is changed, in order to warn for unsaved changes.
        // Property $dirty on this form isn't set up properly, i.e. it doesn't cover the teeth, notes, etc.
        // Even assuming that data are toggled changed when form is simply shown would not be a solution, because after saving it's possible to start over again on the same form by simply modifying its controls.
        
        this.processFormChange = function(newVal) {
            dlLogger.log('Changed a field to "' + newVal + '"');
            dentalLinksUnsavedChangesService.setUnsavedChanges(true);
        };
        
        $scope.$watch('patient', this.processFormChange);
        $scope.$watch('destinationPractice', this.processFormChange);
        $scope.$watch('model.referral.dest_provider_id', this.processFormChange);
        $scope.$watch('practiceType', this.processFormChange);
        $scope.$watch('model.referral.procedure_id', this.processFormChange);
        // teeth caught in $scope.toggleTooth
        // attachments caught in afteraddingfile handler
        // notes caught in $scope.noteDialog
        
    }]);

