angular.module('console')
    .controller('PracticeConsoleController', ['$scope', 'Auth', 'ConsoleHelper', '$modal', 'ModalHandler', 'Notification', 'ProviderInvitation', 'User', 'Address', 'Procedure',
    function($scope, Auth, ConsoleHelper, $modal, ModalHandler, Notification, ProviderInvitation, User, Address, Procedure){
        $scope.practiceTypes = Procedure.practiceTypes();
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
                            $scope.destinationPractice = {};
                            $scope.practiceSearch = '';
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
                        Notification.error('An error occurred during user removal...');
                    });
            }

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
                    console.log(failure);
                });
            }
        };

        $scope.saveAddress = function(addressForm, address) {
            if (addressForm.$dirty && !addressForm.$invalid) {
                if(!address.new) {
                    Address.update({id: address.id}, address, function(success){
                        Notification.success('Address save success');
                    }, function(failure){
                        console.log(failure);
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
                        console.log(failure);
                    });
                }
            }
        };

        $scope.savePractice = function(practiceForm, destinationPractice){
            console.log('practiceForm', practiceForm);
            console.log('practice', destinationPractice);
            console.log('types', $scope.practiceTypes);
        };

        $scope.removePractice = function(practice){
            console.log(practice);
        };

        $scope.createPractice = function() {
            var modalInstance = $modal.open({
                templateUrl: 'partials/practice_form.html',
                controller: 'PracticeModalController'
            });
            ModalHandler.set(modalInstance);
            modalInstance.result.then(function (practice) {
                $scope.destinationPractice = $scope.practiceSearch = practice;
            });
        };

    }]);
