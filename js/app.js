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
    'ui.mask',
    'localization',
    'error'
]);

dentalLinks.constant('USER_ROLES', {
    public: 'public',
    doctor: 'doctor',
    admin: 'admin',
    aux: 'aux'
});

dentalLinks.constant('FREE_TRIAL_PERIOD', 45);
dentalLinks.constant('API_ENDPOINT', 'https://referral-server.herokuapp.com');
dentalLinks.constant('AUTH_EVENTS', {
    notAuthenticated: 'auth-not-authenticated',
    paymentRequired: 'payment-required'
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
        state('promotion', {
            url: '/register/promo/:promo',
            templateUrl: 'partials/registration.html',
            controller: 'RegistrationController',
            onEnter: ['$state', '$stateParams', 'Promo', function($state, $stateParams, Promo) {
                Promo.validate({id: $stateParams.promo}).$promise
                    .then(function(){
                        // Promo code is valid, do nothing
                    }, function(response){
                        if(response.status === 404) {
                            $state.go('error_page', {error_key: 'promotion.not.found'});
                        }
                        if(response.status === 422) {
                            $state.go('error_page', {error_key: 'promotion.expired'});
                        }
                    });
            }]
        }).
        state('error_page', {
            url: '/error/:error_key',
            templateUrl: 'partials/error.html',
            controller: 'ErrorController'
        }).
        state('new_user', {
            url: '/new_user/:invitation_token',
            templateUrl: 'partials/new_user.html',
            controller: 'NewUserController'
        }).
        state('createReferral', {
            url: '/create_referral',
            templateUrl: 'partials/create_referral.html',
            controller: 'CreateReferralsController',
            access: [USER_ROLES.doctor, USER_ROLES.admin, USER_ROLES.aux]
        }).
        state('reviewReferral', {
            url: '/create_referral/:referral_id',
            params: {message: null},
            templateUrl: 'partials/create_referral.html',
            controller: 'ReviewReferralsController',
            resolve: {
                currentReferral: ['$q', '$stateParams', 'Referral', function ($q, $stateParams, Referral) {
                    var d = $q.defer();
                    Referral.get({id: $stateParams.referral_id}).$promise.then(function (referral) {
                        if ('draft' == referral.status) {
                            d.resolve(referral); //allow controller instantiation and passing currentReferral to controller as a parameter
                        } else {
                            d.reject('redirect_to_viewReferral'); //prevent controller instantiation and emit $stateChangeError event for redirecting to viewReferral state
                        }

                    });
                    return d.promise;
                }
                ],
            message: ['$stateParams', function($stateParams){
                return $stateParams.message;
            }]},
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
            templateUrl: 'partials/edit_password.html',
            controller: 'PasswordsController'
        }).
        state('viewReferral', {
            url: '/view_referral/:referral_id',
            params: {message: null, isNew: false},
            templateUrl: 'partials/view_referral.html',
            controller: 'ViewReferralsController',
            resolve: {
                message: ['$stateParams', function($stateParams){
                    return $stateParams.message;
                }]
            },
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
        }).
        state('license', {
            url: '/license',
            templateUrl: 'partials/license.html'
        });
    $urlRouterProvider.otherwise('/sign_in');
}])
    .run(['$rootScope', '$window', '$location', '$state', 'redirect', 'Auth', 'AUTH_EVENTS', 'UnsavedChanges', 'ModalHandler', '$modal', 'Logger', function ($rootScope, $window, $location, $state, redirect, Auth, AUTH_EVENTS, UnsavedChanges, ModalHandler, $modal, Logger) {

        $rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {
            ModalHandler.dismissIfOpen();  //close dialog if open.
            if (!Auth.authorize(toState.access)) {
                event.preventDefault();
                $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated, {redirect: $location.path()});
            }
        });

        $rootScope.$on(AUTH_EVENTS.notAuthenticated, function (event, args) {
            Logger.log('notAuthenticated');
            Auth.remove();
            redirect.path = args.redirect;
            $state.go('signIn', {}, {reload: true});
        });

        $rootScope.$on(AUTH_EVENTS.paymentRequired, function(event, args){
           Logger.log('paymentRequired');
            var modalInstance = $modal.open({
                templateUrl: 'partials/upgrade_required.html',
                backdrop: 'static'
            });
            ModalHandler.set(modalInstance);
            modalInstance.result.then(function () {
                $state.go('admin');
            });
        });

        $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
            if(error == 'redirect_to_viewReferral'){
                $state.go('viewReferral', toParams);
            }
        });
        UnsavedChanges.init();
    }]);

dentalLinks.value('redirect', {path: '/history'});

dentalLinks.config(['$locationProvider', function ($locationProvider) {
    /*$locationProvider.html5Mode(true);*/ //doesn't work without server-side url rewriting, to return on every request only the entrypoint page (like index.html)
}]);

dentalLinks.config(['$httpProvider', function ($httpProvider) {
    $httpProvider.defaults.useXDomain = true;
    $httpProvider.defaults.withCredentials = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
    $httpProvider.interceptors.push('authInterceptor');
    $httpProvider.interceptors.push('spinnerInterceptor');
}
]);

dentalLinks.factory('spinnerInterceptor', ['$q', 'Spinner', function ($q, Spinner) {
    return {
        request: function (config) {
            // do something on success
            if(!config.skipSpinner){
                Spinner.show();
            }
            return config;
        },

        requestError: function (rejection) {
            if(!rejection.config.skipSpinner){
                Spinner.hide();
            }
            return $q.reject(rejection);
        },

        response: function (response) {
            if(!response.config.skipSpinner){
                Spinner.hide();
            }
            return response;
        },

        responseError: function (rejection) {
            if(!rejection.config.skipSpinner){
                Spinner.hide();
            }
            return $q.reject(rejection);
        }
    };
}]);

dentalLinks.factory('authInterceptor', ['$rootScope', '$q', 'AUTH_EVENTS', '$location', 'redirect', 'Auth', 'Logger', function ($rootScope, $q, AUTH_EVENTS, $location, redirect, Auth, Logger) {
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
        responseError: function (response) {
            Logger.log('error intercepted: status = ' + response.status);

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

            }else if(response.status === 402){
                //don't allow to show referral in case of expired subscription
                $rootScope.$broadcast(AUTH_EVENTS.paymentRequired, {redirect: redirect.path})
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

dentalLinks.filter('attachmentDownloadUrl', ['API_ENDPOINT', function(API_ENDPOINT){
   return function(attachment){
       return API_ENDPOINT + '/attachment/?file=' + attachment.id + '/' + attachment.filename;
   }
}]);

dentalLinks.filter('authenticatableAttachmentDownloadUrl', ['API_ENDPOINT', '$window', 'Auth', function(API_ENDPOINT, $window, Auth){
    return function(attachment){
        var downloadUrl = API_ENDPOINT + '/attachment/?file=' + attachment.id + '/' + attachment.filename;
        if (/trident/i.test($window.navigator.userAgent)){ //TODO: workaround for https://www.pivotaltracker.com/story/show/86373800. Remove that filter to use cookies for image authentication.
            var auth = Auth.get();
            downloadUrl += '&token=' + auth.token + '&from=' + auth.email;
        }
        return  downloadUrl;
    }
}]);