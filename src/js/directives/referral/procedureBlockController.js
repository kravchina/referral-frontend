angular.module('dentalLinks')
    .controller('ProcedureBlockController', ['$scope', 'Procedure',
        function ($scope, Procedure) {
            $scope.procedures = Procedure.query();
            $scope.practiceTypes = [];

            Procedure.practiceTypes(function(success){
                success.map(function(item){
                    if(item.code !== 'multi_specialty'){
                        $scope.practiceTypes.push(item);
                    }
                });
            });
        }
    ]);
