var dentalLinksUnsavedChanges = angular.module('unsavedChanges', []);

dentalLinksUnsavedChanges.service('UnsavedChanges', ['$rootScope', 'Logger', function($rootScope, Logger) {
    var strUnsavedWarning = 'You have unsaved changes.';
    var strUnsavedQuestion = 'You have unsaved changes. Are you sure you want to leave?';
    
    var self = this;
    
    // contains a callback function that defines whether there are unsaved changes by returning true/false
    // users of UnsavedChanges can re-assign this callback using setCbHaveUnsavedChanges, thus modifying the logic
    var cbHaveUnsavedChanges;
    
    // resets the callback
    // users of UnsavedChanges should use this to bring the default behavior back (e.g. to make a redirect
    // without warning when having unsaved changes)
    this.resetCbHaveUnsavedChanges = function() {
        cbHaveUnsavedChanges = function() {
            return false; // no unsaved changes
        };
        Logger.debug('Callback reset.');
    };
    
    // immediately resetting the callback to define the default behavior
    this.resetCbHaveUnsavedChanges();
    
    this.setCbHaveUnsavedChanges = function(newCb) {
        Logger.debug('Setting callback to ', newCb);
        cbHaveUnsavedChanges = newCb;
    };
    
    this.canLeaveSafely = function() {
        Logger.log('canLeaveSafely()...');
        var result;
        if (cbHaveUnsavedChanges()) {
            result = confirm(strUnsavedQuestion);
        } else {
            result = true;
        }
        if (result) {
            self.resetCbHaveUnsavedChanges(); // new page -- new UnsavedChanges user. Resetting callback
        }
        Logger.log('canLeaveSafely(): ', result);
        return result;
    };
    
    this.init = function() {
        window.onbeforeunload = function() {
            if (cbHaveUnsavedChanges()) {
                Logger.log('Window close attempt with unsaved changes. Returning warning message');
                return strUnsavedWarning;
            }
        };
        Logger.log('Assigned window.onbeforeunload');
        $rootScope.$on('$stateChangeStart', function(e, newUrl) {
            Logger.log('Changing location to ' + newUrl.url + '...');
            if (!self.canLeaveSafely()) {
                Logger.log('Changing location to ' + newUrl.url + ': cancelled');
                e.preventDefault();
                return;
            }
            Logger.log('Changing location to ' + newUrl.url + ': allowed');
        });
    }
    
}]);
