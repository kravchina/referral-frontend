dentalLinks.controller('NavController', ['$scope', 'Auth', 'User', '$location', 'Login', 'redirect',
    function ($scope, Auth, User, $location, Login, redirect) {

        $scope.current_user = null

        $scope.account = function() {
            var auth = Auth.get();
            $scope.authenticated = auth;
            $scope.email = (auth || {}).email;

            if(auth){
                $scope.current_user =  User.get({id: auth.id});
            }else{
                $scope.current_user = null;
            }
        }

        $scope.logged = function () {
            return Auth.get() != undefined;
        };

    }]);


