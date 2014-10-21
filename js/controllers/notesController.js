/**
 * Created by TopaZ on 14.10.2014.
 */
dentalLinks.controller('NotesController', ['$scope', '$state', '$stateParams', '$timeout', 'Alert', 'Auth', 'Practice', 'Patient', 'Procedure', 'User', 'Referral', 'S3Bucket', 'Spinner', '$modal', '$fileUploader', 'UnsavedChanges', 'Logger', 'ModalHandler', 'File',
    function ($scope, $state, $stateParams, $timeout, Alert, Auth, Practice, Patient, Procedure, User, Referral, S3Bucket, Spinner, $modal, $fileUploader, UnsavedChanges, Logger, ModalHandler, File) {
        $scope.noteDialog = function () {
            var modalInstance = $modal.open({
                templateUrl: 'partials/note_form.html',
                controller: 'NoteModalController'
            });
            ModalHandler.set(modalInstance);
            modalInstance.result.then(function (note) {
                $scope.form.$setDirty(); // for UnsavedChanges to notice notes being changed
                var note = {message: note, created_at: Date.now(), user_id: Auth.get().id, user_first_name: Auth.current_user.first_name, user_last_name: Auth.current_user.last_name};
                $scope.model.referral.notes.push(note);
                $scope.model.referral.notes_attributes.push(note);
            });
        };
}]);
