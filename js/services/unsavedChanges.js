var dentalLinksUnsavedChanges = angular.module('dentalLinksUnsavedChanges', []);

dentalLinksUnsavedChanges.service('dentalLinksUnsavedChangesService', ['$rootScope', 'dlLogger', function($rootScope, dlLogger) {
    var strUnsavedWarning = 'You have unsaved changes.';
    var strUnsavedQuestion = 'You have unsaved changes. Are you sure you want to leave?';
    
    var self = this;
    
    var unsavedChanges = false;
    
    this.hasUnsavedChanges = function() {
        dlLogger.log('hasUnsavedChanges(): ' + unsavedChanges);
        return unsavedChanges;
    }
    
    this.setUnsavedChanges = function(newUnsavedChanges) {
        dlLogger.log('setUnsavedChanges(' + newUnsavedChanges + ')');
        unsavedChanges = newUnsavedChanges;
    }
    
    this.canLeaveSafely = function() {
        dlLogger.log('canLeaveSafely()...');
        if (this.hasUnsavedChanges()) {
            var discardChanges = confirm(strUnsavedQuestion);
            if (discardChanges) {
                this.setUnsavedChanges(false);
            }
            dlLogger.log('canLeaveSafely(): ' + discardChanges);
            return discardChanges;
        }
        dlLogger.log('canLeaveSafely(): true');
        return true;
    }
    
    this.init = function() {
        window.onbeforeunload = function() {
            if (self.hasUnsavedChanges()) {
                dlLogger.log('Window close attempt with unsaved changes. Returning warning message');
                return strUnsavedWarning;
            }
        }
        dlLogger.log('Assigned window.onbeforeunload');
        $rootScope.$on('$locationChangeStart', function(e, newUrl) {
            dlLogger.log('Changing location to ' + newUrl + '...');
            if (!self.canLeaveSafely()) {
                dlLogger.log('Changing location to ' + newUrl + ': cancelled');
                e.preventDefault();
                return;
            }
            dlLogger.log('Changing location to ' + newUrl + ': allowed');
        });
    }
    
}]);
