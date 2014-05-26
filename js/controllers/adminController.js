var adminModule = angular.module('admin', ['ui.bootstrap']);

adminModule.controller('AdminController', ['$scope', '$modal', function ($scope, $modal) {
    $scope.saveAccount = function(){
      console.log("This is a test for functions.");
    };

    $scope.savePractice = function(){
      console.log('Save function called');
    };


    $scope.usersDialog = function () {
        var modalInstance = $modal.open({
            templateUrl: 'partials/patient_form.html',
            controller: 'PatientModalController'
        });

        modalInstance.result.then(function (patient) {
            $scope.patient = patient;
        });
    };

    $scope.inviteDialog = function () {
        var modalInstance = $modal.open({
            templateUrl: 'partials/patient_form.html',
            controller: 'PatientModalController'
        });

        modalInstance.result.then(function (patient) {
            $scope.patient = patient;
        });
    };

}]);