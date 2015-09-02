// TODO [ak] this is also a site object. Should be moved closer to page objects. Functions like openMenu(), signOut() and possibly even expectMenuShown() should be relocated here

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
