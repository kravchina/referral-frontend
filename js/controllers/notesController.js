/**
 * Created by TopaZ on 14.10.2014.
 */
dentalLinks.controller('NotesController', ['$scope', 'Auth', '$modal', 'ModalHandler',
    function ($scope,  Auth, $modal, ModalHandler) {
        $scope.noteDialog = function () {
            var modalInstance = $modal.open({
                templateUrl: 'partials/note_form.html',
                controller: 'NoteModalController'
            });
            ModalHandler.set(modalInstance);
            modalInstance.result.then(function (message) {
                $scope.form.$setDirty(); // for UnsavedChanges to notice notes being changed
                var note = {message: message, created_at: Date.now(), user_id: Auth.get().id, user: {first_name: Auth.current_user.first_name, last_name: Auth.current_user.last_name}};
                $scope.model.referral.notes = $scope.model.referral.notes || [];
                $scope.model.referral.notes_attributes = $scope.model.referral.notes_attributes || [];
                $scope.model.referral.notes.push(note);
                $scope.model.referral.notes_attributes.push(note);
            });
        };
}]);
