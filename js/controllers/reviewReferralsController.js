createReferralModule.controller('ReviewReferralsController', ['$scope', '$state', '$timeout', 'currentReferral', 'Alert', 'Auth', 'Practice', 'Patient', 'Procedure', 'User', 'Referral', 'S3Bucket', 'Spinner', '$modal', '$fileUploader', 'UnsavedChanges', 'Logger', 'ModalHandler', 'File',
    function ($scope, $state, $timeout, currentReferral, Alert, Auth, Practice, Patient, Procedure, User, Referral, S3Bucket, Spinner, $modal, $fileUploader, UnsavedChanges, Logger, ModalHandler, File) {

        $scope.alerts = [];
        $scope.attachment_alerts = [];

        var auth = Auth.get() || {};
        $scope.current_user = Auth.current_user;

        $scope.token = auth.token;
        $scope.from = auth.email;

        $scope.total_size = 0;

        $scope.hasNewAttachments = false;
        $scope.currentReferral = currentReferral;
        $scope.model = {referral: {notes_attributes: [], notes: []}, practice: {}};

        if (currentReferral.dest_provider && currentReferral.dest_provider.practice) {
            $scope.destinationPractice = currentReferral.dest_provider.practice;
        } else {
            $scope.destinationPractice = {users: [currentReferral.dest_provider_invited], name: '-- not yet available --'};
        }

        if (currentReferral.dest_provider_id) {
            $scope.model.dest_provider = currentReferral.dest_provider_id;
            $scope.model.provider_invited = false;

        } else {
            $scope.model.dest_provider = currentReferral.dest_provider_invited_id;
            $scope.model.provider_invited = true;
        }
        $scope.practiceType = currentReferral.procedure.practice_type;
        $scope.model.referral.id = currentReferral.id;
        $scope.model.referral.procedure_id = currentReferral.procedure.id;

        Procedure.practiceTypes().$promise.then(function (types) {
            $scope.practiceTypes = types;
            $scope.updatePracticeType(currentReferral.procedure);
        });
        $scope.model.referral.notes = currentReferral.notes;

        $scope.attachments = currentReferral.attachments;
        angular.forEach(currentReferral.attachments, function (attachment, key) {
            $scope.total_size = $scope.total_size + attachment.size;
        });
        $scope.teeth = currentReferral.teeth.split('+');
        Logger.debug('Set $scope values from obtained currentReferral.');


        $scope.closeAlert = function (index) {
            Alert.close($scope.alerts, index);
        };

        $scope.closeAttachmentAlert = function (index) {
            Alert.close($scope.attachment_alerts, index);
        };

        $scope.procedures = Procedure.query();

        $scope.practiceTypes = Procedure.practiceTypes();


        $scope.updatePracticeType = function (procedure) {
            for (var i = 0; i < $scope.practiceTypes.length; i++) {
                if ($scope.practiceTypes[i].id == procedure.practice_type_id) {
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
                angular.forEach($scope.destinationPractice.users, function (user, index, users) {
                    if (user.id == auth.id) {
                        users.splice(index, 1);
                    }
                });

            }

            //todo!!! move to server-side query
            // remove auxiliary users from available providers list
            angular.forEach($scope.destinationPractice.users, function (user, index, users) {
                if ((user.roles_mask & 2) == 0) {
                    users.splice(index, 1);
                }
            });

            // select provider, if only one is available
            if ($scope.destinationPractice.users && $scope.destinationPractice.users.length == 1) {
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
            model.referral.teeth = $scope.teeth.join('+');

        };

        var uploadAttachments = function (referral_id) {
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
                    $scope.model.attachments = [];
                    $scope.model.referral.notes_attributes = [];
                    Alert.success($scope.alerts, 'Template was saved successfully!');
                    uploadAttachments(success.id);
                    UnsavedChanges.resetCbHaveUnsavedChanges(); // to make redirect
                    if (!$scope.hasNewAttachments) {
                        $state.go('reviewReferral', {referral_id: success.id}, {reload: true});
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
                    UnsavedChanges.resetCbHaveUnsavedChanges(); // to make redirect
                    if (!$scope.hasNewAttachments) {
                        $state.go('viewReferral', {referral_id: referral.id});
                    }
                },
                failure: function (failure) {
                    Alert.error($scope.alerts, 'An error occurred during referral creation...');
                }
            };
            prepareSubmit(model);
            model.referral.status = 'new';
            Referral.update({id: model.referral.id}, model, resultHandlers.success, resultHandlers.failure);

        };

        $scope.discardTemplate = function (referral) {
            Referral.remove(referral,
                function (success) {
                    $state.go('history');
                }, function (failure) {
                    Alert.error($scope.alerts, 'An error occurred during template removal. Please try again later.');
                });
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
                $scope.currentReferral.patient = patient;
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
                $scope.destinationPractice = $scope.destinationPractice || {users: [provider], name: '-- not yet available --'};
                $scope.model.dest_provider = provider.id;
                $scope.model.referral.dest_provider_invited_id = provider.id;
            });
        };

        // on Create Referral, form dirtiness defines the presense of unsaved changes
        // UI fields that are not technically form fields (teeth, attachments, notes) should have
        // dedicated change handlers, setting form to dirty
        UnsavedChanges.setCbHaveUnsavedChanges(function () {
            return $scope.form.$dirty;
        });

    }]);

