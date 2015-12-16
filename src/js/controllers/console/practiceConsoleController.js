angular.module('console')
    .controller('PracticeConsoleController', ['$scope', 'Auth', 'ConsoleHelper', '$modal', 'ModalHandler', 'ProviderInvitation', 'User',
    function($scope, Auth, ConsoleHelper, $modal, ModalHandler, ProviderInvitation, User){

        $scope.onPracticeSelected = ConsoleHelper.onPracticeSelected($scope);

        $scope.findPractice = ConsoleHelper.findPractice($scope);

        $scope.showFullRole = ConsoleHelper.showFullRole();

        $scope.editDialog = function(editUser){
            var modalInstance;
            if (editUser.no_login) {
                modalInstance = $modal.open({
                    templateUrl: 'partials/edit_nologin_user_form.html',
                    controller: 'EditNoLoginUserModalController',
                    backdrop: 'static',
                    resolve: {
                        editUser: function () {
                            return editUser;
                        }
                    }
                });
                ModalHandler.set(modalInstance);
                modalInstance.result.then(function (data) {
                    Notification.success('A verification email has been sent to ' + data.email + '. After the address is verified the provider will be able to login.');
                });
            } else {
                modalInstance = $modal.open({
                    templateUrl: 'partials/edit_user_form.html',
                    controller: 'EditUserModalController',
                    resolve: {
                        editUser: function () {
                            return editUser;
                        },
                        practiceUsers: function() {
                            return $scope.destinationPractice.users;
                        }
                    }
                });


            }
            ModalHandler.set(modalInstance);
        };

        $scope.deleteUser = function (user) {
            if (user.status) {
                ProviderInvitation.delete({id: user.id}, function (success) {
                        if(success.msg){
                            Notification.error( success.msg);
                        }else{
                            $scope.destinationPractice.users.splice($scope.destinationPractice.users.indexOf(user), 1);
                        }

                    },
                    function (failure) {
                        Notification.error('An error occurred during invitation removal...')
                    });

            } else {
                User.delete({id: user.id}, function (success) {
                        if(success.msg){
                            Notification.error(success.msg)
                        }else{
                            $scope.destinationPractice.users.splice($scope.destinationPractice.users.indexOf(user), 1);
                        }

                    },
                    function (failure) {
                        Notification.error('An error occurred during user removal...')
                    });
            }

        };

    }]);
