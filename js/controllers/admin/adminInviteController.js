adminModule.controller('AdminInviteController', ['$scope', '$modal', 'Alert', 'User', 'ModalHandler', 'ProviderInvitation', 'Logger',
    function ($scope, $modal, Alert, User, ModalHandler, ProviderInvitation, Logger) {
        $scope.invitedUsers = [];
        $scope.invitedColleagues = [];
        
        User.getInvitees({user_id: $scope.$parent.auth.id}, function(allInvitees) {
            allInvitees.map(function(invitation) {
                if (invitation.roles_mask) {  // criteria to tell user invitations apart from colleague invitations
                    $scope.invitedUsers.push(invitation);
                } else {
                    $scope.invitedColleagues.push(invitation);
                }
            });
            Logger.log('invitedUsers = ' + JSON.stringify($scope.invitedUsers));
        });

        $scope.inviteDialog = function () {
            var modalInstance = $modal.open({
                templateUrl: 'partials/provider_form.html',
                controller: 'ProviderModalController',
                resolve: {
                    isSendEmail: function(){
                        return true;
                    }
                }
            });
            ModalHandler.set(modalInstance);
            modalInstance.result.then(function (provider) {
                $scope.invitedColleagues.push(provider);
            });
        };

        $scope.deleteProviderInvitation = function (provider) {
            ProviderInvitation.delete({id: provider.id},
                function (success) {
                    $scope.invitedColleagues.splice($scope.invitedColleagues.indexOf(provider), 1);
                },
                function (failure) {
                    Alert.error($scope.$parent.alerts, 'An error occurred during provider removal...')
                });
        };

        $scope.securityCodeDialog = function (user_id) {
            var modalInstance = $modal.open({
                templateUrl: 'partials/security_code.html',
                controller: 'SecurityCodeModalController'

            });
            ModalHandler.set(modalInstance);

        };        
    }]);