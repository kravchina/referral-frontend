createReferralModule.service('ReferralHelper', ['$modal', 'ModalHandler', 'Patient', 'Practice', 'Spinner', 'UnsavedChanges',
    function ($modal, ModalHandler, Patient, Practice, Spinner, UnsavedChanges) {
        return {

            prepareSubmit: function (scope, referral) {
                referral.dest_practice_id = scope.destinationPractice.id;
                referral.patient_id = scope.patient.id;
                referral.teeth = scope.teeth.join('+');
            },

            uploadAttachments: function (scope, referral_id, redirectCallback) {
                if (scope.uploader.queue.length > 0) {
                    scope.uploader.queue.redirectCallback = redirectCallback;
                } else {
                    redirectCallback();
                }
                for (var i = 0; i < scope.uploader.queue.length; i++) {
                    var item = scope.uploader.queue[i];
                    item.formData.push({referral_id: referral_id});
                    item.upload();
                }
            },

            watchProviders: function (scope) {
                scope.$watch( //observing changes of the dest_provider_invited_id field
                    function () {
                        return scope.model.referral.dest_provider_invited_id; //we are watching exactly this 'dest_provider_invited_id' property, not the whole 'model' object
                    }, function (newVal, oldVal, scope) {
                        if (newVal) {
                            scope.model.referral.dest_provider_id = null; //if dest_provider_invited_id is set (user added new provider invitation to the referral), we need to remove 'dest_provider_id'
                        }
                    });
                scope.$watch( //observing changes of the dest_provider_id field
                    function () {
                        return scope.model.referral.dest_provider_id; //we are watching exactly this 'dest_provider_id' property, not the whole 'model' object
                    },
                    function (newVal, oldVal, scope) {
                        if (newVal) {
                            scope.model.referral.dest_provider_invited_id = null; //if dest_provider_id is set (user selected existing referral from the dropdown), we need to remove 'dest_provider_invited_id'
                        }
                    });
            },
            updatePracticeType: function (scope, practice_type_id) {
                for (var i = 0; i < scope.practiceTypes.length; i++) {
                    if (scope.practiceTypes[i].id == practice_type_id) {
                        scope.practiceType = scope.practiceTypes[i];
                        break;
                    }
                }
            },

            patientDialog: function (scope) {
                return function () {
                    var modalInstance = $modal.open({
                        templateUrl: 'partials/patient_form.html',
                        controller: 'PatientModalController',
                        resolve: {
                            fullname: function () {
                                return scope.form.patient.$invalid ? scope.form.patient.$viewValue : '';
                            }
                        }
                    });
                    ModalHandler.set(modalInstance);
                    modalInstance.result.then(function (patient) {
                        scope.patient = patient;
                        scope.form.patient.$setValidity('editable', true);
                    });
                }
            },
            providerDialog: function (scope) {
                return function () {
                    var modalInstance = $modal.open({
                        templateUrl: 'partials/provider_form.html',
                        controller: 'ProviderModalController',
                        resolve: {
                            searchAndEdit: function(){
                                return true; //allow searching and edition existing invitation
                            }
                        }
                    });
                    ModalHandler.set(modalInstance);
                    modalInstance.result.then(function (provider) {
                        scope.destinationPractice = {users: [provider], name: '-- not yet available --'};
                        scope.model.referral.dest_provider_invited_id = provider.id;
                        scope.form.$setDirty();
                    });
                }
            },
            findPatient: function (auth) {
                return function (searchValue) {
                    Spinner.hide(); //workaround that disables spinner to avoid flicker.
                    return Patient.searchPatient({practice_id: auth.practice_id, search: searchValue}).$promise.then(function (res) {
                        Spinner.show();
                        return res;
                    });
                }
            },

            findPractice: function () {
                return function (searchValue) {
                    Spinner.hide(); //workaround that disables spinner to avoid flicker.
                    return Practice.searchPractice({search: searchValue }).$promise.then(function (res) {
                        Spinner.show();
                        return res;
                    });
                }
            },
            onPracticeSelected: function (scope, auth) {
                var self = this;
                return function (selectedPractice) {
                    // refresh items in provider dropdown
                    scope.destinationPractice = selectedPractice;

                    //todo!!! move to server-side query
                    // remove currently logged in user from available providers list
                    if (scope.destinationPractice.id == auth.practice_id) {
                        angular.forEach(scope.destinationPractice.users, function (user, index, users) {
                            if (user.id == auth.id) {
                                users.splice(index, 1);
                            }
                        });

                    }

                    //todo!!! move to server-side query
                    // remove auxiliary users from available providers list
                    angular.forEach(scope.destinationPractice.users, function (user, index, users) {
                        if ((user.roles_mask & 2) == 0) {
                            users.splice(index, 1);
                        }
                    });

                    scope.model.referral.dest_provider_invited_id = null;  //remove if present, because will anyway select provider from selected practice users

                    // select provider, if only one is available
                    if (scope.destinationPractice.users && scope.destinationPractice.users.length == 1) {
                        scope.model.referral.dest_provider_id = scope.destinationPractice.users[0].id;
                    }

                    // select default referral type from practice type
                    self.updatePracticeType(scope, selectedPractice.practice_type_id);
                }
            },
            trackUnsavedChanges: function(scope){
                // on Create Referral, form dirtiness defines the presense of unsaved changes
                // UI fields that are not technically form fields (teeth, attachments, notes) should have
                // dedicated change handlers, setting form to dirty
                UnsavedChanges.setCbHaveUnsavedChanges(function() {
                    return scope.form.$dirty;
                });
            }
        }
    }])
;
