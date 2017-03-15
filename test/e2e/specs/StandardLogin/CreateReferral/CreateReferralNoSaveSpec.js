var commonActions = require('../../../commons/CommonActions');
var commonExpects = require('../../../commons/CommonExpects');
var createReferralPage = require('../../../pages/CreateReferralPage');
var adminPracticePage = require('../../../pages/AdminPracticePage');
var historyPage = require('../../../pages/HistoryPage');

var CreateReferralNoSaveSpec = function() {
    this.run = function() {
        describe('when user makes no changes and tries to leave', function() {
            beforeEach(function() {
                commonActions.clickLogo();
            });
            
            it('navigates away without unsaved changes warning', function() {
                commonExpects.expectProgressDivHidden();
                commonExpects.expectCurrentUrlToBe(historyPage.url);
            });
        });
        
        // TODO [ak] checking that all fields are covered with unsaved changes: simple change for each field, then logo click -- alert. Dismiss -- go back, accept -- go away
        
        // TODO [ak] maybe later individual field errors (e.g. when user simply enters smth in patient, error is shown, etc.)
            
        describe('when user changes Patient and tries to leave', function() {
            var dataStr = 'asdf';
            
            beforeEach(function() {
                createReferralPage.getPatientElement().sendKeys(dataStr);
                expect(createReferralPage.getPatientElement().getAttribute('value')).toEqual(dataStr);
                commonActions.clickLogo();
                browser.wait(EC.alertIsPresent(), 10000); // added to prevent "No alert is active" under IE from time to time
            });
            
            var alertDialog;
            
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
                    commonExpects.expectCurrentUrlToBe(createReferralPage.url);
                    expect(createReferralPage.getPatientElement().getAttribute('value')).toEqual(dataStr);
                });
                
                afterEach(function() {
                    // manually getting out of the page and accepting the alert to allow log out and other flows
                    commonActions.clickLogo();
                    alertDialog = browser.switchTo().alert();
                    alertDialog.accept();
                    commonExpects.expectProgressDivHidden();
                    commonExpects.expectCurrentUrlToBe(historyPage.url);
                });
            });
            
        });

        describe('check invite new provider', function(){
            var alertDialog;
            var provider = {
                firstName: 'PName',
                lastName: 'PLastName',
                email: 'provider@provider.com'
            };

            it('when user changed his mind and selects existing practice and existing provider in it', function(){
                createReferralPage.getInviteProviderButton().click();
                expect(createReferralPage.getProviderDialogElement().isDisplayed()).toBe(true);

                createReferralPage.getProviderDialogFirstNameElement().sendKeys(provider.firstName);
                createReferralPage.getProviderDialogLastNameElement().sendKeys(provider.lastName);
                createReferralPage.getProviderDialogEmailElement().sendKeys(provider.email);
                createReferralPage.getProviderDialogSendButton().click();
                expect(createReferralPage.getProviderDialogElement().isPresent()).toBe(false);

                createReferralPage.getPracticeElement().clear();
                createReferralPage.getPracticeElement().sendKeys('Trial');

                expect(createReferralPage.getDeleteProviderDialog().isDisplayed()).toBe(true);
                createReferralPage.getDeleteProviderDialogOkButton().click();
                expect(createReferralPage.getDeleteProviderDialog().isPresent()).toBe(false);
            });

            afterEach(function() {
                commonActions.clickLogo();
                alertDialog = browser.switchTo().alert();
                alertDialog.accept();
                commonExpects.expectProgressDivHidden();
                commonExpects.expectCurrentUrlToBe(historyPage.url);
            });
        });

        describe('when url contain pid parameter', function(){
            var alertDialog;

            beforeEach(function() {
                browser.get(adminPracticePage.url);
                commonExpects.expectProgressDivHidden();
                adminPracticePage.getCustomReferralLinkBlock().element(by.css('.alert a')).click();
                commonExpects.expectProgressDivHidden();
                commonExpects.expectCurrentUrlToContain(createReferralPage.url_with_pid);
            });

            it('check practice selected', function(){
                expect(createReferralPage.getProviderElement().isEnabled()).toBe(true);
            });

            afterEach(function() {
                commonActions.clickLogo();
                alertDialog = browser.switchTo().alert();
                alertDialog.accept();
                commonExpects.expectProgressDivHidden();
                commonExpects.expectCurrentUrlToBe(historyPage.url);
            });

        });
        
    };
};

module.exports = new CreateReferralNoSaveSpec();
