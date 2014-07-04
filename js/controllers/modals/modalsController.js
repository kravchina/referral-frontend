var modalsModule = angular.module('modals', ['ui.bootstrap']);

modalsModule.controller('PatientModalController', [ '$scope', '$modalInstance', 'Auth', 'Patient', function ($scope, $modalInstance, Auth, Patient) {

    /*$scope.patient = patient;*/

    $scope.salutations = ['Mr.', 'Ms.', 'Mrs.', 'Dr.', 'Engr.'];

    $scope.ok = function (patient) {
        patient.practice_id = Auth.get().practice_id;
        Patient.save({patient: patient},
            function (success) {
                $modalInstance.close(success);
            },
            function (failure) {
                $scope.success = false;
                $scope.failure = true;
            });
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);

modalsModule.controller('NoteModalController', ['$scope', '$modalInstance', 'Note', function ($scope, $modalInstance, Note) {
    $scope.ok = function (note) {
        //nothing to do, we cant save note right here because at this stage referral doesn't exist. We can only add new note to the list on the parent page (create referral) and save simultaneously with referral.
        if (note == undefined){
            $modalInstance.dismiss('cancel');
        }else{
            $modalInstance.close(note);
        }
        
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

}]);

modalsModule.controller('ProviderModalController', ['$scope', '$modalInstance', 'ProviderInvitation', 'Alert', 'Auth', function ($scope, $modalInstance, ProviderInvitation, Alert, Auth) {
    $scope.alerts = [];
    $scope.ok = function (provider) {
        provider.inviter_id = Auth.get().id;
        ProviderInvitation.save({provider_invitation: provider}, function (success) {
            $modalInstance.close(success);
        }, function (failure) {
            Alert.error($scope.alerts, 'Error: ' + failure.data.message);
        });
    };
    $scope.closeAlert = function (index) {
        Alert.close($scope.alerts, index);
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);

modalsModule.controller('PracticeModalController', ['$scope', '$modalInstance', 'Alert', 'Practice', 'Procedure', function ($scope, $modalInstance, Alert, Practice, Procedure) {
    $scope.alerts = [];
    $scope.practiceTypes = Procedure.practiceTypes();
    $scope.ok = function (practice) {
        Practice.save({practice: practice},
            function (success) {
                $modalInstance.close(success);
            },
            function (failure) {
                Alert.error($scope.alerts, 'Can\'t create practice.');
            });
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);

modalsModule.controller('UserModalController', ['$scope', '$modalInstance', 'ProviderInvitation', 'Auth', function ($scope, $modalInstance, ProviderInvitation, Auth) {
    $scope.result = {};
    $scope.ok = function (user) {
        user.practice_id = Auth.get().practice_id;
        user.inviter_id = Auth.get().id;
        ProviderInvitation.save({provider_invitation: user}, function (success) {
            $modalInstance.close(success);
        },  function (failure) {
            Alert.error($scope.alerts, 'Error: ' + failure.data.message);
        });
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);

