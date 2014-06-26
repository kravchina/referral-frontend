var dentalLinksUnsavedChanges = angular.module('unsavedChanges', []);

dentalLinksUnsavedChanges.service('UnsavedChanges', ['$rootScope', 'Logger', function($rootScope, Logger) {
    var strUnsavedWarning = 'You have unsaved changes.';
    var strUnsavedQuestion = 'You have unsaved changes. Are you sure you want to leave?';
    
    var self = this;
    
    var unsavedChanges = false;
    
    this.hasUnsavedChanges = function() {
        Logger.log('hasUnsavedChanges(): ' + unsavedChanges);
        return unsavedChanges;
    }
    
    this.setUnsavedChanges = function(newUnsavedChanges) {
        Logger.log('setUnsavedChanges(' + newUnsavedChanges + ')');
        unsavedChanges = newUnsavedChanges;
    }
    
    this.canLeaveSafely = function() {
        Logger.log('canLeaveSafely()...');
        if (this.hasUnsavedChanges()) {
            var discardChanges = confirm(strUnsavedQuestion);
            if (discardChanges) {
                this.setUnsavedChanges(false);
            }
            Logger.log('canLeaveSafely(): ' + discardChanges);
            return discardChanges;
        }
        Logger.log('canLeaveSafely(): true');
        return true;
    }
    
    this.init = function() {
        window.onbeforeunload = function() {
            if (self.hasUnsavedChanges()) {
                Logger.log('Window close attempt with unsaved changes. Returning warning message');
                return strUnsavedWarning;
            }
        }
        Logger.log('Assigned window.onbeforeunload');
        $rootScope.$on('$locationChangeStart', function(e, newUrl) {
            Logger.log('Changing location to ' + newUrl + '...');
            if (!self.canLeaveSafely()) {
                Logger.log('Changing location to ' + newUrl + ': cancelled');
                e.preventDefault();
                return;
            }
            Logger.log('Changing location to ' + newUrl + ': allowed');
        });
    }
    
}]);
