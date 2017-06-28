angular.module('createReferrals')
    .controller('ReviewReferralsController', ['$scope', '$state', 'currentReferral', 'Notification', 'Auth', 'Procedure', 'Referral', 'UnsavedChanges', 'ReferralHelper', 'User', 'message',
    function ($scope, $state, currentReferral, Notification, Auth, Procedure, Referral, UnsavedChanges, ReferralHelper, User, message) {

        var auth = $scope.auth =  Auth.get() || {};

        $scope.immediateUpdate = true;
        $scope.model = {referral: currentReferral};
        $scope.patient = currentReferral.patient;
        $scope.attachments = currentReferral.attachments;
        $scope.teeth = currentReferral.teeth.split('+');
        $scope.procedures = Procedure.query();
        //$scope.currentPracticeProviders = User.getOtherProviders({practice_id: auth.practice_id});
        //$scope.userIsAux = auth.roles.indexOf('aux') >= 0;

        /*if(message){
            Notification.error(message);
        }*/

        User.get({id: auth.id}, function(user){
            $scope.providerLocations = user.addresses;
            if (user.addresses.length < 2){
                $scope.disableLocations = true;
                $scope.model.referral.orig_provider_address_id = user.addresses[0].id;
            }
        });

        Procedure.practiceTypes().$promise.then(function (types) {
            $scope.practiceTypes = types;
            ReferralHelper.updatePracticeType($scope, currentReferral.procedure.practice_type_id);
        });

        if (currentReferral.dest_practice) {
            $scope.destinationPractice = currentReferral.dest_practice;
            $scope.destinationPractice.users.unshift({id:-1, first_name: 'First', last_name: 'Available', firstAvailable: true});
        } else {
            $scope.destinationPractice = {users: [currentReferral.dest_provider_invited], name: '-- pending registration --'};
        }
        $scope.practiceSearchText = $scope.destinationPractice.name;

        ReferralHelper.watchProviders($scope);

        $scope.saveTemplate = function (model) {
            var resultHandlers = {
                success: function (success) {
                    Notification.success('Template was saved successfully!');
                    ReferralHelper.uploadAttachments($scope, success.id, function () {
                        UnsavedChanges.resetCbHaveUnsavedChanges(); // to make redirect
                        //$state.go('reviewReferral', {referral_id: success.id}, {reload: false});
                    });

                }, failure: function (failure) {
                    Notification.error('An error occurred during referral template creation...');

                }};
            ReferralHelper.prepareSubmit($scope, model.referral);
            Referral.update({id: $scope.model.referral.id}, model, resultHandlers.success, resultHandlers.failure);
        };

        $scope.createReferral = function (model) {
            var resultHandlers = {
                success: function (referral) {
                    Notification.success('Referral was sent successfully!');
                    ReferralHelper.uploadAttachments($scope, referral.id, function (message) {
                        UnsavedChanges.resetCbHaveUnsavedChanges(); // to make redirect
                        $state.go('viewReferral', {message: message, referral_id: referral.id});
                    });
                },
                failure: function (failure) {
                    Notification.error('An error occurred during referral creation...');
                }
            };
            ReferralHelper.prepareSubmit($scope, model.referral);
            model.referral.status = 'new';
            Referral.update({id: model.referral.id}, model, resultHandlers.success, resultHandlers.failure);

        };

        $scope.discardTemplate = function (referral) {
            Referral.remove({id: referral.id},
                function (success) {
                    $state.go('history');
                }, function (failure) {
                    Notification.error('An error occurred during template removal. Please try again later.');
                });
        };

        ReferralHelper.trackUnsavedChanges($scope);

    }]);
