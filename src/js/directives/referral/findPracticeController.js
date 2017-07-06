angular.module('dentalLinks')
    .controller('FindPracticeController', ['$scope', 'Practice', 'User', 'ProviderInvitation', '$q',
        function ($scope, Practice, User, ProviderInvitation, $q) {
            $scope.findPractice = function (searchValue) {
                if($scope.model.referral.isCreatedNow) {
                    $scope.tempDestinationPractice = $scope.destinationPractice;
                }
                $scope.destinationPractice = [];
                var providersPromise = Practice.searchPractice({search: searchValue}).$promise;
                var invitationsPromise = ProviderInvitation.searchProviderInvitation({search: searchValue}).$promise;
                return $q.all([providersPromise, invitationsPromise]).then(function (results) {

                    var practices = [];
                    var length = results[0].length;
                    for (var i = 0; i < length; i++) {
                        var p = results[0][i];
                        practices.push(JSON.parse(JSON.stringify(p)));
                    }

                    var invitations = results[1].map(function (invitation) {
                        invitation.roles_mask = 2;
                        return {users: [invitation], name: '-- pending registration --', isInvitation: true};
                    });
                    return practices.concat(invitations);
                });
            };

            $scope.onPracticeSelected = function (selectedItem) {
                // this triggers refresh of items in provider dropdown
                $scope.destinationPractice = selectedItem;

                $scope.practiceSearchText = $scope.destinationPractice.name;

                if($scope.destinationPractice.addresses && $scope.destinationPractice.addresses.length == 1) {
                    $scope.model.referral.address_id = $scope.destinationPractice.addresses[0].id;
                }
                if (selectedItem.isInvitation) {
                    $scope.model.referral.dest_provider_invited_id = selectedItem.users[0].id;
                    $scope.model.referral.dest_provider_id = null;
                } else {
                    $scope.destinationPractice.users = User.getOtherProviders({practice_id: selectedItem.id}, function(users){
                        $scope.model.referral.dest_provider_invited_id = null;
                        if (users.length == 1) {
                            $scope.model.referral.dest_provider_id = users[0].id;
                        }
                        users.unshift({id: -1, first_name: 'First', last_name: 'Available', firstAvailable: true});

                    });
                }
                // select default referral type from practice type
                $scope.updatePracticeType(selectedItem.practice_type_id);
            };

            $scope.updatePracticeType = function (practice_type_id) {
                for (var i = 0; i < $scope.practiceTypes.length; i++) {
                    if ($scope.practiceTypes[i].id == practice_type_id) {
                        $scope.practiceType = $scope.practiceTypes[i];
                        break;
                    }
                }
            };
        }
    ]);
