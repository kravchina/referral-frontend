angular.module('createReferrals')
    .controller('CreateReferralsController', ['$scope', '$state', '$stateParams', 'Notification', 'Auth', 'Procedure', 'Referral', 'UnsavedChanges', 'Logger', 'ReferralHelper', 'User', 'USER_ROLES', 'Practice',
    function ($scope, $state, $stateParams, Notification, Auth, Procedure, Referral, UnsavedChanges, Logger, ReferralHelper, User, USER_ROLES, Practice) {

        var auth = $scope.auth = Auth.get() || {};
        $scope.current_user = Auth.current_user;

        $scope.immediateUpdate = false;

        User.get({id: auth.id}, function(user){
           if(user.guest)
            return;
           $scope.providerLocations = user.addresses;
           if (user.addresses.length < 2){
                $scope.disableLocations = true;
                $scope.model.referral.orig_provider_address_id = user.addresses[0].id;
           }
        });

        $scope.model = {referral: {notes_attributes: [], notes: []}, practice: {}};
        $scope.model.referral.orig_provider_id = auth.id;

        ReferralHelper.watchProviders($scope);

        if(typeof $stateParams.pid !== 'undefined') {
            Practice.getByPublicId({publicId: $stateParams.pid}, function(data) {
                $scope.onPracticeSelected(data);
                $scope.form.$setDirty();
            }, function (failure) {
                Notification.error('An error occurred during practice search...');
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
            ReferralHelper.prepareSubmit($scope, model.referral);
            Referral.save(model, resultHandlers.success, resultHandlers.failure);
        };

        ReferralHelper.trackUnsavedChanges($scope);

    }]);
