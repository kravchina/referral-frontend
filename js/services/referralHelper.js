createReferralModule.service('ReferralHelper', ['$modal', 'ModalHandler', 'Patient', 'Practice', 'ProviderInvitation', 'Spinner', 'UnsavedChanges',
    function ($modal, ModalHandler, Patient, Practice, ProviderInvitation, Spinner, UnsavedChanges) {
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

            editPatientDialog: function(scope){
                return function(){
                    var modalInstance = $modal.open({
                        templateUrl: 'partials/patient_form.html',
                        controller: 'EditPatientModalController',
                        resolve: {
                            patientForEdit: function(){
                                return scope.patient;
                            }
                        }
                    });
                    ModalHandler.set(modalInstance);
                    modalInstance.result.then(function (patient) {
                        scope.patient = patient;
                    });
                }
            },

            providerDialog: function (scope) {
                return function () {
                    var modalInstance = $modal.open({
                        templateUrl: 'partials/provider_form.html',
                        controller: 'ProviderModalController'
                    });
                    ModalHandler.set(modalInstance);
                    modalInstance.result.then(function (provider) {
                        scope.destinationPractice = {users: [provider], name: '-- pending registration --'};
                        scope.practiceSearchText = scope.destinationPractice.name;
                        scope.model.referral.dest_provider_invited_id = provider.id;
                        scope.form.$setDirty();  //need for unsaved changes
                        scope.form.practice.$setValidity('editable', true);//fix for the case, when practice has invalid value and then provider is invited (removes practice's validation error and sets state to valid to enable saving)
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
                    // todo: see if can run both search requests in parallel

                    Spinner.hide(); //workaround that disables spinner to avoid flicker.
                    return Practice.searchPractice({search: searchValue }).$promise.then(function (practices) {
                        return ProviderInvitation.searchProviderInvitation({search: searchValue }).$promise.then(function (invitations) {
                            Spinner.show();

                            invitations = invitations.map(function (invitation) {
                                invitation.roles_mask = 2;
                                return {users: [invitation], name: '-- pending registration --'};
                            });

                            return practices.concat(invitations);
                        });
                    });
                }
            },
            onPracticeSelected: function (scope, auth) {
                var self = this;
                return function (selectedPractice) {
                    // this triggers refresh of items in provider dropdown
                    scope.destinationPractice = selectedPractice;

                    scope.practiceSearchText = scope.destinationPractice.name;

                    //todo!!! move to server-side query
                    // remove currently logged in user from available providers list
                    if (scope.destinationPractice.id == auth.practice_id) {
                        scope.destinationPractice.users.forEach( function (user, index, users) {
                            if (user.id == auth.id) {
                                users.splice(index, 1);
                            }
                        });
                    }

                    //todo!!! move to server-side query
                    // remove auxiliary users from available providers list
                    scope.destinationPractice.users.forEach(function (user, index, users) {
                        if ((user.roles_mask & 2) == 0) {
                            users.splice(index, 1);
                        }
                    });

                    // todo: detect if invitation, assign id appropriately
                    var users = scope.destinationPractice.users;
                    var onlyUser = (users && users.length == 1) ? users[0] : null;

                    if (onlyUser && onlyUser.status == 'invited') {
                        scope.model.referral.dest_provider_invited_id = users[0].id;
                        scope.model.referral.dest_provider_id = null;
                    } else {
                        scope.model.referral.dest_provider_invited_id = null;

                        // select provider, if only one is available
                        if (onlyUser) {
                            scope.model.referral.dest_provider_id = onlyUser.id;
                        }
                    }

                    // select default referral type from practice type
                    self.updatePracticeType(scope, selectedPractice.practice_type_id);
                }
            },
            trackUnsavedChanges: function(scope){
                // on Create Referral, form dirtiness defines the presence of unsaved changes
                // UI fields that are not technically form fields (teeth, attachments, notes) should have
                // dedicated change handlers, setting form to dirty
                UnsavedChanges.setCbHaveUnsavedChanges(function() {
                    return scope.form.$dirty;
                });
            }
        }
    }])
;
