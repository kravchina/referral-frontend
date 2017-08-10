angular.module('createReferrals')
    .controller('CreateGuestReferralsController', ['$scope', '$state', '$stateParams', 'Notification', 'Auth', 'Procedure', 'Referral', 'UnsavedChanges', 'Logger', 'ReferralHelper', 'User', 'USER_ROLES', 'Practice', '$modal', 'ModalHandler', 'Patient',
        function ($scope, $state, $stateParams, Notification, Auth, Procedure, Referral, UnsavedChanges, Logger, ReferralHelper, User, USER_ROLES, Practice, $modal, ModalHandler, Patient) {

            var auth = $scope.auth = Auth.get() || {};
            $scope.current_user = Auth.current_user;

            $scope.immediateUpdate = false;

            $scope.model = {referral: {notes_attributes: [], notes: []}, practice: {}};
            $scope.model.referral.orig_provider_id = auth.id;

            ReferralHelper.watchProviders($scope);

            $scope.onPracticeSelected = function (selectedItem) {
                // this triggers refresh of items in provider dropdown
                $scope.destinationPractice = selectedItem;

                $scope.practiceSearchText = $scope.destinationPractice.name;

                if($scope.destinationPractice.addresses && $scope.destinationPractice.addresses.length == 1) {
                    $scope.model.referral.address_id = $scope.destinationPractice.addresses[0].id;
                }
                if (selectedItem.isInvitation) {
                    $scope.model.referral.dest_provider_invited_id = selectedItem.users[0].id;
                    $scope.model.referral.dest_provider_id = null;
                } else {
                    $scope.destinationPractice.users = User.getOtherProviders({practice_id: selectedItem.id}, function(users){
                        $scope.model.referral.dest_provider_invited_id = null;
                        if (users.length == 1) {
                            $scope.model.referral.dest_provider_id = users[0].id;
                        }
                        users.unshift({id: -1, first_name: 'First', last_name: 'Available', firstAvailable: true});

                    });
                }
                $scope.updatePracticeType(selectedItem.practice_type_id);
            };

            $scope.updatePracticeType = function (practice_type_id) {
                for (var i = 0; i < $scope.practiceTypes.length; i++) {
                    if ($scope.practiceTypes[i].id == practice_type_id) {
                        $scope.practiceType = $scope.practiceTypes[i];
                        break;
                    }
                }
            };

            if(typeof $stateParams.pid !== 'undefined') {
                Practice.getByPublicId({publicId: $stateParams.pid}, function(data) {
                    $scope.onPracticeSelected(data);
                    $scope.form.$setDirty();
                }, function (failure) {
                    Notification.error(failure.data.message);
                });
            }

            $scope.saveTemplate = function (model) {
                ReferralHelper.prepareSubmit($scope, model.referral);
                var resultHandlers = {
                    success: function (success) {
                        $scope.model.referral.id = success.id;
                        $scope.model.attachments = [];
                        $scope.model.referral.notes_attributes = [];
                        Notification.success('Template was saved successfully!');
                        ReferralHelper.uploadAttachments($scope, success.id, function(message){
                            UnsavedChanges.resetCbHaveUnsavedChanges(); // to make redirect
                            $state.go('reviewReferral', {referral_id: success.id, message: message}, {reload: true});
                        });
                    }, failure: function (failure) {
                        Notification.error('An error occurred during referral template creation...');

                    }};
                Referral.saveTemplate(model, resultHandlers.success, resultHandlers.failure);
            };

            $scope.createReferral = function (model) {
                var resultHandlers = {
                    success: function (referral) {
                        Logger.debug('Sent referral #' + referral.id);
                        ReferralHelper.uploadAttachments($scope, referral.id, function(message){
                            UnsavedChanges.resetCbHaveUnsavedChanges(); // to make redirect
                            $state.go('viewReferral', {referral_id: referral.id, message: message, isNew: true});
                        });
                    },
                    failure: function (failure) {
                        Notification.error('An error occurred during referral creation...');
                    }
                };
                User.createGuest({guest_user: $scope.guest, dest_practice_public_id: $stateParams.pid}, function(success){
                    $scope.guest = success;
                    $scope.patient.practice_id = $scope.guest.practice_id;

                    Patient.save({patient: $scope.patient}, function (success) {
                        $scope.patient = success;
                        ReferralHelper.prepareGuestSubmit($scope, model.referral);
                        Referral.createGuestReferral(model, function(success){
                            console.log('createGuestReferral', success);
                        }, function(failure){
                            Notification.error(failure.data.message[0]);
                        });
                    }, function (failure) {
                        Notification.error(failure.data.message[0]);
                    });
                }, function(failure){
                    Notification.error(failure.data.message[0]);
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

            $scope.editPatientDialog = function() {
                var modalInstance = $modal.open({
                    templateUrl: 'partials/patient_form.html',
                    controller: 'EditPatientModalController',
                    resolve: {
                        patientForEdit: function(){
                            return $scope.patient;
                        }
                    }
                });
                ModalHandler.set(modalInstance);
                modalInstance.result.then(function (patient) {
                    $scope.patient = patient;
                });
            };

            ReferralHelper.trackUnsavedChanges($scope);

        }]);
