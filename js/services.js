/**
 * Created by TopaZ on 26.02.14.
 */
var dentalLinksServices = angular.module('dentalLinksServices', ['ngResource']);

//var host = 'http://localhost:3000';
var host = 'referral-server.herokuapp.com';

dentalLinksServices.factory('Practice', ['$resource',
    function ($resource) {
        return $resource(host + '/practices/:practiceId');
    }]);


dentalLinksServices.factory('PracticeInvitation', ['$resource',
    function ($resource) {
        return $resource(host + '/practice_invitations/:id');
    }]);

dentalLinksServices.factory('Patient', ['$resource', function ($resource) {
    return $resource(host + '/patients/:id');
}]);

dentalLinksServices.factory('Referral', ['$resource', function ($resource) {
    return $resource(host + '/referrals/:id', {id: '@id'}, {
        updateStatus: {method: 'PUT', url: host + '/referrals/:id/status'}
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