angular.module('console')
    .controller('PracticeConsoleController', 
    ['$scope', '$stateParams', 'Auth', 'ConsoleHelper', '$uibModal', 'ModalHandler', 'Notification', 'ProviderInvitation', 'User', '$rootScope', 'Address', 'Procedure', 'Practice', 'Designation',
    function($scope, $stateParams, Auth, ConsoleHelper, $uibModal, ModalHandler, Notification, ProviderInvitation, User, $rootScope, Address, Procedure, Practice, Designation){
        $scope.practiceTypes = Procedure.practiceTypes();
        $scope.practiceDesignations = Designation.getAll();
        $scope.onPracticeSelected = ConsoleHelper.onPracticeSelected($scope);
        $scope.findPractice = ConsoleHelper.findPractice($scope);

        $scope.showFullRole = ConsoleHelper.showFullRole();

        $scope.showUserSpecialty = ConsoleHelper.showUserSpecialty($scope.practiceTypes);

        if($stateParams.id){
            Practice.get({practiceId: $stateParams.id}, function(success){
                $scope.practiceSearch = success;
                $scope.onPracticeSelected(success);
            }, function(failure){
                Notification.error('An error occurred during get practice...');
            });
            Practice.getStats({practiceId: $stateParams.id}, function(success){
                $scope.practiceStats = success;
            });
        }

        $scope.editDialog = function(editUser){
            var modalInstance;
            if (editUser.no_login) {
                modalInstance = $uibModal.open({
                    templateUrl: 'partials/edit_nologin_user_form.html',
                    controller: 'EditNoLoginUserModalController',
                    backdrop: 'static',
                    resolve: {
                        editUser: function () {
                            return editUser;
                        },
                        practiceType: function(){
                            return $scope.destinationPractice.practice_type;
                        },
                        practiceAddresses: function(){
                            return $scope.destinationPractice.addresses;
                        },
                        showNameControls: function(){
                            return true;
                        }
                    }
                });
                ModalHandler.set(modalInstance);
                modalInstance.result.then(function (data) {
                    Notification.success('A verification email has been sent to ' + data.email + '. After the address is verified the provider will be able to login.');
                });
            } else {
                modalInstance = $uibModal.open({
                    templateUrl: 'partials/edit_user_form.html',
                    controller: 'EditUserModalController',
                    resolve: {
                        editUser: function () {
                            return editUser;
                        },
                        practiceUsers: function() {
                            return $scope.destinationPracticeUsers;
                        },
                        practiceType: function(){
                            return $scope.destinationPractice.practice_type;
                        },
                        practiceAddresses: function(){
                            return $scope.destinationPractice.addresses;
                        },
                        showRoleSelector: function(){
                            return true;
                        },
                        showNameControls: function(){
                            return true;
                        }
                    }
                });


            }
            ModalHandler.set(modalInstance);
        };

        $scope.deleteUser = function (user) {
            if (user.status && user.status === 'invited') {
                ProviderInvitation.delete({id: user.id}, function (success) {
                        if(success.msg){
                            Notification.error(success.msg);
                        }else{
                            if ($scope.destinationPractice.isInvitation) {
                                $scope.destinationPractice = {};
                                $scope.practiceSearch = '';
                            } else {
                                $scope.destinationPracticeUsers.splice($scope.destinationPracticeUsers.indexOf(user), 1);
                            }
                        }
                    },
                    function (failure) {
                        Notification.error('An error occurred during invitation removal...')
                    });

            } else if (user.status && user.status === 'registered') {
                User.delete({id: user.id}, function (success) {
                        if (success.msg) {
                            Notification.error(success.msg)
                        } else {
                            $scope.destinationPracticeUsers.splice($scope.destinationPracticeUsers.indexOf(user), 1);
                        }
                    },
                    function (failure) {
                        Notification.error('An error occurred during user removal...');
                    });
            }
        };

        $scope.usersDialog = function () {
            var scope = $rootScope.$new();
            scope.params = {
                practiceId: $scope.destinationPractice.id
            };

            var modalInstance = $uibModal.open({
                templateUrl: 'partials/user_form.html',
                controller: 'UserModalController',
                resolve: {
                    practiceTypes: function () {
                        return $scope.practiceTypes;
                    },
                    practice: function () {
                        return $scope.destinationPractice;
                    }
                },
                scope: scope
            });
            ModalHandler.set(modalInstance);
            modalInstance.result.then(function (user) {
                $scope.destinationPracticeUsers.push(user);
            });
        };

        $scope.addAddress = function () {
            if ($scope.practiceSearch.addresses.length < 20) {
                $scope.practiceSearch.addresses.push({new: true, _isOpen: true});
            }
        };

        $scope.removeAddress = function(address){
            if(address.new){
                $scope.practiceSearch.addresses.splice($scope.practiceSearch.addresses.indexOf(address),1);
            } else {
                Address.delete({id: address.id}, function(success){
                    $scope.practiceSearch.addresses.splice($scope.practiceSearch.addresses.indexOf(address),1);
                    Notification.success('Address delete success');
                }, function(failure){
                    Notification.success('Address delete fail');
                });
            }
        };
        $scope.selectPractice = function(item){
            $scope.onPracticeSelected(item);
            Practice.getStats({practiceId: item.id}, function(success){
                $scope.practiceStats = success;
            });
        };

        $scope.saveAddress = function(addressForm, address) {
            if (addressForm.$dirty && !addressForm.$invalid) {
                if(!address.new) {
                    Address.update({id: address.id}, address, function(success){
                        Notification.success('Address save success');
                    }, function(failure){
                        Notification.error(failure.error.message[0]);
                    });
                } else {
                    address.practice_id = $scope.practiceSearch.id;
                    Address.save({address: address}, function(success){
                        var index = $scope.practiceSearch.addresses.indexOf(address);
                        $scope.practiceSearch.addresses[index] = JSON.parse(JSON.stringify(success));
                        $scope.practiceSearch.addresses[index]._isOpen = true;
                        Notification.success('Address create success');
                    }, function(failure){
                        Notification.success('Address create fail');
                    });
                }
            }
        };

        $scope.savePractice = function(practiceForm, destinationPractice){
            if (practiceForm.$dirty && !practiceForm.$invalid) {
                destinationPractice.practice_type_id = destinationPractice.practice_type.id;
                destinationPractice.designation_id = destinationPractice.designation ? destinationPractice.designation.id : null;
                destinationPractice.addresses_attributes = destinationPractice.addresses;
                Practice.update({practiceId: destinationPractice.id}, {practice: destinationPractice}, function (success) {
                    $scope.destinationPractice = $scope.practiceSearch = success;
                    Notification.success('Practice update success');
                }, function (failure) {
                    Notification.error(failure.data.message ? failure.data.message : 'Practice update fail');
                });
            }
        };

        $scope.removePractice = function(practice){
            var modalInstance = $uibModal.open({
                templateUrl: 'partials/practice_delete_form.html',
                controller: 'PracticeDeleteModalController',
                resolve: {
                    selectedPractice: function(){
                        return practice;
                    }
                }
            });
            ModalHandler.set(modalInstance);
            modalInstance.result.then(function (error) {
                $scope.destinationPractice = $scope.destinationPracticeUsers = $scope.practiceSearch = '';
            });
        };

        $scope.createPractice = function() {
            var modalInstance = $uibModal.open({
                templateUrl: 'partials/practice_form.html',
                controller: 'PracticeModalController'
            });
            ModalHandler.set(modalInstance);
            modalInstance.result.then(function (practice) {
                Practice.save({practice: practice}, function(success){
                    $scope.destinationPractice = $scope.practiceSearch = success;
                    $scope.destinationPracticeUsers = [];
                    Notification.success('Practice create success');
                }, function(failure){
                    Notification.error('Practice create fail');
                });
            });
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
                        return $scope.practiceUser.id;
                    }
                }
            });
            ModalHandler.set(modalInstance);
            modalInstance.result.then(function (provider) {
                Notification.success('Provider invitation was send success');
            });
        };

        $scope.approvePractice = function(practice) {
            Practice.updateStatus({practiceId: practice.id}, {status: 'approved'},
                function(success){
                    $scope.destinationPractice.status = success.status;
                    Notification.success('Practice has been approved successfully');
                }, function(failure){
                    Notification.error(failure.data.message)
                });
        };

        $scope.extendTrial = function(practice){
            Practice.prolongTrial({practiceId: practice.id}, {},
                function(success){
                    practice.subscription_active_until = success.subscription_active_until;
                    Notification.success('Trial was prolonged successfully!')
                },
                function(failure){
                    Notification.error('Trial prolongation failed. Please try again later')
                });
        };

        $scope.giveCoupon = function(practice){
            Practice.giveCoupon({practiceId: practice.id}, {},
                function(success){
                    Notification.success('Coupon was applied successfully!')
                },
                function(failure){
                    Notification.error('Coupon applying failed')
                });
        };
    }]);
