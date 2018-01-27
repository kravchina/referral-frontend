/**
 * Created by TopaZ on 14.10.2014.
 */
angular.module('dentalLinks')
    .controller('NotesController', ['$scope', 'Auth', '$modal', 'ModalHandler', 'Note', 'Notification', 'Activity',
    function ($scope,  Auth, $modal, ModalHandler, Note, Notification, Activity) {
        $scope.auth = Auth.get();
        if($scope.inputModel.$promise){
            $scope.inputModel.$promise.then(function(){
                Activity.patientsChanges({patient_id: $scope.inputModel.patient_id, start_date: $scope.inputModel.created_at},
                    function(data){
                        $scope.inputModel.notes = $scope.inputModel.notes.concat(data.activities);
                    });
            });
        }

        $scope.noteDialog = function () {
            var modalInstance = $modal.open({
                templateUrl: 'partials/note_form.html',
                controller: 'NoteModalController'
            });
            ModalHandler.set(modalInstance);
            modalInstance.result.then(function (message) {
                if($scope.showOfferToInviteGuest) {
                    $scope.showOfferToInviteGuest();
                }
                if($scope.immediateUpdate){
                    Note.save({note: {message: message, referral_id: $scope.inputModel.id, user_id: $scope.auth.id}}, function (success) {
                        $scope.inputModel.notes.push(success);
                    }, function (failure) {
                        Notification.error('Something went wrong, note was not saved.');
                    });
                } else {
                    if(typeof $scope.$parent.form !== 'undefined' && $scope.$parent.form !== null) {
                        $scope.$parent.form.$setDirty(); // for UnsavedChanges to notice notes being changed
                    }
                    var note = {
                        message: message,
                        created_at: Date.now(),
                        user_id: $scope.auth ? $scope.auth.id : '',
                        user: {
                            first_name: Auth.current_user ? Auth.current_user.first_name : '',
                            last_name: Auth.current_user ? Auth.current_user.last_name : ''
                        }
                    };
                    $scope.inputModel.notes = $scope.inputModel.notes || [];
                    $scope.inputModel.notes_attributes = $scope.inputModel.notes_attributes || [];
                    $scope.inputModel.notes.push(note);
                    $scope.inputModel.notes_attributes.push(note);
                }
            });
        };

        $scope.showHistory = function(note){
            var modalInstance = $modal.open({
                templateUrl: 'partials/note_versions.html',
                controller: 'NoteVersionsModalController',
                size: 'lg',
                resolve: {
                    versions : function(){
                        return note.versions;
                    }
                }
            });
        };
        
        $scope.hasUpdates = function (note) {
            return note.versions && note.versions.some(function (version) {
                return version.event === 'update'
            });
        };

        $scope.editNote = function(note, index){
            var modalInstance = $modal.open({
                templateUrl: 'partials/edit_note_form.html',
                controller: 'EditNoteModalController',
                resolve: {
                    noteData : function(){
                        return note;
                    }
                }
            });
            modalInstance.result.then(function (note) {
                if($scope.showOfferToInviteGuest) {
                    $scope.showOfferToInviteGuest();
                }
                if($scope.immediateUpdate){
                    Note.update({id: note.id}, {note: note}, function(success){
                        $scope.inputModel.notes[index] = success;
                    }, function(failure){
                        Notification.error('Something went wrong, note was not updated.');
                    });
                } else {
                    if(typeof $scope.$parent.form !== 'undefined' && $scope.$parent.form !== null) {
                        $scope.$parent.form.$setDirty();
                    }
                    $scope.inputModel.notes[index] = note;
                    $scope.inputModel.notes_attributes[index] = note;
                }
            });
        };
}]);
