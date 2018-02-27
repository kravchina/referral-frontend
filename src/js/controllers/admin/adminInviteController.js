angular.module('admin')
    .controller('AdminInviteController', ['$scope', '$uibModal', 'Notification', 'ModalHandler', 'ProviderInvitation', 'Logger', 'Practice', 'Auth', 'Address',
    function ($scope, $uibModal, Notification, ModalHandler, ProviderInvitation, Logger, Practice, Auth, Address) {
        $scope.invitedUsers = [];
        $scope.invitedColleagues = [];
        $scope.searchCollapsed = true;

        Practice.getAllInvitees({id: $scope.$parent.auth.practice_id}, function(allInvitees){
            allInvitees.map(function(invitation) {
                if (invitation.roles_mask) {  // criteria to tell user invitations apart from colleague invitations
                    $scope.invitedUsers.push(invitation);
                } else {
                    $scope.invitedColleagues.push(invitation);
                }
            });
            Logger.log('invitedUsers = ' + JSON.stringify($scope.invitedUsers));
        });

        $scope.searchAddresses = function(searchPhrase){
            $scope.noResults = false;
            Address.search({search: searchPhrase}, function(result){
                $scope.addresses = result;
                $scope.searchCollapsed = false;
                if (result.length < 1){
                    $scope.noResults = true;
                }

            })
        };

        $scope.inviteDialog = function () {
            var modalInstance = $uibModal.open({
                templateUrl: 'partials/provider_form.html',
                controller: 'ProviderModalController',
                resolve: {
                    sendEmailNotification: function(){
                        return true;
                    },
                    inviterId: function(){
                        return Auth.getOrRedirect().id;
                    }
                }
            });
            ModalHandler.set(modalInstance);
            modalInstance.result.then(function (provider) {
                $scope.invitedColleagues.push(provider);
            });
        };

        $scope.resendInvitation = function(id){
            ProviderInvitation.resend({id: id}, function(success){
                Notification.success("Resend email success");
            });
        };

        //is not currently used, [#109317458] - Remove generate security code banner and button
        $scope.securityCodeDialog = function (user_id) {
            var modalInstance = $uibModal.open({
                templateUrl: 'partials/security_code.html',
                controller: 'SecurityCodeModalController'

            });
            ModalHandler.set(modalInstance);

        };        
    }]);