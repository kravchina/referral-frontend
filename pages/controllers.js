var dentalLinks = angular.module('dentalLinks', []);

post_request = function(http, action, data, options, success_callback, error_callback){
    http.post('http://localhost:3000' + action, data, options).success(success_callback).error(error_callback)
};

get_request = function (http, action, options, success_callback, error_callback){
    http.get('http://localhost:3000' + action, options).success(success_callback).error(error_callback);
}        ;

dentalLinks.config(['$httpProvider', function($httpProvider) {
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
}
]);

dentalLinks.controller('LoginController', ['$scope', '$http',
    function ($scope, $http) {

        $scope.login = function (user) {
            post_request($http, '/sign_in', {'user': {'email': user.email, 'password': user.password }},{}, function (data) {
                $scope.token = data.token;
                $scope.email = user.email;
                $scope.redirectUrl = '/practice_invite'

            }, function(data){
                $scope.error = 'error'
            });
        }
    }]);

dentalLinks.controller('PracticeInvitationsController', ['$scope', '$http', function ($scope, $http) {
    $scope.invite_practice = function (practice) {
        post_request($http, '/practice_invitations', {'practice': practice, email: $scope.email, authentication_token: $scope.token
        }, function (data) {
            $scope.invite_practice_result = data;
        }, function (data){
            $scope.invite_practice_result = data;
        });
    }
}]);

dentalLinks.controller('ReferralsController', ['$scope', '$http', function ($scope, $http) {

    get_request($http, '/patients', {'params': {'email': $scope.email, 'authentication_token': $scope.token}}, function (data) {
        $scope.patients = data;
    });

    get_request($http, '/practices', {'params': {'email': $scope.email, 'authentication_token': $scope.token}}, function (data) {
        $scope.practices = data;
    });

    $scope.create_referral = function (referral) {
        post_request($http, '/referrals', {'referral': referral, email: $scope.email, authentication_token: $scope.token}, function (data) {
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
    get_request($http, '/practices', {'params': {'email': $scope.email, 'authentication_token': $scope.token}}, function (data) {
        $scope.practices = data;
    });
    $scope.create_user = function (user) {
        post_request($http, '/sign_up', {'user': user, email: $scope.email, authentication_token: $scope.token}, function (data) {
            $scope.create_user_result = data;
        });
    }
}]);
