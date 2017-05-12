angular.module('dentalLinksDirectives')
    .directive('referralFindPractice', [function () {
        return {
            restrict: 'E',
            templateUrl: 'partials/directives/referral_find_practice.html',
            controller: 'FindPracticeController'
        }

    }]);