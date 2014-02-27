/**
 * Created by TopaZ on 26.02.14.
 */
var dentalLinksServices = angular.module('dentalLinksServices', ['ngResource']);

var host = 'http://referral-server.herokuapp.com';

dentalLinksServices.factory('Practice', ['$resource',
    function ($resource) {
        return $resource(host + '/practices/:practiceId', {}, {
            query: {method: 'GET', params: {}, isArray: true},
            save: {}
        });
    }]);

dentalLinksServices.factory('Patient', ['$resource', function ($resource) {
    return $resource(host + '/patients', {}, {
        query: {method: 'GET', params: {}, isArray: true},
        save: {}
    });
}]);

dentalLinksServices.factory('Referral', ['$resource', function ($resource) {
    return $resource(host + '/referrals', {});
}]);