var commonActions = require('../commons/CommonActions');
var commonExpects = require('../commons/CommonExpects');
var adminSubscriptionPage = require('../pages/AdminSubscriptionPage');
var signInPage = require('../pages/SignInPage');

var AdminSubscriptionPremiumSpec = function() {
    this.run = function() {
        describe('when user subscribes to premium account', function(){
            var validPaymentDetails = {
                name: "Test Subscriber",
                cardNumber: "4242424242424242",
                cvc: "111",
                expMonth: 12,
                expYear: new Date().getFullYear() + 1
            };



            beforeEach(function(){
                signInPage.setEmail(browser.params.login.unsubscribed_user.email);
                signInPage.setPass(browser.params.login.unsubscribed_user.pass);
                signInPage.clickLogin();
                commonExpects.expectProgressDivHidden();

                commonExpects.expectMenuShown();
                adminSubscriptionPage.open();
                commonExpects.expectProgressDivHidden();
                commonExpects.expectCurrentUrlToBe(adminSubscriptionPage.url);
            });
            it('clicks upgrade button and modal is shown', function(){

                adminSubscriptionPage.clickUpgradeSubscription();
                expect(adminSubscriptionPage.getSubscriptionDialogElement().isDisplayed()).toBe(true);
                adminSubscriptionPage.getSubscriptionDialogNameElement().sendKeys(validPaymentDetails.name);
                adminSubscriptionPage.getSubscriptionDialogCardNumberElement().sendKeys(validPaymentDetails.cardNumber);
                adminSubscriptionPage.getSubscriptionDialogCvcElement().sendKeys(validPaymentDetails.cvc);
                adminSubscriptionPage.getSubscriptionDialogMonthElement().sendKeys(validPaymentDetails.expMonth);
                element(by.cssContainingText('option', validPaymentDetails.expMonth)).click();
                element.all(by.repeater('year in years')).last().click();
                expect(adminSubscriptionPage.getSubscriptionDialogUpgradeButton().isEnabled()).toBe(true);
                adminSubscriptionPage.getSubscriptionDialogUpgradeButton().click();
                //expect(adminSubscriptionPage.getSubscriptionDialogNameElement().isPresent()).toBe(false);
                //commonExpects.expectProgressDivHidden();
                //expect(adminSubscriptionPage.getSubscriptionDialogElement().isPresent()).toBe(false);
                browser.driver.wait(function () {
                    return adminSubscriptionPage.getSubscriptionDialogElement().isPresent().then(function(present) { return !present; });
                }, 10000);

            });
            
            afterEach(function() {
                commonActions.signOut();
                commonExpects.expectProgressDivHidden();
                commonExpects.expectMenuHidden();
                commonExpects.expectCurrentUrlToBe(signInPage.url);
            });
        });
    };
};

module.exports = new AdminSubscriptionPremiumSpec();
