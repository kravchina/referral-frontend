angular.module('console')
    .service('ConsoleHelper', ['Practice', 'User', 'Role', function(Practice, User, Role){
        return {
            findPractice: function(scope){

                return function(searchValue){
                    if(scope.destinationPractice){
                        scope.destinationPractice = {};
                    }
                    return Practice.searchPractice({search: searchValue}).$promise;
                };
            },
            onPracticeSelected: function(scope){
                return function(selectedPractice){
                    scope.destinationPractice = selectedPractice;
                    scope.destinationPractice.users = User.getAllUsers({practice_id: selectedPractice.id}, function(users){
                        return users;

                    });
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