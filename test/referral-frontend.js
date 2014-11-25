describe('when user logs in', function() {
    
    beforeEach(function() {
        browser.get('http://dev1.dentallinks.org/#/sign_in');
        
        // check that account menu has class ng-hide, i.e. user is logged out
        expect(element(by.css('ul.nav.navbar-nav.navbar-right.ng-hide')).isPresent()).toBe(true);
        
        // log in
        element(by.model('user.email')).sendKeys('alexei@vidmich.com');
        element(by.model('user.password')).sendKeys('12345678');
        element(by.buttonText('Login')).click();
    });
    
    it('shows the top-right menu', function() {
        expect(element(by.css('ul.nav.navbar-nav.navbar-right')).isPresent()).toBe(true);
        browser.debugger();
    });    
    
    describe('when user navigates to Admin', function() {
        beforeEach(function() {
            browser.get('http://dev1.dentallinks.org/#/admin');
        });
        
        it('navigates to admin', function() {
            expect(element(by.model('practice.account_first_name')).isPresent()).toBe(true);
            browser.debugger();
        });
        
    });
        
    describe('when user navigates to Create Referral', function() {
        
        beforeEach(function() {
            browser.get('http://dev1.dentallinks.org/#/create_referral');
        });
        
        it('shows Create Referral page', function() {
            expect(element(by.model('patient')).isPresent()).toBe(true); // find better criteria of recognizing Create Referral page
            browser.debugger();
        });
            
        // describe('when user just navigates away', function() {
            // beforeEach(function() {
                // browser.get('http://dev1.dentallinks.org/#/history');
            // });
            
            // it('shows no warning and navigates away', function() {
                // expect(browser.getCurrentUrl()).toContain('/history');
                // browser.debugger();
            // });
        // });
        
        // describe('when user changes patient, tries to leave and accepts losing of changes', function() {
            
            // beforeEach(function() {
                // element(by.model('patient')).sendKeys('asdf');
                // element(by.css('a.navbar-brand')).click();
                // var alertDialog = browser.switchTo().alert();
                // expect(alertDialog.getText()).toContain('unsaved');
                // alertDialog.accept();
            // });
            
            // it('navigates away', function() {
                // expect(browser.getCurrentUrl()).toContain('/history');
                // browser.debugger();
            // });
                
        // });
    });
    
    afterEach(function() {
        // log out
        element(by.css('ul.nav.navbar-nav.navbar-right a.dropdown-toggle')).click();
        element(by.css('a[ng-click="logout()"]')).click();
    });
    
});
