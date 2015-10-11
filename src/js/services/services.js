/**
 * Created by TopaZ on 26.02.14.
 */
angular.module('dentalLinksServices')

.factory('Auth', ['$cookies', '$location', 'USER_ROLES', 'Role', function ($cookies, $location, USER_ROLES, Role) {
    var auth;
    return {
        authorize: function (roles) {
            if (roles === undefined) {
                return true;
            } else if(Array.isArray(roles) && typeof(roles[0]) === 'string'){
                roles = Role.getRolesByNames(roles);
            }
            auth = $cookies.getObject('auth') || {};

            auth.roles = Role.getRolesByNames(auth.roles);

            if(auth.email){
                return Role.hasRoles(roles, auth.roles);
            }

            return false;
        },
        get: function () {
            return $cookies.getObject('auth');
        },
        getOrRedirect: function () {
            var result = $cookies.getObject('auth');
            if (result) {
                return result;
            }else{
                $location.path('/sign_in');
            }
        },
        set: function (value) {
            auth = value;
            $cookies.putObject('auth', value);
        },
        remove: function () {
            auth = {};
            $cookies.remove('auth');
        },
        hasRole: function(role){
            if(Array.isArray(role) && typeof(roles[0]) === 'string'){
                role = Role.getRolesByNames(role);
            }

            return Role.hasRoles([role], auth.roles);
        }
    };
}])

.factory('Alert', ['$timeout', function ($timeout) {
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
}])

.factory('Practice', ['$resource', 'API_ENDPOINT',
    function ($resource, API_ENDPOINT) {
        return $resource(API_ENDPOINT + '/practices/:practiceId', {}, {
            searchPractice: {method: 'GET', url: API_ENDPOINT + '/practices/search', isArray: true, headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
            }, skipSpinner: true},
            subscribe: {method: 'PUT', url: API_ENDPOINT + '/practices/:practiceId/subscribe'},
            cancelSubscription: {method: 'POST', url: API_ENDPOINT + '/practices/:practiceId/cancel_subscription'},
            update: {method: 'PUT'}
        });
    }])


.factory('Patient', ['$resource', 'API_ENDPOINT', function ($resource, API_ENDPOINT) {
    return $resource(API_ENDPOINT + '/patients/:id', {}, {
        update: {method: 'PUT'},
        searchPatient: {method: 'GET', url: API_ENDPOINT + '/patients/search', isArray: true, headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
        }, skipSpinner: true}
    });
}])

.factory('Referral', ['$resource', 'API_ENDPOINT', function ($resource, API_ENDPOINT) {
    return $resource(API_ENDPOINT + '/referrals/:id', {id: '@id'}, {
        saveTemplate: {method: 'POST', url: API_ENDPOINT + '/referrals/new/template'},
        update: {method: 'PUT'},
        updateStatus: {method: 'PUT', url: API_ENDPOINT + '/referrals/:id/status'},
        findByPractice: {method: 'GET', url: API_ENDPOINT + '/referrals/practice/:id', isArray: false},
        countByInvited: {method: 'GET', url: API_ENDPOINT + '/referrals/count/:id', isArray: false}
    });
}])

.factory('Login', ['$resource', 'API_ENDPOINT', function ($resource, API_ENDPOINT) {
    return $resource(API_ENDPOINT + '/sign_in', {}, {
        login: { method: 'POST', withCredentials: true},
        logout: {method: 'DELETE', url: API_ENDPOINT + '/sign_out', withCredentials: true}
    });
}])

