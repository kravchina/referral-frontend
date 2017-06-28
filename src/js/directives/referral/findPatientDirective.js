angular.module('dentalLinksDirectives')
.directive('referralFindPatient', [function () {
    return {
        restrict: 'E',
        templateUrl: 'partials/directives/referral_find_patient.html',
        controller: 'FindPatientController'
    }

}]);