createReferralModule.service('ReferralHelper', ['$modal', '$q', 'ModalHandler', 'Patient', 'Practice', 'ProviderInvitation', 'Spinner', 'UnsavedChanges', 'User',
    function ($modal, $q, ModalHandler, Patient, Practice, ProviderInvitation, Spinner, UnsavedChanges, User) {
        return {

            prepareSubmit: function (scope, referral) {
                referral.orig_practice_id = scope.auth.practice_id;
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
                var findProvider = function (id) {
                    if (!scope.destinationPractice || !scope.destinationPractice.users){
                        return {};
                    }
                    var users = scope.destinationPractice.users;
                    var usersLength = users.length;
                    for (var i = 0; i < usersLength; i++) {
                        if (id == users[i].id) {
                            return users[i];
                        }
                    }
                    return {};
                };
                //initial check if current referral has valid (not removed) dest provider
                scope.$watch(function(){
                    return scope.form.provider;
                },function(newVal, oldVal, currentScope){
                    if (newVal){
                        if(findProvider(currentScope.model.referral.dest_provider_id).removed_at){
                            currentScope.form.provider.$setValidity('userActive', false);
                        }
                    }

                });

                //initial check if current referral has valid (not removed) dest provider
                scope.$watch(function(){
                    return scope.form.provider_invited;
                },function(newVal, oldVal, currentScope){
                    if (newVal){
                        if(findProvider(currentScope.model.referral.dest_provider_invited_id).removed_at){
                            currentScope.form.provider_invited.$setValidity('userActive', false);
                        }
                    }

                });


                scope.$watch( //observing changes of the dest_provider_invited_id field
                    function () {
                        return scope.model.referral.dest_provider_invited_id; //we are watching exactly this 'dest_provider_invited_id' property, not the whole 'model' object
                    }, function (newVal, oldVal, currentScope) {
                        if (newVal) {
                            if(currentScope.form.provider_invited){
                                currentScope.form.provider_invited.$setValidity('userActive', findProvider(newVal).removed_at? false : true);
                            }
                            currentScope.model.referral.dest_provider_id = null; //if dest_provider_invited_id is set (user added new provider invitation to the referral), we need to remove 'dest_provider_id'
                        }
                    });
                scope.$watch( //observing changes of the dest_provider_id field
                    function () {
                        return scope.model.referral.dest_provider_id; //we are watching exactly this 'dest_provider_id' property, not the whole 'model' object
                    },
                    function (newVal, oldVal, currentScope) {
                        if (newVal) {
                            if(currentScope.form.provider){
                                currentScope.form.provider.$setValidity('userActive', findProvider(newVal).removed_at ? false : true );
                            }
                            currentScope.model.referral.dest_provider_invited_id = null; //if dest_provider_id is set (user selected existing referral from the dropdown), we need to remove 'dest_provider_invited_id'
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
                    return Patient.searchPatient({practice_id: auth.practice_id, search: searchValue}).$promise;
                }
            },

            findPractice: function () {
                return function (searchValue) {
                    var providersPromise = Practice.searchPractice({search: searchValue}).$promise;
                    var invitationsPromise = ProviderInvitation.searchProviderInvitation({search: searchValue}).$promise;
                    return $q.all([providersPromise, invitationsPromise]).then(function (results) {

                        var practices = [];
                        var length = results[0].length;
                        for (var i = 0; i < length; i++) {
                            var p = results[0][i];

                            p.addresses.map(function(a) {
                                var newPractice = JSON.parse(JSON.stringify(p));
                                newPractice.address = a;
                                practices.push(newPractice);
                            })
                        }

                        var invitations = results[1].map(function (invitation) {
                            invitation.roles_mask = 2;
                            return {users: [invitation], name: '-- pending registration --', isInvitation: true};
                        });
                        return practices.concat(invitations);
                    });
                }
            },
            onPracticeSelected: function (scope, auth) {
                var self = this;
                return function (selectedItem) {
                    // this triggers refresh of items in provider dropdown
                    scope.destinationPractice = selectedItem;

                    scope.practiceSearchText = scope.destinationPractice.name;

                    if (selectedItem.isInvitation) {
                        scope.model.referral.dest_provider_invited_id = selectedItem.users[0].id;
                        scope.model.referral.dest_provider_id = null;
                    } else {
                        scope.destinationPractice.users = User.getOtherProviders({practice_id: selectedItem.id}, function(users){
                            scope.model.referral.dest_provider_invited_id = null;
                            if (users.length == 1) {
                                scope.model.referral.dest_provider_id = users[0].id;
                            }
                            users.unshift({id: -1, first_name: 'First', last_name: 'Available', firstAvailable: true});

                        });
                    }
                    // select default referral type from practice type
                    self.updatePracticeType(scope, selectedItem.practice_type_id);
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
    }]);
