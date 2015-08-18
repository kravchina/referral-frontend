angular.module('admin')
    .controller('AdminUsersController', ['$scope', '$state', '$modal', 'Auth', 'Alert', 'ModalHandler', 'Practice', 'ProviderInvitation', 'User', 'UnsavedChanges', 'FREE_TRIAL_PERIOD', 'PhoneFormatter', 'Logger',
    function ($scope, $state, $modal, Auth, Alert, ModalHandler, Practice, ProviderInvitation, User, UnsavedChanges, FREE_TRIAL_PERIOD, PhoneFormatter, Logger) {
        
        $scope.practice = Practice.get({practiceId: $scope.$parent.auth.practice_id}, function(practice) {
            Logger.log('existing users = ' + JSON.stringify(practice.users));
        });

        $scope.practice.$promise.then(function (data) {
            Logger.log($scope.practice);
            Logger.log(FREE_TRIAL_PERIOD);
            $scope.trial_end_date = new Date($scope.practice.created_at);
            $scope.trial_end_date.setDate($scope.trial_end_date.getDate() + FREE_TRIAL_PERIOD)
        });  

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

        $scope.usersDialog = function () {
            var modalInstance = $modal.open({
                templateUrl: 'partials/user_form.html',
                controller: 'UserModalController'
            });
            ModalHandler.set(modalInstance);
            modalInstance.result.then(function (user) {
                $scope.invitedUsers.push(user);
            });
        };

        $scope.editDialog = function (editUser) {
            var modalInstance = $modal.open({
                templateUrl: 'partials/edit_user_form.html',
                controller: 'EditUserModalController',
                resolve: {
                    editUser: function () {
                        return editUser;
                    }
                }
            });
            ModalHandler.set(modalInstance);
            modalInstance.result.then(function (user) {
                editUser.is_admin = user.is_admin; //update user's role after editing
            });
        };

        $scope.deleteUser = function (user) {
            if (user.status) {
                ProviderInvitation.delete({id: user.id}, function (success) {
                        if(success.msg){
                            Alert.error($scope.alerts, success.msg)
                        }else{
                            $scope.invitedUsers.splice($scope.invitedUsers.indexOf(user), 1);
                        }

                    },
                    function (failure) {
                        Alert.error($scope.alerts, 'An error occurred during invitation removal...')
                    });

            } else {
                User.delete({id: user.id}, function (success) {
                        if(success.msg){
                            Alert.error($scope.alerts, success.msg)
                        }else{
                            $scope.practice.users.splice($scope.practice.users.indexOf(user), 1);
                        }

                    },
                    function (failure) {
                        Alert.error($scope.alerts, 'An error occurred during user removal...')
                    });
            }

        };

        $scope.roleName = function(is_admin, roles_mask){
            return (roles_mask == 2 ? "Doctor" : "Aux") + (is_admin ? ", Admin" : "")
        };

    }]);