angular.module('createReferrals')
    .service('ReferralHelper', ['$modal', '$q', 'ModalHandler', 'Practice', 'ProviderInvitation', 'Spinner', 'UnsavedChanges',
    function ($modal, $q, ModalHandler, Practice, ProviderInvitation, Spinner, UnsavedChanges) {
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
                var self = this;
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
                        if(!newVal && currentScope.model.referral.isCreatedNow) {
                            var modalInstance = $modal.open({
                                templateUrl: 'partials/delete_provider.html',
                                controller: 'DeleteProviderModalController'
                            });
                            ModalHandler.set(modalInstance);
                            modalInstance.result.then(function (remove) {
                                if(remove) {
                                    ProviderInvitation.delete({id: oldVal});
                                    currentScope.destinationPractice = [];
                                    currentScope.practiceSearchText = '';
                                    currentScope.model.referral.isCreatedNow = false;
                                } else {
                                    currentScope.model.referral.dest_provider_invited_id = oldVal;
                                    currentScope.destinationPractice = currentScope.tempDestinationPractice;
                                    currentScope.practiceSearchText = currentScope.tempDestinationPractice.name;
                                    delete(currentScope.tempDestinationPractice);
                                }
                            });
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
                            if(scope.destinationPractice.practice_type && scope.destinationPractice.practice_type.code === 'multi_specialty') {
                                var selectedProvider = findProvider(currentScope.model.referral.dest_provider_id);
                                if(currentScope.practiceTypes && selectedProvider.specialty_type_id) {
                                    self.updatePracticeType(currentScope, selectedProvider.specialty_type_id);
                                } else if(scope.practiceType && scope.practiceType.id != scope.destinationPractice.practice_type_id) {
                                    self.updatePracticeType(currentScope, scope.destinationPractice.practice_type_id);
                                }
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
