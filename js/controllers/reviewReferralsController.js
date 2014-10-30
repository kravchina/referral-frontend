createReferralModule.controller('ReviewReferralsController', ['$scope', '$state', 'currentReferral', 'Alert', 'Auth', 'Procedure', 'Referral', 'UnsavedChanges', 'ReferralHelper', 'User',
    function ($scope, $state, currentReferral, Alert, Auth, Procedure, Referral, UnsavedChanges, ReferralHelper, User) {

        var auth = Auth.get() || {};

        $scope.alerts = [];
        $scope.attachment_alerts = [];

        $scope.model = {referral: currentReferral};
        $scope.patient = currentReferral.patient;
        $scope.attachments = currentReferral.attachments;
        $scope.teeth = currentReferral.teeth.split('+');
        $scope.procedures = Procedure.query();
        $scope.currentPracticeProviders = User.getProviders({practice_id: auth.practice_id});
        $scope.userIsAux = auth.roles.indexOf('aux') >= 0;

        Procedure.practiceTypes().$promise.then(function (types) {
            $scope.practiceTypes = types;
            ReferralHelper.updatePracticeType($scope, currentReferral.procedure.practice_type_id);
        });

        if (currentReferral.dest_provider && currentReferral.dest_provider.practice) {
            $scope.destinationPractice = currentReferral.dest_provider.practice;
        } else {
            $scope.destinationPractice = {users: [currentReferral.dest_provider_invited], name: '-- not yet available --'};
        }

        $scope.closeAlert = function (index) {
            Alert.close($scope.alerts, index);
        };

        $scope.closeAttachmentAlert = function (index) {
            Alert.close($scope.attachment_alerts, index);
        };

        $scope.onPracticeSelected = ReferralHelper.onPracticeSelected($scope, auth);

        ReferralHelper.watchProviders($scope);

        $scope.saveTemplate = function (model) {
            var resultHandlers = {
                success: function (success) {
                    Alert.success($scope.alerts, 'Template was saved successfully!');
                    ReferralHelper.uploadAttachments($scope, success.id, function () {
                        UnsavedChanges.resetCbHaveUnsavedChanges(); // to make redirect
                        $state.go('reviewReferral', {referral_id: success.id}, {reload: true});
                    });

                }, failure: function (failure) {
                    Alert.error($scope.alerts, 'An error occurred during referral template creation...');

                }};
            ReferralHelper.prepareSubmit($scope, model.referral);
            Referral.update({id: $scope.model.referral.id}, model, resultHandlers.success, resultHandlers.failure);
        };

        $scope.createReferral = function (model) {
            var resultHandlers = {
                success: function (referral) {
                    Alert.success($scope.alerts, 'Referral was sent successfully!');
                    ReferralHelper.uploadAttachments($scope, referral.id, function () {
                        UnsavedChanges.resetCbHaveUnsavedChanges(); // to make redirect
                        $state.go('viewReferral', {referral_id: referral.id});
                    });
                },
                failure: function (failure) {
                    Alert.error($scope.alerts, 'An error occurred during referral creation...');
                }
            };
            ReferralHelper.prepareSubmit($scope, model.referral);
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

        $scope.findPatient = ReferralHelper.findPatient(auth);

        $scope.findPractice = ReferralHelper.findPractice();

        $scope.patientDialog = ReferralHelper.patientDialog($scope);

        $scope.providerDialog = ReferralHelper.providerDialog($scope);

        ReferralHelper.trackUnsavedChanges($scope);

    }]);
