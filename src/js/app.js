
angular.module('dentalLinks')

.constant('USER_ROLES', {
        admin: {id: 'admin', name: 'Admin', desc: 'Administrator', mask: 1},
        doctor: {id: 'doctor', name: 'Doctor', desc: 'Dental Services Provider', mask: 2},
        aux: {id: 'aux', name: 'Aux',desc: 'Auxiliary', mask: 4},
        super: {id: 'super', name: 'Super', desc: 'Super User', mask: 8},
        public: {id: 'public', name: 'Public', desc: 'Public Access', mask: 16}
})

.constant('FREE_TRIAL_PERIOD', 30)
.constant('HTTP_ERROR_EVENTS', {
    requestTimeout: 'http-request-timeout',
    serverError: 'http-server-error'
})
.constant('API_ENDPOINT', '{{API_ENDPOINT}}')
.constant('AUTH_EVENTS', {
    notAuthenticated: 'auth-not-authenticated',
    forbidden: 'forbidden',
    paymentRequired: 'payment-required'
})

.config(['$stateProvider', '$urlRouterProvider', 'USER_ROLES', '$provide', function ($stateProvider, $urlRouterProvider, USER_ROLES, $provide) {
    $stateProvider.
        state('signIn', {
            url: '/sign_in?pid',
            params: {alreadyRegister: false},
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
                if(!$stateParams.promo) {
                    return $state.go('error_page', {error_key: 'promotion.required'});
                }

                Promo.validate({code: $stateParams.promo}).$promise
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
        state('guest_conversion', {
            url: '/register/guest_conversion/:conversion_token',
            templateUrl: 'partials/registration.html',
            controller: 'RegistrationController'
        }).
        state('error_page', {
            url: '/error/:error_key',
            templateUrl: 'partials/error.html',
            controller: 'ErrorController'
        }).
        state('createGuestReferral', {
            url: '/create_guest_referral?pid',
            templateUrl: 'partials/create_guest_referral.html',
            controller: 'CreateGuestReferralsController',
        }).
        state('createReferral', {
            url: '/create_referral?pid',
            templateUrl: 'partials/create_referral.html',
            controller: 'CreateReferralsController',
            reloadOnSearch: false,
            access: [USER_ROLES.doctor, USER_ROLES.admin, USER_ROLES.aux]
        }).
        state('reviewReferral', {
            url: '/create_referral/:referral_id',
            params: {message: null},
            templateUrl: 'partials/create_referral.html',
            controller: 'ReviewReferralsController',
            resolve: {
                currentReferral: ['$q', '$stateParams', '$state', 'Referral', function ($q, $stateParams, $state, Referral) {
                    var d = $q.defer();
                    Referral.get({id: $stateParams.referral_id}).$promise.then(function (referral) {
                        if ('draft' == referral.status) {
                            d.resolve(referral); //allow controller instantiation and passing currentReferral to controller as a parameter
                        } else {
                            d.reject('redirect_to_viewReferral'); //prevent controller instantiation and emit $stateChangeError event for redirecting to viewReferral state
                        }

                    }).catch(function(error){
                        if(error.status === 422) {
                            $state.go('error_page', {error_key: error.data.message});
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
        state('addPassword', {
            url: '/add_password/:add_password_token',
            templateUrl: 'partials/add_password.html',
            controller: 'SavePasswordController'
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
            url: '/history?query&start&end&status',
            templateUrl: 'partials/history.html',
            controller: 'HistoryController',
            reloadOnSearch: false,
            access: [USER_ROLES.doctor, USER_ROLES.admin, USER_ROLES.aux]
        }).
        state('change_subscription', {
            url: '/subscription/change?fromRegistration',
            templateUrl: 'partials/change_subscription.html',
            controller: 'SubscriptionChangeController',
            params: {fromRegistration: 'false'},
            access: [USER_ROLES.doctor, USER_ROLES.admin, USER_ROLES.aux]
        }).
        state('admin', {
            url: '/admin',
            templateUrl: 'partials/admin.html',
            controller: 'AdminController',
            access: [USER_ROLES.doctor, USER_ROLES.admin, USER_ROLES.aux]
        }).
        state('admin.practice', {
            url: '/practice',
            templateUrl: 'partials/admin_practice.html',
            controller: 'AdminPracticeController',
            access: [USER_ROLES.doctor, USER_ROLES.admin, USER_ROLES.aux]
        }).
        state('admin.users', {
            url: '/users',
            templateUrl: 'partials/admin_users.html',
            controller: 'AdminUsersController',
            access: [USER_ROLES.doctor, USER_ROLES.admin, USER_ROLES.aux]
        }).
        state('admin.invite', {
            url: '/invite',
            templateUrl: 'partials/admin_invite.html',
            controller: 'AdminInviteController',
            access: [USER_ROLES.doctor, USER_ROLES.admin, USER_ROLES.aux]
        }).
        state('admin.subscription', {
            url: '/subscription',
            templateUrl: 'partials/admin_subscription.html',
            controller: 'AdminSubscriptionController',
            access: [USER_ROLES.doctor, USER_ROLES.admin, USER_ROLES.aux]
        }).
        state('admin.support', {
            url: '/support',
            templateUrl: 'partials/support.html',
            controller: 'SupportController'
        }).
        state('console', {
            abstract: true,
            url: '/console',
            templateUrl: 'partials/console.html',
            controller: 'ConsoleController'
        }).
        state('console.practice', {
            url: '/practice/:id',
            templateUrl: 'partials/console_practice.html',
            controller: 'PracticeConsoleController',
            access: [USER_ROLES.super]
        }).
        state('console.reports', {
            url: '/reports',
            templateUrl: 'partials/console_reports.html',
            controller: 'ReportsConsoleController',
            access: [USER_ROLES.super]
        }).
        state('console.utilities', {
            url: '/utilities',
            templateUrl: 'partials/console_utilities.html',
            controller: 'UtilitiesConsoleController',
            access: [USER_ROLES.super]
        }).
        state('console.plugin', {
            url: '/plugin',
            templateUrl: 'partials/console_plugin.html',
            controller: 'PluginConsoleController',
            access: [USER_ROLES.super]
        }).
        state('activity', {
            url: '/activity',
            templateUrl: 'partials/activity.html',
            controller: 'ActivityController'
        }).
        state('faq', {
            url: '/faq',
            templateUrl: 'partials/faq.html'
        }).
        state('license', {
            url: '/license',
            templateUrl: 'partials/license.html'
        }).
        state('confirmEmail', {
            url: '/confirm_email/:token',
            onEnter: ['$state', '$stateParams', 'Registration', 'Notification', '$uibModal', 'ModalHandler', function($state, $stateParams, Registration, Notification, $uibModal, ModalHandler) {
                Registration.confirmEmail({confirmation_token: $stateParams.token}).$promise
                    .then(function(){
                        // confirmation token is valid, show login page
                        var modalInstance = $uibModal.open({
                            templateUrl: 'partials/change_email_result.html',
                            controller: 'EmailChangeResultController'
                        });
                        ModalHandler.set(modalInstance);
                        modalInstance.result.then(function () {
                         $state.go('signIn');
                        });

                    }, function(response){
                        if(response.status === 404) {
                            $state.go('error_page', {error_key: 'confirmation_token.not.found'});
                        }
                        if(response.status === 422) {
                            $state.go('error_page', {error_key: 'confirmation_token.invalid'});
                        }
                    });
            }]

        }).
        state('unsubscribe', {
            url: '/unsubscribe?md_id',
            templateUrl: 'partials/unsubscribe.html',
            controller: 'UnsubscribeController'
        }).
        state('activateGuestReferral', {
            url: '/activate_guest_referral?activation_token',
            template: '',
            controller: 'ActivateGuestReferralController'
        }).
        state('guestReferralActivated', {
            url: '/guest_referral_activated',
            templateUrl: 'partials/guest_referral_activated.html'
        }).
        state('debug', {
            url: '/debug',
            templateUrl: 'partials/debug.html'
        });

    $urlRouterProvider.otherwise('/sign_in');

    $provide.decorator('$exceptionHandler', ['$delegate', '$injector', '$window', function($delegate, $injector, $window) {
        return function (exception, cause) {
            if($window.Rollbar) {
                $window.Rollbar.error(exception, {cause: cause}, function(err, data) {
                    var $rootScope = $injector.get('$rootScope');
                    $rootScope.$emit('rollbar:exception', {
                        exception: exception,
                        err: err,
                        data: data.result
                    });
                });
            }
            $delegate(exception, cause);
        };
    }]);
}])
    .run(['$rootScope', '$window', '$location', '$state', 'redirect', 'Auth', 'AUTH_EVENTS', 'UnsavedChanges', 'ModalHandler', '$uibModal', 'Logger', 'CustomBranding', 'BrandingSettings', function ($rootScope, $window, $location, $state, redirect, Auth, AUTH_EVENTS, UnsavedChanges, ModalHandler, $uibModal, Logger, CustomBranding, BrandingSettings) {

        if(CustomBranding.get()) {
            CustomBranding.apply(CustomBranding.get());
        }

        $rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {
            ModalHandler.dismissIfOpen();  //close dialog if open.
            if (!Auth.authorize(toState.access)) {
                event.preventDefault();
                $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated, {redirect: $location.url(), params: $location.search()});
            }
            if ($location.search().pid){
                BrandingSettings.get({pid: $location.search().pid}, function(branding){
                    if(branding.id){
                        CustomBranding.apply({pidBased: true, settings: branding.ui_data });
                    }
                })
            }
        });

        $rootScope.$on('$stateChangeSuccess',function(event){
                if (!$window.ga)
                    return;

                $window.ga('send', 'pageview', { page: $location.path() });
            });

        $rootScope.$on(AUTH_EVENTS.notAuthenticated, function (event, args) {
            Logger.log('notAuthenticated');
            Auth.remove();
            redirect.path = args.redirect;
            $state.go('signIn', args.params, {reload: true});
        });

        $rootScope.$on(AUTH_EVENTS.paymentRequired, function(event, args){
            Logger.log('paymentRequired');
            $state.go('error_page', {error_key: 'payment.required'});
        });
        $rootScope.$on(AUTH_EVENTS.forbidden, function(event, args){
            Logger.log('forbidden');
            $state.go('error_page', {error_key: 'access.denied'});
        });
        $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
            if(error == 'redirect_to_viewReferral'){
                $state.go('viewReferral', toParams);
            }
        });
        UnsavedChanges.init();
    }])

.value('redirect', {path: '/history'})

.config(['$locationProvider', function ($locationProvider) {
    /*$locationProvider.html5Mode(true);*/ //doesn't work without server-side url rewriting, to return on every request only the entrypoint page (like index.html)
}])

.config(['$httpProvider', function ($httpProvider) {
    $httpProvider.defaults.useXDomain = true;
    $httpProvider.defaults.withCredentials = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
    $httpProvider.interceptors.push('authInterceptor');
    $httpProvider.interceptors.push('spinnerInterceptor');
    $httpProvider.interceptors.push('errorsHttpInterceptor');
    $httpProvider.interceptors.push('requestNotificationInterceptor');
}
])

.factory('spinnerInterceptor', ['$q', 'Spinner', function ($q, Spinner) {
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
}])

.factory('authInterceptor', ['$rootScope', '$q', 'AUTH_EVENTS', '$location', 'redirect', 'Auth', 'Logger', function ($rootScope, $q, AUTH_EVENTS, $location, redirect, Auth, Logger) {
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
                var path = $location.path();
                var requiresLogin = !path.startsWith('/sign_in')
                    && !path.startsWith('/register')
                    && !path.startsWith('/edit_password')
                    && !path.startsWith('/unsubscribe')
                    && !path.startsWith('/confirm_email');
                if (requiresLogin) { //TODO! [mezerny] consider more elegant implementation - now we need to check the location because consequent requests to server from previous view could be finished after redirect to 'sign_in', in that case we are loosing desired 'redirect' location (it is replaced with '/sign_in')
                    $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated, {redirect: $location.url()});
                } else {
                    Auth.remove();
                }
            } else if (response.status === 402) {
                //don't allow to show referral in case of expired subscription
                $rootScope.$broadcast(AUTH_EVENTS.paymentRequired, {redirect: redirect.path})
            } else if (response.status === 409){
                //don't allow to show referral for a user that doesn't have appropriate permission (his practice is neither origin nor destination for that referral)
                $rootScope.$broadcast(AUTH_EVENTS.forbidden, {redirect: redirect.path})
            }

            return $q.reject(response);
        }
    };
}])

.factory('errorsHttpInterceptor', ['$rootScope', '$q', '$injector', 'HTTP_ERROR_EVENTS', function($rootScope, $q, $injector, HTTP_ERROR_EVENTS){
    return {
        requestError: function(rejection){
            $rootScope.$broadcast(HTTP_ERROR_EVENTS.requestError, {status: rejection.status, text: rejection.statusText});

            Rollbar.error(
                "NetworkError: Failed request: " + rejection.config.url + "\n" +
                "method: " + rejection.config.method + "\n" +
                "status: " + rejection.status + "\n" +
                "statusText: " + rejection.statusText + "\n");

            return $q.reject(rejection);
        },
        responseError: function(rejection){
            if(rejection.status == 0) {
                $rootScope.$broadcast(HTTP_ERROR_EVENTS.requestTimeout,
                    {status: rejection.status, text: 'http.request.timeout'});
            } else if(rejection.status == 408) {
                $rootScope.$broadcast(HTTP_ERROR_EVENTS.requestTimeout,
                    {status: rejection.status, text: rejection.statusText});
            } else if(rejection.status >= 503 && rejection.status < 504){
                $rootScope.$broadcast(HTTP_ERROR_EVENTS.serverError,
                    {status: rejection.status, text: rejection.statusText});
            }

            if(!(rejection.status == 401 || rejection.status == 422) && (rejection.status < 300 || rejection.status > 399)){
                Rollbar.error(
                    "NetworkError: Failed response: " + rejection.config.url + "\n" +
                    "method: " + rejection.config.method + "\n" +
                    "status: " + rejection.status + "\n" +
                    "statusText: " + rejection.statusText + "\n");
            }

            return $q.reject(rejection);
        }
    };
}])
    .factory('requestNotificationInterceptor', ['$rootScope', '$q', 'Notification', function ($rootScope, $q, Notification) {
        return {
            request: function (config) {
                Notification.close();
                return config;
            },

            requestError: function (rejection) {
                Notification.close();
                return $q.reject(rejection);
            }
        };
    }])

.filter('filterUsersByAddress', function(){
    return function(inputArray, addressId){
        if(!inputArray) {
            return false;
        }
        return inputArray.filter(function(item){
            if(item.id == -1) {
                return true;
            }
            for(var i = 0; i < item.addresses.length; i++) {
                if(item.addresses[i].id === addressId) {
                    return true;
                }
            }
            return false;
        });
    };
})

.filter('filename', function () {
    return function (fullFileName) {
        return fullFileName.slice(fullFileName.lastIndexOf('/') + 1);
    }
})

.filter('money', function () {
    return function (centsAmount) {
        return centsAmount / 100;
    }
})

.filter('viewAttachmentUrl', ['API_ENDPOINT', function(API_ENDPOINT){
   return function(attachment){
       return API_ENDPOINT + '/attachment/?file=' + attachment.id + '/' + attachment.attach_file_name;
   }
}])

.filter('viewAuthenticatableAttachmentUrl', ['API_ENDPOINT', '$window', 'Auth', function(API_ENDPOINT, $window, Auth){
    return function(attachment){
        var downloadUrl = API_ENDPOINT + '/attachment/?file=' + attachment.id + '/' + attachment.attach_file_name;
        if (/trident/i.test($window.navigator.userAgent)){ //TODO: workaround for https://www.pivotaltracker.com/story/show/86373800. Remove that filter to use cookies for image authentication.
            var auth = Auth.get();
            downloadUrl += '&token=' + auth.token + '&from=' + auth.email;
        }
        return  downloadUrl;
    }
}])

.filter('attachmentDownloadUrl', ['API_ENDPOINT', '$window', 'Auth', function(API_ENDPOINT, $window, Auth){
    return function(attachment){
        var downloadUrl = API_ENDPOINT + '/attachment/?file=' + attachment.id + '/' + attachment.attach_file_name + "&download=true";
        if (/trident/i.test($window.navigator.userAgent)){ //TODO: workaround for https://www.pivotaltracker.com/story/show/86373800. Remove that filter to use cookies for image authentication.
            var auth = Auth.get();
            downloadUrl += '&token=' + auth.token + '&from=' + auth.email;
        }
        return  downloadUrl;
    }
}]);

