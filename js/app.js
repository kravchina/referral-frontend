var dentalLinks = angular.module('dentalLinks', ['ngRoute', 'dentalLinksControllers']);

dentalLinks.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.
        when('/sign_in', {
            templateUrl: 'partials/login.html',
            controller: 'LoginController'
        })
        .when('/referral', {
            templateUrl: 'partials/referral.html',
            controller: 'ReferralsController'
        })
        .when('/logout', {
            templateUrl: 'partial/login.html',
            controller: 'LoginController'
        })
        .otherwise({
            redirectTo: '/sign_in'
        });
}]);


dentalLinks.config(['$httpProvider', function ($httpProvider) {
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
    $httpProvider.interceptors.push('authInterceptor');
}
]);


dentalLinks.factory('authInterceptor', ['$rootScope', '$q', '$window', function ($rootScope, $q, $window) {
    return {
        request: function (config) {
            config.headers = config.headers || {};
            if ($window.sessionStorage.token) {
                config.headers.Authorization = $window.sessionStorage.token;
                config.params = config.params || {};
                config.params.email = $window.sessionStorage.email;
            }
            return config;
        },
        response: function (response) {
            if (response.status === 401) {
                // handle the case where the user is not authenticated
            }
            return response || $q.when(response);
        }
    };
}]);
