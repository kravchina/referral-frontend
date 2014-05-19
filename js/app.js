var dentalLinks = angular.module('dentalLinks', ['ui.router', 'ngCookies', 'dentalLinksControllers', 'dentalLinksServices', 'dentalLinksDirectives']);

dentalLinks.constant('userRoles', {
    public: 'public',
    doctor: 'doctor',
    admin: 'admin',
    aux: 'aux'
});

dentalLinks.config(['$stateProvider', '$urlRouterProvider', 'userRoles', function ($stateProvider, $urlRouterProvider, userRoles) {
    $stateProvider.
        state('signIn', {
            url: '/sign_in',
            templateUrl: 'partials/login.html',
            controller: 'LoginController'
        }).
        state('createReferral', {
            url: '/create_referral',
            templateUrl: 'partials/create_referral.html',
            controller: 'ReferralsController',
            access: [userRoles.doctor, userRoles.admin]
        }).
        state('logout', {
            url: '/logout',
            templateUrl: 'partials/login.html',
            controller: 'LoginController'
        }).
        state('resetPassword', {
            url: '/reset_password',
            templateUrl: 'partials/reset_password.html',
            controller: 'PasswordsController'
        }).
        state('resetPasswordToken', {
            url: '/edit_password/:reset_password_token',
            templateUrl: 'partials/edit_password.html',
            controller: 'PasswordsController'
        }).
        state('viewReferral', {
            url: '/view_referral/:referral_id',
            templateUrl: 'partials/view_referral.html',
            controller: 'ReferralsViewController',
            access: [userRoles.doctor, userRoles.admin]
        }).
        state('history', {
            url: '/history',
            templateUrl: 'partials/history.html',
            controller: 'HistoryController',
            access: [userRoles.doctor, userRoles.admin]
        }).
        state('admin', {
            url: '/admin',
            templateUrl: 'partials/admin.html',
            controller: 'AdminController',
            access: [userRoles.doctor, userRoles.admin]
        });
    $urlRouterProvider.otherwise('/sign_in');
}])
    .run(['$rootScope', '$window', '$location', '$state', 'redirect', 'Auth', function ($rootScope, $window, $location, $state, redirect, Auth) {

        $rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {
            if (!Auth.authorize(toState.access)) {
                event.preventDefault();
                redirect.path = $location.path();
                //$location.path('/sign_in');
                $state.go('signIn');
            }
        })
    }]);

dentalLinks.value('redirect', {path: '/'});

dentalLinks.config(['$locationProvider', function ($locationProvider) {
    /*$locationProvider.html5Mode(true);*/ //doesn't work without server-side url rewriting, to return on every request only the entrypoint page (like index.html)
}]);

dentalLinks.config(['$httpProvider', function ($httpProvider) {
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
    $httpProvider.interceptors.push('authInterceptor');
}
]);


dentalLinks.factory('authInterceptor', ['$rootScope', '$q', 'Auth', function ($rootScope, $q, Auth) {
    return {
        request: function (config) {
            config.headers = config.headers || {};
            var auth = Auth.get();
            if (auth && auth.token) {
                config.headers.Authorization = auth.token;
                config.headers.From = auth.email;
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
