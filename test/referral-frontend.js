var expectNavigationHappened = function(pageUrlPart) {
    expect(browser.getCurrentUrl()).toContain(pageUrlPart); // navigation happened
    expect(element(by.css('div#resultLoading.ng-hide')).isPresent()).toBe(true); // loading div is hidden
};

var expectLoggedIn = function() {
    expect(element(by.css('ul.nav.navbar-nav.navbar-right')).isPresent()).toBe(true); // top-right menu is shown
};

var expectLoggedOut = function() {
    expect(element(by.css('ul.nav.navbar-nav.navbar-right.ng-hide')).isPresent()).toBe(true); // account menu has .ng-hide, i.e. user is logged out
    expect(element(by.buttonText('Login')).isPresent()).toBe(true);
};

var clickLogo = function() {
    element(by.css('a.navbar-brand')).click();
};

var openMenu = function() {
    element(by.css('ul.nav.navbar-nav.navbar-right a.dropdown-toggle')).click();
};

describe('when user logs in', function() {
    
    browser.get('/#/sign_in');
    browser.driver.manage().window().maximize(); // TODO [ak] convert into two sets of tests when #84550008 is fixed -- wide-width and narrow-width
    
    beforeEach(function() {
        // not performing explicit sign_in navigation. We should already be there, either after first opening or after a logout
        
        expectNavigationHappened('/sign_in');
        expectLoggedOut();
        
        // log in
        element(by.model('user.email')).sendKeys(browser.params.login.user);
        element(by.model('user.password')).sendKeys(browser.params.login.pass);
        element(by.buttonText('Login')).click();
        
        // check correct login redirect
        expectNavigationHappened('/history');
        expectLoggedIn();
    });
    
    describe('when user navigates to Admin', function() {
        beforeEach(function() {
            openMenu();
            element(by.linkText('Account Settings')).click();
            expectNavigationHappened('/admin');
        });
        
        it('shows Admin page', function() {
            expect(element(by.model('practice.account_first_name')).isPresent()).toBe(true); // find better (=more) criteria of recognizing Admin page
        });
        
    });
        
    describe('when user navigates to Create Referral', function() {
        
        beforeEach(function() {
            element(by.css('header.page-header div.input-block-right a.btn.btn-orange.btn-lg')).click();
            expectNavigationHappened('/create_referral');
        });
        
        it('shows Create Referral page', function() {
            expect(element(by.model('patient')).isPresent()).toBe(true); // find better (=more) criteria of recognizing Create Referral page
        });
            
        it('allows immediate navigation away', function() {
            clickLogo();
            expectNavigationHappened('/history');
        });
        
        describe('when user changes data and tries to leave', function() {
            var dataStr = 'asdf';
            
            beforeEach(function() {
                element(by.model('patient')).sendKeys(dataStr);
                expect(element(by.model('patient')).getAttribute('value')).toEqual(dataStr);
                
                clickLogo();
            });
            
            var alertDialog;
            
            it('allows navigation away through the unsaved changes alert', function() {
                alertDialog = browser.switchTo().alert();
                expect(alertDialog.getText()).toContain('unsaved');
                expect(alertDialog.accept).toBeDefined();
                alertDialog.accept();
                expectNavigationHappened('/history');
            });
            
            describe('when user dismisses the alert', function() {
                beforeEach(function() {
                    alertDialog = browser.switchTo().alert();
                    expect(alertDialog.getText()).toContain('unsaved');
                    expect(alertDialog.dismiss).toBeDefined();
                    alertDialog.dismiss();
                });
                
                it('stays on the Create Referral page with data kept', function() {
                    expect(browser.getCurrentUrl()).toContain('/create_referral');
                    expect(element(by.model('patient')).getAttribute('value')).toEqual(dataStr);
                
                });                
                
                afterEach(function() {
                    // manually getting out of the page and accepting the alert to allow log out and other flows
                    clickLogo();
                    alertDialog = browser.switchTo().alert();
                    alertDialog.accept();
                    expectNavigationHappened('/history');
                });
            });
            
        });
        
    });
    
    afterEach(function() {
        // log out
        openMenu();
        element(by.css('a[ng-click="logout()"]')).click();
    });
    
});
