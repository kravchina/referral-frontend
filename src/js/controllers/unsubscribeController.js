angular.module('unsubscribe')
    .controller('UnsubscribeController', ['$scope', '$state', '$stateParams', 'User', 'ProviderInvitation', '$uibModal', 'ModalHandler', '$location',
    function($scope, $state, $stateParams, User, ProviderInvitation, $uibModal, ModalHandler, $location){

    $scope.unsubscribeData = null;

    User.mailUnsubscribe({md_id: $stateParams.md_id}, function(success){
        $scope.unsubscribeData = {
            type: 'user',
            valid: success.valid,
            message: 'Are you sure you want to stop receiving E-mail notifications from Dental Care Links?'
        };
    }, function(failure){
        ProviderInvitation.mailUnsubscribe({md_id: $stateParams.md_id}, function(success){
            $scope.unsubscribeData = {
                type: 'invitation',
                valid: success.valid,
                message: 'Are you sure you want to unsubscribe? This will also delete your invitation to Dental Care Links including any patient referral info they have provided. ' + (success.practice ? 'This invitation was sent by ' + success.practice.name + '.' : '')
            };
        }, function(failure){
            $state.go('error_page', {error_key: 'unsubscribe.token.not.found'});
        });
    });

    function ShowConfirmDialog(message){
        var modalInstance = $uibModal.open({
            templateUrl: 'partials/unsubscribe_modal.html',
            controller: 'UnsubscribeModalController',
            resolve: {
                confirmMessage: function(){
                    return message;
                }
            }
        });
        ModalHandler.set(modalInstance);
        modalInstance.result.then(function() {
            $location.url('/');
        });
    }

    $scope.confirm = function(data){
        if(data.type == 'user'){
            User.mailUnsubscribe({md_id: $stateParams.md_id, confirm: true}, function(success){
                ShowConfirmDialog("Your E-mail notification preference has been updated. You can always turn notifications back on by logging in to your Dental Care Links account and editing your user settings.");
            });
        } else if(data.type == 'invitation'){
            ProviderInvitation.mailUnsubscribe({md_id: $stateParams.md_id, confirm: true}, function(success){
                ShowConfirmDialog("Invitation has been successfully removed");
            });
        }
    };

}]);