.factory('ProviderInvitation', ['$resource', 'API_ENDPOINT', function ($resource, API_ENDPOINT) {
    return $resource(API_ENDPOINT + '/invitations/:invitation_token', {}, {
        searchProviderInvitation: {method: 'GET', url: API_ENDPOINT + '/invitations/search', isArray: true, headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
        }, skipSpinner: true},
        validate: {method: 'GET',  url: API_ENDPOINT + '/invitations/validate', skipSpinner: true},
        resend: {method: 'GET', url: API_ENDPOINT + '/invitations/resend/:id'},
        delete: {method: 'DELETE', url: API_ENDPOINT + '/invitations/:id'},
        update: {method: 'PUT', url: API_ENDPOINT + '/invitations/:id'},
        saveUser: {method: 'POST', url: API_ENDPOINT + '/invitations/user'},
        saveProvider: {method: 'POST', url: API_ENDPOINT + '/invitations/provider'}
    });
}])

.factory('Registration', ['$resource', 'API_ENDPOINT', function ($resource, API_ENDPOINT) {
    return $resource(API_ENDPOINT + '/sign_up', {}, {
        verify_security_code: {method: 'GET', url: API_ENDPOINT + '/verify_security_code/:code'},
        create_user: {method: 'POST', url: API_ENDPOINT + '/register_without_invite'},
        create_no_login_user: {method: 'POST', url: API_ENDPOINT + '/register_no_login_user'},
        register_with_promo: {method: 'POST', url: API_ENDPOINT + '/register_with_promo'}
    })
}])

.factory('Password', ['$resource', 'API_ENDPOINT', function ($resource, API_ENDPOINT) {
    return $resource(API_ENDPOINT + '/password', {}, {
        reset: {method: 'POST'},
        change: {method: 'PUT'}
    })
}])

.factory('S3Bucket', ['$resource', 'API_ENDPOINT', function ($resource, API_ENDPOINT) {
    return $resource(API_ENDPOINT + '/s3', {}, {
        getCredentials: {method: 'GET'}
    });
}])

.factory('Note', ['$resource', 'API_ENDPOINT', function ($resource, API_ENDPOINT) {
    return $resource(API_ENDPOINT + '/notes');
}])

.factory('Attachment', ['$resource', 'API_ENDPOINT', function ($resource, API_ENDPOINT) {
    return $resource(API_ENDPOINT + '/attachments/:id', {}, {
        update: { method: 'PUT'}
    });
}])

.factory('Procedure', ['$resource', 'API_ENDPOINT', function ($resource, API_ENDPOINT) {
    return $resource(API_ENDPOINT + '/procedures', {}, {
        practiceTypes: {method: 'GET', url: API_ENDPOINT + '/practice_types', isArray: true}
    })
}])

.factory('Address', ['$resource', 'API_ENDPOINT', function ($resource, API_ENDPOINT) {
    return $resource(API_ENDPOINT + '/addresses/:id');
}])

.factory('User', ['$resource', 'API_ENDPOINT', function ($resource, API_ENDPOINT) {
    return $resource(API_ENDPOINT + '/users/:id', {}, {
        getInvitees: {method: 'GET', url: API_ENDPOINT + '/invitees/:user_id', isArray: true},
        getOtherProviders: {method: 'GET', url: API_ENDPOINT + '/other_providers', isArray: true},
        getProviders: {method: 'GET', url: API_ENDPOINT + '/providers', isArray: true},
        update: {method: 'PUT' },
        changePassword: {method: 'PUT', url: API_ENDPOINT + '/users/:id/change_password'},
        sendPasswordInvitation: {method: 'PUT', url: API_ENDPOINT + '/users/:id/password'},
        savePassword: {method: 'POST', url: API_ENDPOINT + '/save_password'}
    })
}])

.factory('File', [function () {
    return {
        isImage: function (filename) {
            return filename.toLowerCase().search(/\.(jpg|jpeg|png|gif|bmp)$/) >= 0;
        }
    }
}])

.factory('Spinner', [function () {
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
}])

.factory('ModalHandler', [function () {
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
}])

.factory('SecurityCode', ['$resource', 'API_ENDPOINT', function ($resource, API_ENDPOINT) {
    return $resource(API_ENDPOINT + '/security_code/:id', {}, {})
}])

