//var baseUrl = 'http://localhost:4000';
var baseUrl = 'http://dev1.dentallinks.org';

describe('when user logs in', function() {
    
    browser.get(baseUrl + '/#/sign_in');
    
    beforeEach(function() {
//        browser.get(baseUrl + '/#/sign_in');
        
        // check that account menu has class ng-hide, i.e. user is logged out
        expect(element(by.css('ul.nav.navbar-nav.navbar-right.ng-hide')).isPresent()).toBe(true);
        
        // log in
        element(by.model('user.email')).sendKeys('alexei@vidmich.com');
        element(by.model('user.password')).sendKeys('12345678');
        element(by.buttonText('Login')).click();
    });
    
    it('lands on History page and shows the top-right menu', function() {
        expect(browser.getCurrentUrl()).toContain('/history');
        expect(element(by.css('ul.nav.navbar-nav.navbar-right')).isPresent()).toBe(true);
    });
    
    describe('when user navigates to Admin', function() {
        beforeEach(function() {
            expect(browser.getCurrentUrl()).toContain('/history'); // TODO [ak] experiment. Remove this
            expect(element(by.css('ul.nav.navbar-nav.navbar-right')).isPresent()).toBe(true);
            browser.get(baseUrl + '/#/admin');
        });
        
        it('navigates to admin', function() {
            expect(element(by.model('practice.account_first_name')).isPresent()).toBe(true); // find better (=more) criteria of recognizing Admin page
        });
        
    });
        
    describe('when user navigates to Create Referral', function() {
        
        beforeEach(function() {
            expect(browser.getCurrentUrl()).toContain('/history'); // TODO [ak] experiment. Remove this
            expect(element(by.css('ul.nav.navbar-nav.navbar-right')).isPresent()).toBe(true);
            browser.get(baseUrl + '/#/create_referral');
        });
        
        it('shows Create Referral page', function() {
            expect(element(by.model('patient')).isPresent()).toBe(true); // find better (=more) criteria of recognizing Create Referral page
        });
            
        // describe('when user just navigates away', function() {
            // beforeEach(function() {
                // browser.get(baseUrl + '/#/history');
            // });
            
            // it('shows no warning and navigates away', function() {
                // expect(browser.getCurrentUrl()).toContain('/history');
            // });
        // });
        
    });
    
    afterEach(function() {
        // log out
        element(by.css('ul.nav.navbar-nav.navbar-right a.dropdown-toggle')).click();
        element(by.css('a[ng-click="logout()"]')).click();
        expect(browser.getCurrentUrl()).toContain('/sign_in');
        expect(element(by.buttonText('Login')).isPresent()).toBe(true);
    });
    
});
