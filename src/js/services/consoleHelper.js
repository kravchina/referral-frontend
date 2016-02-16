angular.module('console')
    .service('ConsoleHelper', ['ProviderInvitation', 'Practice', 'User', 'Role', '$q', '$location',
        function(ProviderInvitation, Practice, User, Role, $q, $location){
        return {
            findPractice: function(scope){
                return function(searchValue){
                    scope.destinationPractice = null;
                    scope.destinationPracticeUsers = null;

                    var providersPromise = Practice.searchPractice({search: searchValue}).$promise;
                    var invitationsPromise = ProviderInvitation.searchProviderInvitation({search: searchValue}).$promise;

                    return $q.all([providersPromise, invitationsPromise]).then(function(results){
                        var practices = results[0];
                        var invitations = results[1].map(function(elem){
                            return {users: [elem], name: '-- pending registration --', isInvitation: true};
                        });
                        return practices.concat(invitations);
                    });

                };
            },
            onPracticeSelected: function(scope){
                return function(selectedPractice){
                    if(typeof selectedPractice.isInvitation !== 'undefined' && selectedPractice.isInvitation){
                        scope.destinationPractice = selectedPractice;
                        scope.destinationPractice.name = '-- pending registration --';
                        scope.destinationPracticeUsers = selectedPractice.users;
                        scope.practiceUser = selectedPractice.users[0];
                    } else {
                        scope.destinationPractice = selectedPractice;

                        var usersPromise = User.getAllUsers({practice_id: selectedPractice.id}).$promise;
                        var providersPromise = ProviderInvitation.practice({id: selectedPractice.id}).$promise;

                        $q.all([usersPromise, providersPromise]).then(function(result){
                            var registeredUsers = result[0].map(function(user){
                                user.status = 'registered';
                                return user;
                            });

                            var invitedUsers = result[1].map(function(provider){
                                provider.status = 'invited';
                                return provider;
                            });

                            scope.destinationPracticeUsers = registeredUsers.concat(invitedUsers);
                        });
                    }

                };
            },
            showFullRole: function(){
                return function(roleMask){
                    var str = '';
                    Role.getFromMask(roleMask).reverse().forEach(function(elem){
                        str += str == '' ? elem.name : ', ' + elem.name;
                    });
                    return str;
                };
            },
            showUserSpecialty: function(practiceTypes){
                return function(specialtyId){
                    for(var i = 0; i < practiceTypes.length; i++) {
                        if(practiceTypes[i].id == specialtyId) {
                            return practiceTypes[i].name;
                        }
                    }
                };
            },
            showInviteLink: function() {
                return function(user){
                    return $location.protocol() + '://' + $location.host() +
                        ($location.port() == '80' ? '' : ':' + $location.port()) +
                        '/#/register/' + user.token;
                };
            }
        };

    }]);