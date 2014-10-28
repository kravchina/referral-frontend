var createReferralModule = angular.module('createReferrals', ['ui.bootstrap', 'angularFileUpload']);

createReferralModule.controller('CreateReferralsController', ['$scope', '$state','Alert', 'Auth', 'Procedure', 'Referral', 'UnsavedChanges', 'Logger', 'ReferralHelper',
    function ($scope, $state, Alert, Auth, Procedure, Referral, UnsavedChanges, Logger, ReferralHelper) {

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

        $scope.onPracticeSelected = ReferralHelper.onPracticeSelected($scope, auth);

        ReferralHelper.watchProviders($scope);

        $scope.saveTemplate = function (model) {
            ReferralHelper.prepareSubmit($scope, model.referral);
            var resultHandlers = {
                success: function (success) {
                    $scope.model.referral.id = success.id;
                    $scope.model.attachments = [];
                    $scope.model.referral.notes_attributes = [];
                    Alert.success($scope.alerts, 'Template was saved successfully!');
                    ReferralHelper.uploadAttachments($scope, success.id, function(){
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
                    ReferralHelper.uploadAttachments($scope, referral.id, function(){
                        UnsavedChanges.resetCbHaveUnsavedChanges(); // to make redirect
                        $state.go('viewReferral', {referral_id: referral.id});
                    });
                },
                failure: function (failure) {
                    Alert.error($scope.alerts, 'An error occurred during referral creation...');
                }
            };
            ReferralHelper.prepareSubmit($scope, model.referral);
            Referral.save(model, resultHandlers.success, resultHandlers.failure);
        };

        $scope.findPatient = ReferralHelper.findPatient(auth);

        $scope.findPractice = ReferralHelper.findPractice();

        $scope.patientDialog = ReferralHelper.patientDialog($scope);

        $scope.providerDialog = ReferralHelper.providerDialog($scope);

        // on Create Referral, form dirtiness defines the presense of unsaved changes
        // UI fields that are not technically form fields (teeth, attachments, notes) should have
        // dedicated change handlers, setting form to dirty
        UnsavedChanges.setCbHaveUnsavedChanges(function() {
            return $scope.form.$dirty;
        });

    }]);
