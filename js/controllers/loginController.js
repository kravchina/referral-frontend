var loginModule = angular.module('login', []);

loginModule.controller('LoginController', ['$scope', '$http', 'Auth', 'User', '$location', 'Login', 'redirect',
    function ($scope, $http, Auth, User, $location, Login, redirect) {
        var auth = Auth.get();
        if(auth){// user is authenticated by tries to open login window
            $location.path('/history');
        }
        $scope.email = (auth || {}).email;

        $scope.result = {failure: false};

        $scope.login = function (user) {   /*{'user': {'email': user.email, 'password': user.password }}*/

            user.email = $("#email").val();
            user.password = $("#password").val();

            // $http.post(host + '/sign_in', {'user': {'email': user.email, 'password': user.password }}).
            // success(function(success, status){
            //     Auth.set({token: success.token, email: user.email, roles: success.roles, id: success.id, practice_id: success.practice_id});

            //     user = User.get({id: success.id});
            //     Auth.current_user = user;

            //     $scope.email = user.email;
            //     $location.path(redirect.path);
            //     $scope.result = {success: true};
            // })
            // .error(function(failure, status){
            //     console.log(failure);
            //     Auth.remove();
            //     if(failure.status == 0){
            //         $scope.result = {failure: true, statusText: 'Upstream server connectivity error. Administrator was informed. Please try again later'};
            //     }else{
            //         $scope.result = {failure: true, statusText: 'Unable to login with provided credentials'};
            //     }
            //     console.log($scope.result);
            // })

            $.ajax({
                type: "POST",
                url: host + '/sign_in',
                data: {'user': {'email': user.email, 'password': user.password }},
                dataType: 'json',
                crossDomain : true
            })
            .done(function(success){
                Auth.set({token: success.token, email: user.email, roles: success.roles, id: success.id, practice_id: success.practice_id});

                user = User.get({id: success.id});
                Auth.current_user = user;

                $scope.email = user.email;
                $location.path(redirect.path);
                $scope.result = {success: true};
            })
            .fail(function(failure){
                console.log(failure);
                Auth.remove();
                if(failure.status == 0){
                    $scope.result = {failure: true, statusText: 'Upstream server connectivity error. Administrator was informed. Please try again later'};
                }else{
                    $scope.result = {failure: true, statusText: 'Unable to login with provided credentials'};
                }
                console.log($scope.result);
            });

        //     Login.login({'user': {'email': user.email, 'password': user.password }},
        //         function (success) {
        //             Auth.set({token: success.token, email: user.email, roles: success.roles, id: success.id, practice_id: success.practice_id});

        //             user = User.get({id: success.id});
        //             Auth.current_user = user;

        //             $scope.email = user.email;
        //             $location.path(redirect.path);
        //             $scope.result = {success: true};

        //         },
        //         function (failure) {
        //             console.log(failure);
        //             Auth.remove();
        //             if(failure.status == 0){
        //                 $scope.result = {failure: true, statusText: 'Upstream server connectivity error. Administrator was informed. Please try again later'};
        //             }else{
        //                 $scope.result = {failure: true, statusText: 'Unable to login with provided credentials'};
        //             }
        //             console.log($scope.result);
        //         });
        };
    }]);

