angular.module('dentalLinks')
.controller('FindPatientController', ['$scope', 'Patient', '$uibModal', 'ModalHandler',
    function ($scope, Patient, $uibModal, ModalHandler) {
        $scope.findPatient = function (searchValue) {
            return Patient.searchPatient({practice_id: $scope.auth.practice_id, search: searchValue}).$promise;
        };

        $scope.patientDialog = function () {
            var modalInstance = $uibModal.open({
                templateUrl: 'partials/patient_form.html',
                controller: 'PatientModalController',
                resolve: {
                    fullname: function () {
                        return $scope.form.patient.$invalid ? $scope.form.patient.$viewValue : '';
                    }
                }
            });
            ModalHandler.set(modalInstance);
            modalInstance.result.then(function (patient) {
                $scope.patient = patient;
                $scope.form.patient.$setValidity('editable', true);
            });
        };

        $scope.editPatientDialog = function() {
            var modalInstance = $uibModal.open({
                templateUrl: 'partials/patient_form.html',
                controller: 'EditPatientModalController',
                resolve: {
                    patientForEdit: function(){
                        return $scope.patient;
                    }
                }
            });
            ModalHandler.set(modalInstance);
            modalInstance.result.then(function (patient) {
                $scope.patient = patient;
            });
        };
    }
]);
