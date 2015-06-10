/**
 * Created by TopaZ on 26.02.14.
 */
var dentalLinksServices = angular.module('dentalLinksServices', ['ngResource']);

dentalLinksServices.factory('Auth', ['$cookieStore', '$location', 'USER_ROLES', function ($cookieStore, $location, USER_ROLES) {
    return {
        authorize: function (roles) {
            if (roles === undefined) {
                return true;
            }
            var auth = $cookieStore.get('auth') || {};

            // if (auth.roles) {
            //     for (var i = 0; i < roles.length; i++) {
            //         if (auth.roles.indexOf(roles[i]) >= 0) {
            //             return true;
            //         }
            //     }
            // }

            if(auth.email){
                for(var i = 0; i < roles.length; i++){
                    if(roles[i] == USER_ROLES.admin){
                        if(auth.is_admin){
                           return true; 
                        }
                    }else if (auth.roles.indexOf(roles[i]) >= 0) {
                        return true;
                    }

                }
            }

            return false;
        },
        get: function () {
            return $cookieStore.get('auth');
        },
        getOrRedirect: function () {
            var result = $cookieStore.get('auth');
            if (result) {
                return result;
            }else{
                $location.path('/sign_in');
            }
        },
        set: function (value) {
            $cookieStore.put('auth', value);
        },
        remove: function () {
            $cookieStore.remove('auth');
        }
    };
}]);

dentalLinksServices.factory('Alert', ['$timeout', function ($timeout) {
    var push = function (alerts, type, message, disableAutoHide) {
        var alert = { type: type, message: message, promise: disableAutoHide ? undefined : $timeout(function () {
            alerts.splice(alerts.indexOf(alert), 1);
        }, 10000)};
        alerts.push(alert);
    };
    return {
        error: function (alerts, message, disableAutoHide) {
            push(alerts, 'danger', message, disableAutoHide);
        },
        warning: function (alerts, message, disableAutoHide) {
            push(alerts, 'warning', message, disableAutoHide);
        },
        info: function (alerts, message, disableAutoHide) {
            push(alerts, 'info', message, disableAutoHide);
        },
        success: function (alerts, message, disableAutoHide) {
            push(alerts, 'success', message, disableAutoHide);
        },
        close: function (alerts, index) {
            $timeout.cancel(alerts[index].promise); //cancel automatic removal
            alerts.splice(index, 1);
        }
    }
}]);

dentalLinksServices.factory('Practice', ['$resource', 'API_ENDPOINT',
    function ($resource, API_ENDPOINT) {
        return $resource(API_ENDPOINT + '/practices/:practiceId', {}, {
            searchPractice: {method: 'GET', url: API_ENDPOINT + '/practices/search', isArray: true, headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
            }, skipSpinner: true},
            cancelSubscription: {method: 'POST', url: API_ENDPOINT + '/practices/:practiceId/cancel_subscription'},
            update: {method: 'PUT'}
        });
    }]);


dentalLinksServices.factory('Patient', ['$resource', 'API_ENDPOINT', function ($resource, API_ENDPOINT) {
    return $resource(API_ENDPOINT + '/patients/:id', {}, {
        update: {method: 'PUT'},
        searchPatient: {method: 'GET', url: API_ENDPOINT + '/patients/search', isArray: true, headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
        }, skipSpinner: true}
    });
}]);

dentalLinksServices.factory('Referral', ['$resource', 'API_ENDPOINT', function ($resource, API_ENDPOINT) {
    return $resource(API_ENDPOINT + '/referrals/:id', {id: '@id'}, {
        saveTemplate: {method: 'POST', url: API_ENDPOINT + '/referrals/new/template'},
        update: {method: 'PUT'},
        updateStatus: {method: 'PUT', url: API_ENDPOINT + '/referrals/:id/status'},
        findByPractice: {method: 'GET', url: API_ENDPOINT + '/referrals/practice/:id', isArray: false}
    });
}]);

dentalLinksServices.factory('Login', ['$resource', 'API_ENDPOINT', function ($resource, API_ENDPOINT) {
    return $resource(API_ENDPOINT + '/sign_in', {}, {
        login: { method: 'POST', withCredentials: true},
        logout: {method: 'DELETE', url: API_ENDPOINT + '/sign_out', withCredentials: true}
    });
}]);

dentalLinksServices.factory('ProviderInvitation', ['$resource', 'API_ENDPOINT', function ($resource, API_ENDPOINT) {
    return $resource(API_ENDPOINT + '/invitations/:invitation_token', {}, {
        searchProviderInvitation: {method: 'GET', url: API_ENDPOINT + '/invitations/search', isArray: true, headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
        }, skipSpinner: true},
        validate: {method: 'GET',  url: API_ENDPOINT + '/invitations/validate'},
        resend: {method: 'GET', url: API_ENDPOINT + '/invitations/resend/:id'},
        delete: {method: 'DELETE', url: API_ENDPOINT + '/invitations/:id'},
        update: {method: 'PUT', url: API_ENDPOINT + '/invitations/:id'},
    });
}]);

