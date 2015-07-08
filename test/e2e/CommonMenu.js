var CommonMenu = function() {
    
    this.getTitleElement = function() {
        return element(by.css('ul.navbar-right span.ng-binding[ng-bind="title()"]'));
    };
    
    this.getFirstNameElement = function() {
        return element(by.css('ul.navbar-right span.ng-binding[ng-bind="first_name()"]'));
    };
    
    this.getLastNameElement = function() {
        return element(by.css('ul.navbar-right span.ng-binding[ng-bind="last_name()"]'));
    };
    
};

module.exports = new CommonMenu();
