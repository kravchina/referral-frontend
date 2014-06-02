dentalLinks.controller('NavController', ['$scope', 'Auth', 'User', '$location', 'Login', 'redirect',
    function ($scope, Auth, User, $location, Login, redirect) {

        if(Auth.get()){
            Auth.current_user = User.get({id: Auth.get().id});
        }else{
            Auth.current_user = null;
        }

        $scope.first_name = function() {
            var current_user = Auth.current_user;
            return (current_user || {}).first_name;
        }

        $scope.last_name = function() {
            var current_user = Auth.current_user;
            return (current_user || {}).last_name;
        }

        $scope.logged = function () {
            return Auth.get() != undefined;
        };

    }]);

