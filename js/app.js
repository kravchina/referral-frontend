var dentalLinks = angular.module('dentalLinks', ['ngRoute', 'dentalLinksControllers', 'dentalLinksServices']);

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
            templateUrl: 'partials/login.html',
            controller: 'LoginController'
        })
        .when('/reset_password',{
            templateUrl: 'partials/reset_password.html',
            controller: 'PasswordsController'
        })
        .when('/edit_password',{
            templateUrl: 'partials/edit_password.html',
            controller: 'PasswordsController'
        })
        .otherwise({
            redirectTo: '/sign_in'
        });
}]);

dentalLinks.config(['$locationProvider', function($locationProvider){
    /*$locationProvider.html5Mode(true);*/ //doesn't work without server-side url rewriting, to return on every request only the entrypoint page (like index.html)
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
