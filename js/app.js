var dentalLinks = angular.module('dentalLinks', [
    'ui.router',
    'ngCookies',
    'admin',
    'history',
    'login',
    'passwords',
    'createReferrals',
    'viewReferrals',
    'modals',
    'pdf',
    'registration',
    'unsavedChanges',
    'dentalLinksServices',
    'dentalLinksDirectives',
    'ui.mask'
]);

dentalLinks.constant('USER_ROLES', {
    public: 'public',
    doctor: 'doctor',
    admin: 'admin',
    aux: 'aux'
});

dentalLinks.constant('FREE_TRIAL_PERIOD', 45);
dentalLinks.constant('STRIPE_KEY', 'pk_test_XUhHfTuR70aPg0tIf1bCYXqI');

dentalLinks.constant('AUTH_EVENTS', {
    notAuthenticated: 'auth-not-authenticated'
});

dentalLinks.config(['$stateProvider', '$urlRouterProvider', 'USER_ROLES', function ($stateProvider, $urlRouterProvider, USER_ROLES) {
    $stateProvider.
        state('signIn', {
            url: '/sign_in',
            templateUrl: 'partials/login.html',
            controller: 'LoginController'
        }).
        state('registration', {
            url: '/register/:invitation_token',
            templateUrl: 'partials/registration.html',
            controller: 'RegistrationController'
        }).
        state('createReferral', {
            url: '/create_referral/:referral_id',
            templateUrl: 'partials/create_referral.html',
            controller: 'CreateReferralsController',
            access: [USER_ROLES.doctor, USER_ROLES.admin, USER_ROLES.aux]
        }).
        state('reviewReferral', {
            url: '/create_referral/:referral_id',
            templateUrl: 'partials/create_referral.html',
            controller: 'CreateReferralsController',
            access: [USER_ROLES.doctor, USER_ROLES.admin, USER_ROLES.aux]
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
            templateUrl: 'partials/registration.html',
            controller: 'PasswordsController'
        }).
        state('viewReferral', {
            url: '/view_referral/:referral_id',
            templateUrl: 'partials/view_referral.html',
            controller: 'ViewReferralsController',
            access: [USER_ROLES.doctor, USER_ROLES.admin, USER_ROLES.aux]
        }).
        state('history', {
            url: '/history',
            templateUrl: 'partials/history.html',
            controller: 'HistoryController',
            access: [USER_ROLES.doctor, USER_ROLES.admin, USER_ROLES.aux]
        }).
        state('admin', {
            url: '/admin',
            templateUrl: 'partials/admin.html',
            controller: 'AdminController',
            access: [USER_ROLES.doctor, USER_ROLES.admin, USER_ROLES.aux]
        }).
        state('faq', {
            url: '/faq',
            templateUrl: 'partials/faq.html'
        });
    $urlRouterProvider.otherwise('/sign_in');
}])
    .run(['$rootScope', '$window', '$location', '$state', 'redirect', 'Auth', 'AUTH_EVENTS', 'UnsavedChanges', 'ModalHandler', function ($rootScope, $window, $location, $state, redirect, Auth, AUTH_EVENTS, UnsavedChanges, ModalHandler) {

        $rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {

            ModalHandler.dismissIfOpen();  //close dialog if open.

            if (!Auth.authorize(toState.access)) {
                event.preventDefault();
                $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated, {redirect: $location.path()});
            }
        });
        $rootScope.$on(AUTH_EVENTS.notAuthenticated, function (event, args) {
            console.log('notAuthenticated');
            Auth.remove();
            redirect.path = args.redirect;
            $state.go('signIn', {}, {reload: true});
        });
        UnsavedChanges.init();
    }]);

dentalLinks.value('redirect', {path: '/history'});

dentalLinks.config(['$locationProvider', function ($locationProvider) {
    /*$locationProvider.html5Mode(true);*/ //doesn't work without server-side url rewriting, to return on every request only the entrypoint page (like index.html)
}]);

dentalLinks.config(['$httpProvider', function ($httpProvider) {
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
    $httpProvider.interceptors.push('authInterceptor');
    $httpProvider.interceptors.push('spinnerInterceptor');
}
]);

dentalLinks.factory('spinnerInterceptor', ['$q', 'Spinner', function ($q, Spinner) {
    return {
        request: function (config) {
            // do something on success
            Spinner.show();
            return config;
        },

        requestError: function (rejection) {
            Spinner.hide();
            return $q.reject(rejection);
        },

        response: function (response) {
            Spinner.hide();
            return response;
        },

        responseError: function (rejection) {
            Spinner.hide();
            return $q.reject(rejection);
        }
    };
}]);

dentalLinks.factory('authInterceptor', ['$rootScope', '$q', 'AUTH_EVENTS', '$location', 'redirect', 'Auth', function ($rootScope, $q, AUTH_EVENTS, $location, redirect, Auth) {
    return {
        request: function (config) {
            config.headers = config.headers || {};
            var auth = Auth.get();
            if (auth && auth.token) {
                config.headers.Authorization = auth.token;
                config.headers.From = auth.email;
//                console.log(auth.token);
            }
            return config;
        },
        responseError: function (response) {
            console.log('error intercepted: status = ' + response.status);

            if (response.status === 401 || response.status === 403) {
                // handle the case where the user is not authenticated
                if ($location.path() !== '/sign_in') { //TODO! [mezerny] consider more elegant implementation - now we need to check the location because consequent requests to server from previous view could be finished after redirect to 'sign_in', in that case we are loosing desired 'redirect' location (it is replaced with '/sign_in')
                     $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated, {redirect: $location.path()});
                }else{
                     var auth = Auth.get();
                     if (auth && auth.token) {
                         $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated, {redirect: redirect.path});
                     }
                }

            }

            return $q.reject(response);
        }
    };
}]);

dentalLinks.filter('filename', function () {
    return function (fullFileName) {
        return fullFileName.slice(fullFileName.lastIndexOf('/') + 1);
    }
});

dentalLinks.filter('phoneNumber', ['PhoneFormatter', function(PhoneFormatter) {
    return PhoneFormatter.format;
}]);