.factory('ServerSettings', ['$resource', 'API_ENDPOINT', function ($resource, API_ENDPOINT) {
    return $resource(API_ENDPOINT + 'settings', {}, {
        getStripeApiPublicKey: {method: 'GET', url: API_ENDPOINT + '/settings/stripe_public_key', headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
        }}
    })
}])

.factory('Promo', ['$resource', 'API_ENDPOINT', function($resource, API_ENDPOINT){
    return $resource(API_ENDPOINT + '/promo/:code', {code: '@code'}, {
        validate: {
            method: 'GET',
            url: API_ENDPOINT + '/promo/validate/:code'
        }
    })
}])

.factory('PracticeEditMode', [function(){
    var editBtn = {};
    var saveBtn = {};
    var addAddressBtn = {};
    var editFormCtrl = {};
    var formCtrl = {};
    return {
        init: function(editFormControl, formControl, editButton, addAddressButton, saveButton){
            editBtn = editButton;
            saveBtn = saveButton;
            addAddressBtn = addAddressButton;
            editFormCtrl = editFormControl;
            formCtrl = formControl;
        },
        on: function(){
            editBtn.addClass('hide');
            saveBtn.removeClass('hide');
            addAddressBtn.removeClass('hide');
            editFormCtrl.enableControls();

        },
        off: function(){
            if (formCtrl.$valid) {
                editBtn.removeClass('hide');
                saveBtn.addClass('hide');
                addAddressBtn.addClass('hide');
                editFormCtrl.disableControls();
            }
        }
    }
}])

.factory('Notification', ['$timeout', function ($timeout) {
    var notification = {message: undefined, type: undefined, promise: undefined};
    return {
        info: function(message) {
            notification.message = message;
            notification.type = 'info';
        },
        success: function(message) {
            notification.message = message;
            notification.type = 'success';
        },
        warning: function(message) {
            notification.message = message;
            notification.type = 'warning';
        },
        error: function(message) {
            notification.message = message;
            notification.type = 'error';
        },
        get: function() {
            return notification;
        },
        close: function() {
            notification.message = undefined;
        }

    }
}])
.factory('ProgressIndicator', function(){
    var progress = {show: false, value: 0};
    return {
        start: function(){
            progress.show = true;
        },
        set: function(value){
            progress.value = value;
        },
        finish: function(){
            progress.value = 0;
            progress.show = false;
        },
        get: function(){
            return progress;
        }
    }
})
.factory('Role', ['USER_ROLES', function(USER_ROLES){
    var ROLES = [];

    for(var prop in USER_ROLES){
        if(USER_ROLES.hasOwnProperty(prop)){
           ROLES.push(USER_ROLES[prop]);
        }
    }

    return {
        getFromMask: function(rolesMask){
            return ROLES.filter(function(role){
                return (rolesMask & role.mask) != 0;
            });
        },
        convertRolesToMask: function(inputArray){
            var mask = 0;

            inputArray
                .map(function(elem){
                    if(typeof(elem) === 'object') {
                        mask = mask | elem.mask;
                    } else if(typeof(elem) === 'string'){
                        mask = mask | ROLES.find(function(role){return role.id == elem;}).mask;
                    }
                });

            return mask;
        },
        getAllRoles: function(){
            return ROLES.filter(function(role){
                return role.id !== 'super' && role.id !== 'public';
            });
        },
        getRolesByNames: function(names){
            return names.map(function(name){
                return ROLES.find(function(role){
                    if(role.id === name){
                        return true;
                    }
                    return false;
                });
            });
        },
        hasRoles: function(requiredRoles, userRoles){
            var hasRole = false;

            requiredRoles.forEach(function(requiredRole){
                userRoles.forEach(function(userRole){
                    if(requiredRole.mask === userRole.mask){
                        hasRole = true;
                    }
                });
            });

            return hasRole;
        }
    };

}]);
