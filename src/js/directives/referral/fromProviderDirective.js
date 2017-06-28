angular.module('dentalLinksDirectives')
    .directive('referralFromProvider', [function () {
        return {
            restrict: 'E',
            templateUrl: 'partials/directives/referral_from_provider.html',
            controller: 'FromProviderController'
        }

    }]);