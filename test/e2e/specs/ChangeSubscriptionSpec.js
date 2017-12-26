var commonActions = require('../commons/CommonActions');
var commonExpects = require('../commons/CommonExpects');
var adminSubscriptionPage = require('../pages/AdminSubscriptionPage');
var signInPage = require('../pages/SignInPage');
var changeSubscriptionPage = require('../pages/ChangeSubscriptionPage');

var ChangeSubscriptionSpec = function () {
    this.run = function () {
        var validPaymentDetails = {
            name: "Test Subscriber",
            cardNumber: "4242424242424242",
            cvc: "111",
            expMonth: 12,
        };
        describe('when user subscribes to monthly premium plan', function () {
            beforeEach(function () {
                signInPage.setEmail(browser.params.login.basic_to_monthly_plan_user.email);
                signInPage.setPass(browser.params.login.basic_to_monthly_plan_user.pass);
                signInPage.clickLogin();
                commonExpects.expectProgressDivHidden();

                commonExpects.expectMenuShown();
                changeSubscriptionPage.open();
                commonExpects.expectProgressDivHidden();
                commonExpects.expectCurrentUrlToBe(changeSubscriptionPage.url);
            });
            it('clicks monthly plan button and modal is shown and accepted', function () {
                changeSubscriptionPage.clickMonthlyPlan();
                expect(adminSubscriptionPage.getSubscriptionDialogElement().isDisplayed()).toBe(true);
                changeSubscriptionPage.getSubscriptionDialogNameElement().sendKeys(validPaymentDetails.name);
                changeSubscriptionPage.getSubscriptionDialogCardNumberElement().sendKeys(validPaymentDetails.cardNumber);
                changeSubscriptionPage.getSubscriptionDialogCvcElement().sendKeys(validPaymentDetails.cvc);
                element(by.cssContainingText('option', validPaymentDetails.expMonth)).click();
                element.all(by.repeater('year in years')).last().click();
                expect(changeSubscriptionPage.getSubscriptionDialogUpgradeButton().isEnabled()).toBe(true);
                changeSubscriptionPage.getSubscriptionDialogUpgradeButton().click();
                browser.wait(EC.not(EC.visibilityOf(element(by.css('div#resultLoading')))));
                commonExpects.expectProgressDivHidden();
            });

            afterEach(function () {
                commonActions.signOut();
                commonExpects.expectProgressDivHidden();
                commonExpects.expectMenuHidden();
                commonExpects.expectCurrentUrlToBe(signInPage.url);
            });
        });
        describe('when user subscribes to annual premium plan', function () {
            beforeEach(function () {
                signInPage.setEmail(browser.params.login.basic_to_annual_plan_user.email);
                signInPage.setPass(browser.params.login.basic_to_annual_plan_user.pass);
                signInPage.clickLogin();
                commonExpects.expectProgressDivHidden();

                commonExpects.expectMenuShown();
                changeSubscriptionPage.open();
                commonExpects.expectProgressDivHidden();
                commonExpects.expectCurrentUrlToBe(changeSubscriptionPage.url);
            });

            it('clicks annual plan button and modal is shown and accepted', function () {

                changeSubscriptionPage.clickAnnualPlan();
                expect(changeSubscriptionPage.getSubscriptionDialogElement().isDisplayed()).toBe(true);
                changeSubscriptionPage.getSubscriptionDialogNameElement().sendKeys(validPaymentDetails.name);
                changeSubscriptionPage.getSubscriptionDialogCardNumberElement().sendKeys(validPaymentDetails.cardNumber);
                changeSubscriptionPage.getSubscriptionDialogCvcElement().sendKeys(validPaymentDetails.cvc);
                element(by.cssContainingText('option', validPaymentDetails.expMonth)).click();
                element.all(by.repeater('year in years')).last().click();
                expect(changeSubscriptionPage.getSubscriptionDialogUpgradeButton().isEnabled()).toBe(true);
                changeSubscriptionPage.getSubscriptionDialogUpgradeButton().click();
                browser.wait(EC.not(EC.visibilityOf(element(by.css('div#resultLoading')))));
                commonExpects.expectProgressDivHidden() ;
                /*expect(changeSubscriptionPage.getSubscriptionDialogElement().isDisplayed()).toBe(false);*/
                /*commonExpects.expectSuccessNotificationShown();*/
            });

            afterEach(function () {
                commonActions.signOut();
                commonExpects.expectProgressDivHidden();
                commonExpects.expectMenuHidden();
                commonExpects.expectCurrentUrlToBe(signInPage.url);
            });

        });

        describe('when user subscribes to basic plan', function () {
            beforeEach(function () {
                signInPage.setEmail(browser.params.login.monthly_to_basic_plan_user.email);
                signInPage.setPass(browser.params.login.monthly_to_basic_plan_user.pass);
                signInPage.clickLogin();
                commonExpects.expectProgressDivHidden();

                commonExpects.expectMenuShown();
                changeSubscriptionPage.open();
                commonExpects.expectProgressDivHidden();
                commonExpects.expectCurrentUrlToBe(changeSubscriptionPage.url);
            });

            it('clicks basic plan button and subscription changes successfully', function(){
                  changeSubscriptionPage.clickBasicPlan();
                  expect(changeSubscriptionPage.getDowngradeConfirmationDialog().isDisplayed()).toBe(true);
                  expect(changeSubscriptionPage.getDowngradeButton().isEnabled()).toBe(true);
                  changeSubscriptionPage.getDowngradeButton().click();
                  browser.wait(EC.not(EC.visibilityOf(element(by.css('div#resultLoading')))));
                  commonExpects.expectProgressDivHidden();
                  expect(changeSubscriptionPage.getFreePlanIndicator().isDisplayed()).toBe(true);
                  expect(changeSubscriptionPage.getMonthlyPlanIndicator().isDisplayed()).toBe(false);
                  expect(changeSubscriptionPage.getAnnualPlanIndicator().isDisplayed()).toBe(false);

            });

            afterEach(function () {
                commonActions.signOut();
                commonExpects.expectProgressDivHidden();
                commonExpects.expectMenuHidden();
                commonExpects.expectCurrentUrlToBe(signInPage.url);
            });
        });
    };
};

module.exports = new ChangeSubscriptionSpec();
