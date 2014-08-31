var phoneFormatter = angular.module('phoneFormatter', []);

dentalLinks.service('PhoneFormatter', function() {
    
    this.MASK = '(999) 999-9999';
    this.UI_PLACEHOLDER = '(xxx) xxx-xxxx';
    
    this.format = function(str) {
        // empty/not only digits/non-NANP length => return as is
        if (!str || str.match(/[^\d]/) || str.length != 10) return str;
        
        return '(' + str.slice(0, 3) + ') ' + str.slice(3, 6) + '-' + str.slice(6);
    };
    
});
