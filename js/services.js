/**
 * Created by TopaZ on 26.02.14.
 */
var dentalLinksServices = angular.module('dentalLinksServices', ['ngResource']);

var host = 'http://referral-server.herokuapp.com';

dentalLinksServices.factory('Practice', ['$resource',
    function ($resource) {
        return $resource(host + '/practices/:practiceId');
    }]);


dentalLinksServices.factory('PracticeInvitation', ['$resource',
    function ($resource) {
        return $resource(host + '/practice_invitations/:id');
    }]);

dentalLinksServices.factory('Patient', ['$resource', function ($resource) {
    return $resource(host + '/patients');
}]);

dentalLinksServices.factory('Referral', ['$resource', function ($resource) {
    return $resource(host + '/referrals/:id', {id: '@id'}, {
        acceptReferral: {method: 'PUT',  data:{status:'accepted'}},
        rejectReferral: {method: 'PUT', data: {status: 'rejected'}},
        completeReferral: {method: 'PUT', data:  {status: 'completed'}}
    });
}]);

dentalLinksServices.factory('Login', ['$resource', function ($resource) {
    return $resource(host + '/sign_in', {}, {
        login: { method: 'POST'},
        logout: {method: 'DELETE', url: host + '/sign_out'}
    });
}]);

dentalLinksServices.factory('Password', ['$resource', function ($resource) {
    return $resource(host + '/password', {}, {
        reset: {method: 'POST'},
        change: {method: 'PUT'}
    })
}]);