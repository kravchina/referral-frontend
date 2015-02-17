var commonActions = require('../CommonActions');
var commonExpects = require('../CommonExpects');
var createReferralPage = require('./CreateReferralPage');
var historyPage = require('../History/HistoryPage');

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
        
    };
};

module.exports = new CreateReferralNoSaveSpec();
