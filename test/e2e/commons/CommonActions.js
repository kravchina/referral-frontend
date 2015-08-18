var CommonActions = function() {
    
    this.openMenu = function() {
        element(by.css('ul.nav.navbar-nav.navbar-right a.dropdown-toggle')).click();
    };
    
    this.signOut = function() {
        this.openMenu();
        element(by.css('a[ng-click="logout()"]')).click();
    };
    
    this.clickLogo = function() {
        element(by.css('a.navbar-brand')).click();
    };

    // TODO [ak] after #84550008 is fixed, run the same tests on narrow screen as well
    this.maximizeBrowser = function() {
        browser.driver.manage().window().maximize();
    };
    
};

module.exports = new CommonActions();
