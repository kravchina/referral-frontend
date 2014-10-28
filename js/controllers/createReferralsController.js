var createReferralModule = angular.module('createReferrals', ['ui.bootstrap', 'angularFileUpload']);

createReferralModule.controller('CreateReferralsController', ['$scope', '$state', '$stateParams', '$timeout', 'Alert', 'Auth', 'Practice', 'Patient', 'Procedure', 'User', 'Referral', 'S3Bucket', 'Spinner', '$modal', '$fileUploader', 'UnsavedChanges', 'Logger', 'ModalHandler', 'File',
    function ($scope, $state, $stateParams, $timeout, Alert, Auth, Practice, Patient, Procedure, User, Referral, S3Bucket, Spinner, $modal, $fileUploader, UnsavedChanges, Logger, ModalHandler, File) {

        $scope.alerts = [];
        $scope.attachment_alerts = [];

        var auth = Auth.get() || {};

        $scope.procedures = Procedure.query();

        $scope.practiceTypes = Procedure.practiceTypes();

        $scope.model = {referral: {notes_attributes: [], notes: []}, practice: {}};

        $scope.closeAlert = function (index) {
            Alert.close($scope.alerts, index);
        };

        $scope.closeAttachmentAlert = function (index) {
            Alert.close($scope.attachment_alerts, index);
        };

        $scope.updatePracticeType = function (practice_type_id) {
            for (var i = 0; i < $scope.practiceTypes.length; i++) {
                if ($scope.practiceTypes[i].id == practice_type_id) {
                    $scope.practiceType = $scope.practiceTypes[i];
                    break;
                }
            }
        };

        $scope.onPracticeSelected = function (selectedPractice) {
            // refresh items in provider dropdown
            $scope.destinationPractice = selectedPractice;


            //todo!!! move to server-side query
            // remove currently logged in user from available providers list
            if ($scope.destinationPractice.id == auth.practice_id) {
                angular.forEach($scope.destinationPractice.users, function(user, index, users) {
                    if (user.id == auth.id) {
                        users.splice(index, 1);
                    }
                });

            }

            //todo!!! move to server-side query
            // remove auxiliary users from available providers list
            angular.forEach($scope.destinationPractice.users, function(user, index, users) {
                if ((user.roles_mask & 2) == 0) {
                    users.splice(index, 1);
                }
            });

            $scope.model.referral.dest_provider_invited_id = undefined;  //remove if present, because will anyway select provider from selected practice users

            // select provider, if only one is available
            if ($scope.destinationPractice.users && $scope.destinationPractice.users.length == 1) {
                $scope.model.referral.dest_provider_id = $scope.destinationPractice.users[0].id;
            }

            // select default referral type from practice type
            $scope.updatePracticeType(selectedPractice.practice_type_id);
        };

        $scope.$watch( //observing changes of the dest_provider_invited_id field
            function () {
                return $scope.model.referral.dest_provider_invited_id; //we are watching exactly this 'dest_provider_invited_id' property, not the whole 'model' object
            }, function (newVal, oldVal, scope) {
                if (newVal) {
                    $scope.model.referral.dest_provider_id = undefined; //if dest_provider_invited_id is set (user added new provider invitation to the referral), we need to remove 'dest_provider_id'
                }
            });
        $scope.$watch( //observing changes of the dest_provider_id field
            function () {
                return $scope.model.referral.dest_provider_id; //we are watching exactly this 'dest_provider_id' property, not the whole 'model' object
            },
            function (newVal, oldVal, scope) {
                if (newVal) {
                    $scope.model.referral.dest_provider_invited_id = undefined; //if dest_provider_id is set (user selected existing referral from the dropdown), we need to remove 'dest_provider_invited_id'
                }
            });


        var prepareSubmit = function (referral) {
            referral.dest_practice_id = $scope.destinationPractice.id;
            referral.patient_id = $scope.patient.id;
            referral.teeth = $scope.teeth.join('+');
        };

        var uploadAttachments = function(referral_id, redirectCallback){
            if($scope.uploader.queue.length > 0){
                $scope.uploader.queue.redirectCallback = redirectCallback;
            }else{
                redirectCallback();
            }
            for (var i = 0; i < $scope.uploader.queue.length; i++) {
                var item = $scope.uploader.queue[i];
                item.formData.push({referral_id: referral_id});
                item.upload();
            }
        };

        $scope.saveTemplate = function (model) {

            prepareSubmit(model.referral);
            var resultHandlers = {
                success: function (success) {
                    $scope.model.referral.id = success.id;
                    $scope.model.attachments = [];
                    $scope.model.referral.notes_attributes = [];
                    Alert.success($scope.alerts, 'Template was saved successfully!');
                    uploadAttachments(success.id, function(){
                        UnsavedChanges.resetCbHaveUnsavedChanges(); // to make redirect
                        $state.go('reviewReferral', {referral_id: success.id}, {reload: true});
                    });


                }, failure: function (failure) {
                    Alert.error($scope.alerts, 'An error occurred during referral template creation...');

                }};
            Referral.saveTemplate(model, resultHandlers.success, resultHandlers.failure);
        };

        $scope.createReferral = function (model) {
            var resultHandlers = {
                success: function (referral) {
                    Logger.debug('Sent referral #' + referral.id);
                    Alert.success($scope.alerts, 'Referral was sent successfully!');
                    uploadAttachments(referral.id, function(){
                        UnsavedChanges.resetCbHaveUnsavedChanges(); // to make redirect
                        $state.go('viewReferral', {referral_id: referral.id});
                    });
                },
                failure: function (failure) {
                    Alert.error($scope.alerts, 'An error occurred during referral creation...');
                }
            };
            prepareSubmit(model.referral);
            Referral.save(model, resultHandlers.success, resultHandlers.failure);
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
                        return $scope.form.patient.$invalid ? $scope.form.patient.$viewValue : '';
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
                $scope.destinationPractice = {users: [provider], name: '-- not yet available --'};
                $scope.model.referral.dest_provider_invited_id = provider.id;
            });
        };

        // on Create Referral, form dirtiness defines the presense of unsaved changes
        // UI fields that are not technically form fields (teeth, attachments, notes) should have
        // dedicated change handlers, setting form to dirty
        UnsavedChanges.setCbHaveUnsavedChanges(function() {
            return $scope.form.$dirty;
        });

    }]);
