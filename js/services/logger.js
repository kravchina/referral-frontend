var dentalLinksLogger = angular.module('dentalLinksLogger', []);

dentalLinksUnsavedChanges.service('dlLogger', function() {
    
    var loggingEnabled = true;
    
    this.log = function(s) {
        if (loggingEnabled) console.log(s);
    };
    
    this.debug = function(s) {
        if (loggingEnabled) console.debug(s);
    };
    
    this.info = function(s) {
        if (loggingEnabled) console.info(s);
    };
    
    this.warn = function(s) {
        if (loggingEnabled) console.warn(s);
    };
    
    this.error = function(s) {
        if (loggingEnabled) console.error(s);
    };
    
});
