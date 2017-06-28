angular.module('dentalLinksDirectives')
    .directive('referralToProvider', [function () {
        return {
            restrict: 'E',
            templateUrl: 'partials/directives/referral_to_provider.html',
            controller: 'ToProviderController'
        }

    }]);