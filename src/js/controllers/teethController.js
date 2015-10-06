angular.module('dentalLinks')
    .controller('TeethController', ['$scope',
    function ($scope) {
        $scope.teeth = $scope.teeth || [];
        $scope.toggleTooth = function (toothNumber) {
            $scope.form.$setDirty(); // for UnsavedChanges to notice teeth being changed
            var index = $scope.teeth.indexOf(toothNumber);
            if (index == -1) {
                $scope.teeth.push(toothNumber);
            } else {
                $scope.teeth.splice(index, 1);
            }
        };
    }
]);
