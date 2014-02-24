var dentalLinks = angular.module('dentalLinks', []);

dentalLinks.controller('LoginController', ['$scope', '$http',
    function ($scope, $http) {

        $scope.login = function (user) {
            $http.post('/sign_in', {'user': {'email': user.email, 'password': user.password }}).success(function (data) {
                $scope.token = data.token;
                $scope.email = user.email;
                $scope.redirectUrl = '/practice_invite'

            });
        }
    }]);

dentalLinks.controller('PracticeInvitationsController', ['$scope', '$http', function ($scope, $http) {
    $scope.invite_practice = function (practice) {
        $http.post('/practice_invitations', {'practice': practice, email: $scope.email, authentication_token: $scope.token
        }).success(function (data) {
            $scope.invite_practice_result = data;
        });
    }
}]);

dentalLinks.controller('ReferralsController', ['$scope', '$http', function ($scope, $http) {

    $http.get('/patients', {'params': {'email': $scope.email, 'authentication_token': $scope.token}}).success(function (data) {
        $scope.patients = data;
    });

    $http.get('/practices', {'params': {'email': $scope.email, 'authentication_token': $scope.token}}).success(function (data) {
        $scope.practices = data;
    });

    $scope.create_referral = function (referral) {
        $http.post('/referrals', {'referral': referral, email: $scope.email, authentication_token: $scope.token}).success(function (data) {
            $scope.create_referral_result = data;
        });

    }
}]);

dentalLinks.controller('UsersController', ['$scope', '$http', function ($scope, $http) {
    $scope.roles = [
        {'mask':0, 'name': 'admin'},
        {'mask':2, 'name': 'doctor'},
        {'mask':4, 'name':'aux'}
    ];
    $http.get('/practices', {'params': {'email': $scope.email, 'authentication_token': $scope.token}}).success(function (data) {
        $scope.practices = data;
    });
    $scope.create_user = function (user) {
        $http.post('/sign_up', {'user': user, email: $scope.email, authentication_token: $scope.token}).success(function (data) {
            $scope.create_user_result = data;
        });
    }
}]);
