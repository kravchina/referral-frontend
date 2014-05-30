var modalsModule = angular.module('modals', ['ui.bootstrap']);

modalsModule.controller('PatientModalController', [ '$scope', '$modalInstance', 'Patient', function ($scope, $modalInstance, Patient) {

    /*$scope.patient = patient;*/

    $scope.salutations = ['Mr.', 'Ms.', 'Mrs.', 'Dr.', 'Engr.'];

    $scope.ok = function (patient) {
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
        $modalInstance.close(note);
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);

modalsModule.controller('ProviderModalController', ['$scope', '$modalInstance', 'Provider', 'Auth', function ($scope, $modalInstance, Provider, Auth) {
    $scope.result = {};
    $scope.ok = function (provider) {
        provider.inviter_id = Auth.get().id;
        Provider.save({user: provider}, function (success) {
            $modalInstance.close(success);
        }, function (failure) {
            $scope.result.failure = true;
        });
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);

modalsModule.controller('PracticeModalController', ['$scope', '$modalInstance', 'PracticeInvitation', function ($scope, $modalInstance, PracticeInvitation) {
    $scope.ok = function (practice_invite) {
        PracticeInvitation.save({practice: practice_invite},
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

modalsModule.controller('UserModalController', ['$scope', '$modalInstance', 'User', 'Auth', function ($scope, $modalInstance, User, Auth) {
    $scope.result = {};
    $scope.ok = function (user) {
        user.practice_id = Auth.get().practice_id;
        user.inviter_id = Auth.get().id;
        User.save({user: user}, function (success) {
            $modalInstance.close(success);
        }, function (failure) {
            $scope.result.failure = true;
        });
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);

