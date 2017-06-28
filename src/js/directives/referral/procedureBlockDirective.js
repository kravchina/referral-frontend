angular.module('dentalLinksDirectives')
    .directive('referralProcedureBlock', [function () {
        return {
            restrict: 'E',
            templateUrl: 'partials/directives/referral_procedure_block.html',
            controller: 'ProcedureBlockController'
        }

    }]);