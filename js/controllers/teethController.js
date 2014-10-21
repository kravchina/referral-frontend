dentalLinks.controller('TeethController', ['$scope', '$state', '$stateParams', '$timeout', 'Alert', 'Auth', 'Practice', 'Patient', 'Procedure', 'User', 'Referral', 'S3Bucket', 'Spinner', '$modal', '$fileUploader', 'UnsavedChanges', 'Logger', 'ModalHandler', 'File',
    function ($scope, $state, $stateParams, $timeout, Alert, Auth, Practice, Patient, Procedure, User, Referral, S3Bucket, Spinner, $modal, $fileUploader, UnsavedChanges, Logger, ModalHandler, File) {
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
