/**
 * Created by TopaZ on 26.02.14.
 */
var dentalLinksServices = angular.module('dentalLinksServices', ['ngResource']);

//var host = 'http://localhost:3000';
var host = 'http://referral-server.herokuapp.com';

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
                return result;l
            }else{
                $location.path('/sign_in');
            }d
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
    var push = function (alerts, type, message) {
        var alert = { type: type, message: message, promise: $timeout(function () {
            alerts.splice(alerts.indexOf(alert), 1);
        }, 5000) };
        alerts.push(alert);
    };
    return {
        error: function (alerts, message) {
            push(alerts, 'danger', message);
        },
        warning: function (alerts, message) {
            push(alerts, 'warning', message);
        },
        info: function (alerts, message) {
            push(alerts, 'info', message);
        },
        success: function (alerts, message) {
            push(alerts, 'success', message);
        },
        close: function (alerts, index) {
            $timeout.cancel(alerts[index].promise); //cancel automatic removal
            alerts.splice(index, 1);
        }
    }
}]);

dentalLinksServices.factory('Practice', ['$resource',
    function ($resource) {
        return $resource(host + '/practices/:practiceId', {}, {
            searchPractice: {method: 'GET', url: host + '/practices/search', isArray: true, headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
            }},
            update: {method: 'PUT'}
        });
    }]);


dentalLinksServices.factory('PracticeInvitation', ['$resource',
    function ($resource) {
        return $resource(host + '/practice_invitations/:id');
    }]);

dentalLinksServices.factory('Patient', ['$resource', function ($resource) {
    return $resource(host + '/patients/:id', {}, {
        searchPatient: {method: 'GET', url: host + '/patients/search', isArray: true, headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
        }}
    });
}]);

dentalLinksServices.factory('Referral', ['$resource', function ($resource) {
    return $resource(host + '/referrals/:id', {id: '@id'}, {
        saveTemplate: {method: 'POST', url: host + '/referrals/new/template'},
        update: {method: 'PUT'},
        updateStatus: {method: 'PUT', url: host + '/referrals/:id/status'},
        findByPractice: {method: 'GET', url: host + '/referrals/practice/:id', isArray: false}
    });
}]);

dentalLinksServices.factory('Login', ['$resource', function ($resource) {
    return $resource(host + '/sign_in', {}, {
        login: { method: 'POST'},
        logout: {method: 'DELETE', url: host + '/sign_out'}
    });
}]);
dentalLinksServices.factory('ProviderInvitation', ['$resource', function ($resource) {
    return $resource(host + '/invitations/:invitation_token', {}, {
        delete: {method: 'DELETE', url: host + '/invitations/:id'}
    });
}]);

dentalLinksServices.factory('Registration', ['$resource', function ($resource) {
    return $resource(host + '/sign_up')
}]);

dentalLinksServices.factory('Password', ['$resource', function ($resource) {
    return $resource(host + '/password', {}, {
        reset: {method: 'POST'},
        change: {method: 'PUT'}
    })
}]);

dentalLinksServices.factory('S3Bucket', ['$resource', function ($resource) {
    return $resource(host + '/s3', {}, {
        getCredentials: {method: 'GET'}
    });
}]);

dentalLinksServices.factory('Note', ['$resource', function ($resource) {
    return $resource(host + '/notes');
}]);

dentalLinksServices.factory('Attachment', ['$resource', function ($resource) {
    return $resource(host + '/attachments');
}]);

dentalLinksServices.factory('Procedure', ['$resource', function ($resource) {
    return $resource(host + '/procedures', {}, {
        practiceTypes: {method: 'GET', url: host + '/practice_types', isArray: true}
    })
}]);

dentalLinksServices.factory('User', ['$resource', function ($resource) {
    return $resource(host + '/users/:id', {}, {
        getInvitees: {method: 'GET', url: host + '/invitees/:user_id', isArray: true},
        update: {method: 'PUT' },
        changePassword: {method: 'PUT', url: host + '/users/:id/change_password'}
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
    var modalInstance = {};
    return {
        close: function () {
            if (modalInstance && modalInstance.dismiss) {
                modalInstance.dismiss('cancel');
            }
        },
        set: function (modal) {
            modalInstance = modal;
        }
    }
}]);
