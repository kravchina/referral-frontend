angular.module('console')
    .service('ConsoleHelper', ['ProviderInvitation', 'Practice', 'User', 'Role', '$q',
        function(ProviderInvitation, Practice, User, Role, $q){
        return {
            findPractice: function(scope){

                return function(searchValue){
                    if(scope.destinationPractice){
                        scope.destinationPractice = {};
                    }
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
                        scope.practiceUsers = selectedPractice.users[0];
                    } else {
                        scope.destinationPractice = selectedPractice;
                        scope.destinationPractice.users = User.getAllUsers({practice_id: selectedPractice.id}, function(users){
                            return users;
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
        };

    }]);