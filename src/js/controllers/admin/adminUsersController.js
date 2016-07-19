angular.module('admin')
    .controller('AdminUsersController', ['$scope',  '$modal',  'Notification', 'ModalHandler', 'Practice', 'ProviderInvitation', 'User', 'FREE_TRIAL_PERIOD', 'Logger', 'USER_ROLES', 'Role',
    function ($scope, $modal, Notification, ModalHandler, Practice, ProviderInvitation, User, FREE_TRIAL_PERIOD, Logger, USER_ROLES, Role) {
        
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
        User.getInvitees({user_id: $scope.$parent.auth.id, practice_id: $scope.$parent.auth.practice_id }, function(allInvitees) {
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
                if(!user.no_login){
                    var newModalInstance = $modal.open({
                        templateUrl: 'partials/invite_user_result.html',
                        controller: 'InviteUserResultController',
                        resolve: {
                            toEmail: function(){
                                return user.email;
                            }
                        }
                    });
                    ModalHandler.set(newModalInstance);
                }

                $scope.invitedUsers.push(user);
            });
        };

        $scope.editDialog = function (editUser) {
            var modalInstance;
            if (editUser.no_login) {
                modalInstance = $modal.open({
                    templateUrl: 'partials/edit_nologin_user_form.html',
                    controller: 'EditNoLoginUserModalController',
                    backdrop: 'static',
                    resolve: {
                        editUser: function () {
                            return editUser;
                        },
                        practiceType: function(){
                            return $scope.practice.practice_type;
                        },
                        practiceAddresses: function(){
                            return $scope.practice.addresses;
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
                            return $scope.practice.users;
                        },
                        practiceType: function(){
                            return $scope.practice.practice_type;
                        },
                        practiceAddresses: function(){
                            return $scope.practice.addresses;
                        },
                        showInEditDialog: function(){
                            return false;
                        }
                    }
                });


            }
            ModalHandler.set(modalInstance);
            modalInstance.result.then(function (user) {
                if(user.password) {
                    var passwordEditModal = $modal.open({
                        templateUrl: 'partials/password_edit_modal.html',
                        controller: 'PasswordEditModalController',
                        resolve: {
                            message: function () {
                                return 'Your password has been changed successfully';
                            }
                        }
                    });
                    ModalHandler.set(passwordEditModal);
                }
            });
        };

        $scope.deleteUser = function (user) {
            if (user.status) {
                ProviderInvitation.delete({id: user.id}, function (success) {
                        if(success.msg){
                            Notification.error( success.msg);
                        }else{
                            $scope.invitedUsers.splice($scope.invitedUsers.indexOf(user), 1);
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
                            $scope.practice.users.splice($scope.practice.users.indexOf(user), 1);
                        }

                    },
                    function (failure) {
                        Notification.error('An error occurred during user removal...')
                    });
            }

        };

        $scope.roleName = function(roles_mask){
            var str = '';
            Role.getFromMask(roles_mask).reverse().forEach(function(elem){
                str += str == '' ? elem.name : ', ' + elem.name;
            });
            return str;
        };

    }]);