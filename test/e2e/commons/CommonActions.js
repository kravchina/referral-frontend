var CommonActions = function() {
    
    this.openMenu = function() {
        element(by.css('ul.nav.navbar-nav.navbar-right a.dropdown-toggle')).click();
    };
    
    this.signOut = function() {
        this.openMenu();
        element(by.css('a[ng-click="logout()"]')).click();
    };
    
    this.clickLogo = function() {
        var logoElement = element(by.css('a.navbar-brand'));
        
        // sometimes logo gets overlapped by the error or success notification
        // in this case, simple logoElement.click() may not work, clicking the notification div
        // let's click the top left corner of the logo, which shouldn't get overlapped
        browser.actions().mouseMove(logoElement, {x: 1, y: 1}).click().perform();
    };

    // TODO [ak] after #84550008 is fixed, run the same tests on narrow screen as well
    this.maximizeBrowser = function() {
        browser.driver.manage().window().maximize();
    };

    this.scrollIntoView = function(el) {
        browser.executeScript(function(el) {
            el.scrollIntoView(false);
        }, el.getWebElement());
    };
    
};

module.exports = new CommonActions();
