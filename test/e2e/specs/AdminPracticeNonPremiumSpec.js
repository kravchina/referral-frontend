var commonActions = require('../commons/CommonActions');
var commonExpects = require('../commons/CommonExpects');
var adminPracticePage = require('../pages/AdminPracticePage');
var historyPage = require('../pages/HistoryPage');
var signInPage = require('../pages/SignInPage');

var AdminPracticeNonPremiumSpec = function() {
    this.run = function() {
        describe('when user from non-premium practice', function(){
            beforeEach(function(){
                signInPage.setEmail(browser.params.login.unsubscribed_user.email);
                signInPage.setPass(browser.params.login.unsubscribed_user.pass);
                signInPage.clickLogin();
                commonExpects.expectProgressDivHidden();

                commonExpects.expectMenuShown();
                commonExpects.expectCurrentUrlToBe(historyPage.url);
                adminPracticePage.open();
                commonExpects.expectProgressDivHidden();
            });
            it('adds new address without prorate notification dialog', function(){
                commonExpects.expectCurrentUrlToBe(adminPracticePage.url);
                adminPracticePage.clickPracticeEdit();
                adminPracticePage.clickAddAddress();
                var newAddressForm = adminPracticePage.getLastAddress();
                adminPracticePage.getStreetElement(newAddressForm).sendKeys("Test address");
                adminPracticePage.getCityElement(newAddressForm).sendKeys('City');
                adminPracticePage.getStateElement(newAddressForm).element(by.cssContainingText('option', 'AK')).click();
                adminPracticePage.getZipElement(newAddressForm).sendKeys(123456);
                expect(adminPracticePage.getPracticeSaveButton().isEnabled()).toBe(true);
                commonActions.scrollIntoView(adminPracticePage.getPracticeSaveButton());
                adminPracticePage.getPracticeSaveButton().click();
                expect(adminPracticePage.getSubscriptionNotificationModal().isPresent()).toBe(false);
                expect(adminPracticePage.getSubscriptionNotificationModal().element(by.id('subscription_ok_btn')).isPresent()).toBe(false);
                commonExpects.expectProgressDivHidden();
            });

            it('removes address without prorate notification dialog', function(){
                adminPracticePage.clickRemoveAddress(adminPracticePage.getLastAddress());
                expect(adminPracticePage.getLastAddress().element(by.css('a[ng-click="removeAddress(address)"]')).isEnabled()).toBe(true);
                adminPracticePage.getLastAddress().element(by.css('a[ng-click="removeAddress(address)"]')).click();
                expect(adminPracticePage.getSubscriptionNotificationModal().isPresent()).toBe(false);
                expect(adminPracticePage.getSubscriptionNotificationModal().element(by.id('subscription_ok_btn')).isPresent()).toBe(false);
                commonExpects.expectProgressDivHidden();
            })
            
            afterEach(function() {
                commonActions.signOut();
                commonExpects.expectProgressDivHidden();
                commonExpects.expectMenuHidden();
                commonExpects.expectCurrentUrlToBe(signInPage.url);
            });
        });
    };
};

module.exports = new AdminPracticeNonPremiumSpec();
