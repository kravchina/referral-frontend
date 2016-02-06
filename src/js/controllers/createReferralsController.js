angular.module('createReferrals')
    .controller('CreateReferralsController', ['$scope', '$state','Notification', 'Auth', 'Procedure', 'Referral', 'UnsavedChanges', 'Logger', 'ReferralHelper', 'User', 'USER_ROLES',
    function ($scope, $state, Notification, Auth, Procedure, Referral, UnsavedChanges, Logger, ReferralHelper, User, USER_ROLES) {

        var auth = $scope.auth = Auth.get() || {};

        $scope.immediateUpdate = false;
        $scope.procedures = Procedure.query();
        $scope.practiceTypes = [];

        Procedure.practiceTypes(function(success){
            success.map(function(item){
                if(item.code !== 'multi_specialty'){
                    $scope.practiceTypes.push(item);
                }
            });
        });
        $scope.currentPracticeProviders = User.getOtherProviders({practice_id: auth.practice_id});
        $scope.model = {referral: {notes_attributes: [], notes: []}, practice: {}};

        $scope.userIsAux = Auth.hasRole(USER_ROLES.aux);

        $scope.onPracticeSelected = ReferralHelper.onPracticeSelected($scope, auth);

        ReferralHelper.watchProviders($scope);

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
                    Notification.success('Referral was sent successfully!');
                    ReferralHelper.uploadAttachments($scope, referral.id, function(message){
                        UnsavedChanges.resetCbHaveUnsavedChanges(); // to make redirect
                        $state.go('viewReferral', {referral_id: referral.id, message: message, isNew: true});
                    });
                },
                failure: function (failure) {
                    Notification.error('An error occurred during referral creation...');
                }
            };
            ReferralHelper.prepareSubmit($scope, model.referral);
            Referral.save(model, resultHandlers.success, resultHandlers.failure);
        };

        $scope.findPatient = ReferralHelper.findPatient(auth);

        $scope.findPractice = ReferralHelper.findPractice();

        $scope.patientDialog = ReferralHelper.patientDialog($scope);

        $scope.editPatientDialog = ReferralHelper.editPatientDialog($scope);

        $scope.providerDialog = ReferralHelper.providerDialog($scope);

        ReferralHelper.trackUnsavedChanges($scope);

    }]);
