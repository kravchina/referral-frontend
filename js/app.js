var dentalLinks = angular.module('dentalLinks', ['ngRoute', 'dentalLinksControllers', 'dentalLinksServices', 'dentalLinksDirectives']);

dentalLinks.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.
        when('/sign_in', {
            templateUrl: 'partials/login.html',
            controller: 'LoginController'
        }).
        when('/create_referral', {
            templateUrl: 'partials/create_referral.html',
            controller: 'ReferralsController'
        }).
        when('/logout', {
            templateUrl: 'partials/login.html',
            controller: 'LoginController'
        }).
        when('/reset_password',{
            templateUrl: 'partials/reset_password.html',
            controller: 'PasswordsController'
        }).
        when('/edit_password/:reset_password_token',{
            templateUrl: 'partials/edit_password.html',
            controller: 'PasswordsController'
        }).
        when('/view_referral/:referral_id',{
            templateUrl: 'partials/view_referral.html',
            controller: 'ReferralsViewController'
        }).
        otherwise({
            redirectTo: '/sign_in'
        });
}])
    .run(['$rootScope','$window', '$location', 'redirect', function($rootScope, $window, $location, redirect){

        $rootScope.$on("$locationChangeStart", function(event, next, current) {
            if(!$window.sessionStorage.token){
                redirect.path = $location.path();
                $location.path('/sign_in');
            }
        })}]);

dentalLinks.value('redirect', {path: '/'});

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
                config.headers.From = $window.sessionStorage.email;
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
