var commonActions = require('../CommonActions');
var commonExpects = require('../CommonExpects');
var adminPracticePage = require('./AdminPracticePage');
var historyPage = require('../History/HistoryPage');
var signInPage = require('../SignIn/SignInPage');

var AdminPracticeSpec = function() {
    this.run = function() {
        describe('when user navigates to Admin Practice', function() {
            beforeEach(function() {
                adminPracticePage.open();
                commonExpects.expectProgressDivHidden();
                commonExpects.expectCurrentUrlToBe(adminPracticePage.url);
            });

            it('shows Admin Practice page in Practice view mode', function() {
                expect(element(by.css('#adminTabContent')).isPresent()).toBe(true);
                expect(element(by.model('practice.name')).isDisplayed()).toBe(true); // this input is displayed on the page in both view and edit modes
                adminPracticePage.expectPracticeViewMode();
                // TODO [ak] add more criteria of recognizing page
            });

            describe('when user tries to enter Practice edit mode', function() {
                beforeEach(function() {
                    adminPracticePage.clickPracticeEdit();
                });

                it('enters Practice edit mode', function() {
                    adminPracticePage.expectPracticeEditMode();
                });

                it('allows navigation away without unsaved changes warning', function() {
                    commonActions.clickLogo();
                    commonExpects.expectProgressDivHidden();
                    commonExpects.expectCurrentUrlToBe(historyPage.url);
                });

                describe('when user changes Practice Name and tries to leave', function() {
                    var dataStr = 'asdf';

                    beforeEach(function() {
                        adminPracticePage.setPracticeName(dataStr);
                        expect(adminPracticePage.getPracticeName()).toEqual(dataStr);
                        commonActions.clickLogo();
                        browser.wait(protractor.ExpectedConditions.alertIsPresent(), 10000); // added to prevent "No alert is active" under IE from time to time
                    });

                    var alertDialog; // TODO [ak] extract common alert functions somewhere, re-use code

                    describe('when user accepts the unsaved changes alert', function() {
                        beforeEach(function() {
                            alertDialog = browser.switchTo().alert();
                            expect(alertDialog.getText()).toContain('unsaved');
                            expect(alertDialog.accept).toBeDefined();
                            alertDialog.accept();
                        });

                        it('navigates away', function() {
                            commonExpects.expectProgressDivHidden();
                            commonExpects.expectCurrentUrlToBe(historyPage.url);
                        });
                    });

                    describe('when user dismisses the unsaved changes alert', function() {
                        beforeEach(function() {
                            alertDialog = browser.switchTo().alert();
                            expect(alertDialog.getText()).toContain('unsaved');
                            expect(alertDialog.dismiss).toBeDefined();
                            alertDialog.dismiss();
                        });

                        it('stays on page with data kept', function() {
                            commonExpects.expectCurrentUrlToBe(adminPracticePage.url);
                            expect(adminPracticePage.getPracticeName()).toEqual(dataStr);
                        });

                        afterEach(function(doneCallback) {
                            // manually getting out of the page and accepting the alert to allow log out and other flows
                            commonActions.clickLogo();
                            alertDialog = browser.switchTo().alert();
                            alertDialog.accept();
                            commonExpects.expectProgressDivHidden();
                            commonExpects.expectCurrentUrlToBe(historyPage.url, doneCallback);
                        });
                    });
                });

            });

        });
        describe('when user from premium practice', function () {
            beforeEach(function () {
                commonActions.signOut();
                commonExpects.expectProgressDivHidden();
                commonExpects.expectMenuHidden();
                commonExpects.expectCurrentUrlToBe(signInPage.url);


                commonExpects.expectProgressDivHidden();
                commonExpects.expectMenuHidden();

                signInPage.setEmail(browser.params.login.subscribed_user.email);
                signInPage.setPass(browser.params.login.subscribed_user.pass);
                signInPage.clickLogin();
                commonExpects.expectProgressDivHidden();

                commonExpects.expectMenuShown();
                commonExpects.expectCurrentUrlToBe(historyPage.url);
                adminPracticePage.open();
                commonExpects.expectProgressDivHidden();
            });
            it('adds new address showing prorate notification dialog and saves new address', function(){
                commonExpects.expectCurrentUrlToBe(adminPracticePage.url);
                adminPracticePage.clickPracticeEdit();
                adminPracticePage.clickAddAddress();
                var newAddressForm = adminPracticePage.getLastAddress();
                adminPracticePage.getStreetElement(newAddressForm).sendKeys("Test address");
                adminPracticePage.getCityElement(newAddressForm).sendKeys('City');
                adminPracticePage.getStateElement(newAddressForm).element(by.cssContainingText('option', 'AK')).click();
                adminPracticePage.getZipElement(newAddressForm).sendKeys(123456);
                expect(adminPracticePage.getPracticeSaveButton().isEnabled()).toBe(true);
                adminPracticePage.getPracticeSaveButton().click();
                expect(adminPracticePage.getSubscriptionNotificationModal().isPresent()).toBe(true);
                expect(adminPracticePage.getSubscriptionNotificationModal().element(by.id('subscription_ok_btn')).isEnabled()).toBe(true);
                adminPracticePage.getSubscriptionNotificationModal().element(by.id('subscription_ok_btn')).click();
                expect(adminPracticePage.getSubscriptionNotificationModal().isPresent()).toBe(false);
                commonExpects.expectProgressDivHidden();
            });

            it('removes address showing notification dialog', function(){
                adminPracticePage.clickRemoveAddress(adminPracticePage.getLastAddress());
                expect(adminPracticePage.getLastAddress().element(by.css('a[ng-click="removeAddress(address)"]')).isEnabled()).toBe(true);
                adminPracticePage.getLastAddress().element(by.css('a[ng-click="removeAddress(address)"]')).click();
                expect(adminPracticePage.getSubscriptionNotificationModal().isPresent()).toBe(true);
                expect(adminPracticePage.getSubscriptionNotificationModal().element(by.id('subscription_ok_btn')).isEnabled()).toBe(true);
                adminPracticePage.getSubscriptionNotificationModal().element(by.id('subscription_ok_btn')).click();
                expect(adminPracticePage.getSubscriptionNotificationModal().isPresent()).toBe(false);
                commonExpects.expectProgressDivHidden();
            });

        });

        describe('when user from non-premium practice', function(){
            beforeEach(function(){
                commonActions.signOut();
                commonExpects.expectProgressDivHidden();
                commonExpects.expectMenuHidden();
                commonExpects.expectCurrentUrlToBe(signInPage.url);

                commonExpects.expectProgressDivHidden();
                commonExpects.expectMenuHidden();

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
        });

    };
};

module.exports = new AdminPracticeSpec();
