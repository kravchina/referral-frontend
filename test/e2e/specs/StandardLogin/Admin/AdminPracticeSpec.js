var commonActions = require('../../../commons/CommonActions');
var commonExpects = require('../../../commons/CommonExpects');
var adminPracticePage = require('../../../pages/AdminPracticePage');
var historyPage = require('../../../pages/HistoryPage');

var AdminPracticeSpec = function() {
    this.run = function() {
        describe('when user navigates to Admin Practice', function() {
            beforeEach(function() {
                adminPracticePage.open();
                commonExpects.expectProgressDivHidden();
                commonExpects.expectCurrentUrlToBe(adminPracticePage.url);
            });

            it('check custom referral link block', function() {
                expect(adminPracticePage.getCustomReferralLinkBlock().isDisplayed()).toBe(true);
                adminPracticePage.getCopyToClipboardButton().click();
                commonExpects.expectInfoNotificationShown();
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
                        browser.wait(EC.alertIsPresent(), 10000); // added to prevent "No alert is active" under IE from time to time
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
    };
};

module.exports = new AdminPracticeSpec();