dentalLinksServices.factory('Registration', ['$resource', 'API_ENDPOINT', function ($resource, API_ENDPOINT) {
    return $resource(API_ENDPOINT + '/sign_up', {}, {
        verify_security_code: {method: 'GET', url: API_ENDPOINT + '/verify_security_code/:code'},
        create_user: {method: 'POST', url: API_ENDPOINT + '/register_without_invite'}
    })
}]);

dentalLinksServices.factory('Password', ['$resource', 'API_ENDPOINT', function ($resource, API_ENDPOINT) {
    return $resource(API_ENDPOINT + '/password', {}, {
        reset: {method: 'POST'},
        change: {method: 'PUT'}
    })
}]);

dentalLinksServices.factory('S3Bucket', ['$resource', 'API_ENDPOINT', function ($resource, API_ENDPOINT) {
    return $resource(API_ENDPOINT + '/s3', {}, {
        getCredentials: {method: 'GET'}
    });
}]);

dentalLinksServices.factory('Note', ['$resource', 'API_ENDPOINT', function ($resource, API_ENDPOINT) {
    return $resource(API_ENDPOINT + '/notes');
}]);

dentalLinksServices.factory('Attachment', ['$resource', 'API_ENDPOINT', function ($resource, API_ENDPOINT) {
    return $resource(API_ENDPOINT + '/attachments/:id', {}, {
        update: { method: 'PUT'}
    });
}]);

dentalLinksServices.factory('Procedure', ['$resource', 'API_ENDPOINT', function ($resource, API_ENDPOINT) {
    return $resource(API_ENDPOINT + '/procedures', {}, {
        practiceTypes: {method: 'GET', url: API_ENDPOINT + '/practice_types', isArray: true}
    })
}]);

dentalLinksServices.factory('Address', ['$resource', 'API_ENDPOINT', function ($resource, API_ENDPOINT) {
    return $resource(API_ENDPOINT + '/addresses/:id');
}]);

dentalLinksServices.factory('User', ['$resource', 'API_ENDPOINT', function ($resource, API_ENDPOINT) {
    return $resource(API_ENDPOINT + '/users/:id', {}, {
        getInvitees: {method: 'GET', url: API_ENDPOINT + '/invitees/:user_id', isArray: true},
        getOtherProviders: {method: 'GET', url: API_ENDPOINT + '/other_providers', isArray: true},
        getProviders: {method: 'GET', url: API_ENDPOINT + '/providers', isArray: true},
        update: {method: 'PUT' },
        changePassword: {method: 'PUT', url: API_ENDPOINT + '/users/:id/change_password'}
    })
}]);

dentalLinksServices.factory('File', [function () {
    return {
        isImage: function (filename) {
            return filename.toLowerCase().search(/\.(jpg|jpeg|png|gif|bmp)$/) >= 0;
        }
    }
}]);

dentalLinksServices.factory('Spinner', [function () {
    /*
     This spinner implementation supports several asynchronous requests at the same time.
     It shows spinner until all requests are resolved. Every call to show() will add request to a pseudo-queue and will remove it from queue after hide() is called.
     Loading indicator is shown only when loading().numLoads > 0 (indicator is shown until last request is finished)
     */
    var loading = {numLoads: 0}; //need angular object to pass and return by reference
    return {
        show: function () {
            loading.numLoads++;
        },
        hide: function () {
            loading.numLoads--;
        },
        loading: function () {
            return loading;
        }
    }
}]);

dentalLinksServices.factory('ModalHandler', [function () {
    var modalInstance;
    return {
        dismissIfOpen: function () {
            if (modalInstance && modalInstance.dismiss) {
                modalInstance.dismiss('cancel');
            }
        },
        set: function (modal) {
            modalInstance = modal;
        },
        dismiss: function(modal){
            modal.dismiss('cancel');
        },
        close: function(modal, result){
            modal.close(result);
        }
    }
}]);

dentalLinksServices.factory('SecurityCode', ['$resource', 'API_ENDPOINT', function ($resource, API_ENDPOINT) {
    return $resource(API_ENDPOINT + '/security_code/:id', {}, {})
}]);

dentalLinksServices.factory('ServerSettings', ['$resource', 'API_ENDPOINT', function ($resource, API_ENDPOINT) {
    return $resource(API_ENDPOINT + 'settings', {}, {
        getStripeApiPublicKey: {method: 'GET', url: API_ENDPOINT + '/settings/stripe_public_key', headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
        }}
    })
}]);

dentalLinksServices.factory('Promo', ['$resource', 'API_ENDPOINT', function($resource, API_ENDPOINT){
    return $resource(API_ENDPOINT + '/promo/:code', {code: '@code'}, {
        validate: {
            method: 'GET',
            url: API_ENDPOINT + '/promo/validate/:code'
        }
    })
}]);