angular.module('unsubscribe')
    .controller('UnsubscribeController', ['$scope', '$state', '$stateParams', 'User', 'ProviderInvitation', '$modal', 'ModalHandler',
    function($scope, $state, $stateParams, User, ProviderInvitation, $modal, ModalHandler){

    $scope.unsubscribeData = {};

    User.mailUnsubscribe({md_id: $stateParams.md_id}, function(success){
        $scope.unsubscribeData = {
            type: 'user',
            valid: success.valid,
            message: 'Are you sure you want to unsubscribe from DentalCareLinks?'
        };
    }, function(failure){
        ProviderInvitation.mailUnsubscribe({md_id: $stateParams.md_id}, function(success){
            $scope.unsubscribeData = {
                type: 'invitation',
                valid: success.valid,
                message: 'Are you sure you want to delete invitation from DentalCareLinks?'
            };
        }, function(failure){
            $state.go('error_page', {error_key: 'unsubscribe.token.not.found'});
        });
    });

    function ShowConfirmDialog(message){
        var modalInstance = $modal.open({
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
            $state.go('signIn');
        });
    };

    $scope.confirm = function(data){
        if(data.type == 'user'){
            User.mailUnsubscribe({md_id: $stateParams.md_id, confirm: true}, function(success){
                ShowConfirmDialog("E-mail notification successfully changed");
            });
        } else if(data.type == 'invitation'){
            ProviderInvitation.mailUnsubscribe({md_id: $stateParams.md_id, confirm: true}, function(success){
                ShowConfirmDialog("Invitation has been successfully removed");
            });
        }
    };

}]);