var dentalLinksLogger = angular.module('dentalLinksLogger', []);

dentalLinks.service('Logger', function() {
    
    var loggingEnabled = true;
    
    this.log = function() {
        if (loggingEnabled) console.log.apply(console, arguments);
    };
    
    this.debug = function() {
        if (loggingEnabled) console.debug.apply(console, arguments);
    };
    
    this.info = function() {
        if (loggingEnabled) console.info.apply(console, arguments);
    };
    
    this.warn = function() {
        if (loggingEnabled) console.warn.apply(console, arguments);
    };
    
    this.error = function() {
        if (loggingEnabled) console.error.apply(console, arguments);
    };
    
});
