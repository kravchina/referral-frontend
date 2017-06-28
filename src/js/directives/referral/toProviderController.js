angular.module('dentalLinks')
    .controller('ToProviderController', ['$scope', 'Auth', '$modal', 'ModalHandler',
        function ($scope, Auth, $modal, ModalHandler) {
            $scope.providerDialog = function () {
                var modalInstance = $modal.open({
                    templateUrl: 'partials/provider_form.html',
                    controller: 'ProviderModalController',
                    resolve: {
                        sendEmailNotification: function(){
                            return false;
                        },
                        inviterId: function(){
                            return Auth.getOrRedirect().id;
                        }
                    }
                });
                ModalHandler.set(modalInstance);
                modalInstance.result.then(function (provider) {
                    $scope.destinationPractice = {users: [provider], name: '-- pending registration --'};
                    $scope.practiceSearchText = $scope.destinationPractice.name;
                    $scope.model.referral.dest_provider_invited_id = provider.id;
                    $scope.model.referral.isCreatedNow = true;
                    $scope.form.$setDirty();  //need for unsaved changes
                    $scope.form.practice.$setValidity('editable', true);//fix for the case, when practice has invalid value and then provider is invited (removes practice's validation error and sets state to valid to enable saving)
                });
            }
        }
    ]);
