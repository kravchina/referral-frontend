var commonActions = require('../commons/CommonActions');
var commonExpects = require('../commons/CommonExpects');
var adminSubscriptionPage = require('../pages/AdminSubscriptionPage');
var signInPage = require('../pages/SignInPage');
var changeSubscriptionPage = require('../pages/ChangeSubscriptionPage');

var AdminSubscriptionPremiumSpec = function() {
    this.run = function() {
        describe('when user subscribes to premium account', function(){
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
            it('clicks change subscription button and price page is shown', function(){
                adminSubscriptionPage.clickChangeSubscription();
                commonExpects.expectCurrentUrlToBe(changeSubscriptionPage.url + '?fromRegistration=false')
            });

            afterEach(function() {
                commonActions.signOut();
                commonExpects.expectProgressDivHidden();
                commonExpects.expectMenuHidden();
                commonExpects.expectCurrentUrlToBe(signInPage.url);
            });
        });
        describe('when user changes payment source', function(){
            var validPaymentDetails = {
                name: "Test Subscriber",
                cardNumber: "4242424242424242",
                cvc: "111",
                expMonth: 12,
                expYear: new Date().getFullYear() + 1
            };

            beforeEach(function(){
                signInPage.setEmail(browser.params.login.subscribed_user.email);
                signInPage.setPass(browser.params.login.subscribed_user.pass);
                signInPage.clickLogin();
                commonExpects.expectProgressDivHidden();

                commonExpects.expectMenuShown();
                adminSubscriptionPage.open();
                commonExpects.expectProgressDivHidden();
                commonExpects.expectCurrentUrlToBe(adminSubscriptionPage.url);
            });

            it('clicks edit payment source button and modal is shown', function(){

                adminSubscriptionPage.clickChangePaymentSource();
                expect(adminSubscriptionPage.getSubscriptionDialogElement().isDisplayed()).toBe(true);
                adminSubscriptionPage.getSubscriptionDialogNameElement().sendKeys(validPaymentDetails.name);
                adminSubscriptionPage.getSubscriptionDialogCardNumberElement().sendKeys(validPaymentDetails.cardNumber);
                adminSubscriptionPage.getSubscriptionDialogCvcElement().sendKeys(validPaymentDetails.cvc);
                adminSubscriptionPage.getSubscriptionDialogMonthElement().sendKeys(validPaymentDetails.expMonth);
                element(by.cssContainingText('option', validPaymentDetails.expMonth)).click();
                element.all(by.repeater('year in years')).last().click();
                var saveButton = adminSubscriptionPage.getSubscriptionDialogSaveButton();
                //browser.wait(EC.visibilityOf(saveButton), 5000);
                expect(saveButton.isEnabled()).toBe(true);
                saveButton.click();
                //expect(adminSubscriptionPage.getSubscriptionDialogNameElement().isPresent()).toBe(false);
                browser.wait(EC.not(EC.visibilityOf(element(by.css('div#resultLoading')))));
                commonExpects.expectProgressDivHidden();
                expect(adminSubscriptionPage.getSubscriptionDialogElement().isPresent()).not.toBe(true);


                /*browser.driver.wait(function () {
                    return adminSubscriptionPage.getSubscriptionDialogElement().isPresent().then(function(present) { return !present; });
                }, 10000);*/

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
