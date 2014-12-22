var commonActions = require('../CommonActions');
var commonExpects = require('../CommonExpects');
var createReferralPage = require('./CreateReferralPage');
var historyPage = require('../History/HistoryPage');

var CreateReferralSpec = function() {
    this.run = function() {
        describe('when user navigates to Create Referral', function() {
            
            beforeEach(function() {
                createReferralPage.open();
                commonExpects.expectProgressDivHidden();
                commonExpects.expectCurrentUrlToBe(createReferralPage.url);
            });
            
            it('shows Create Referral page', function() {
                expect(element(by.model('patient')).isPresent()).toBe(true); // TODO [ak] add more criteria of recognizing Create Referral page
            });
                
            it('allows navigation away without unsaved changes warning', function() {
                commonActions.clickLogo();
                commonExpects.expectProgressDivHidden();
                commonExpects.expectCurrentUrlToBe(historyPage.url);
            });
            
            describe('when user changes Patient and tries to leave', function() {
                var dataStr = 'asdf';
                
                beforeEach(function() {
                    createReferralPage.setPatient(dataStr);
                    expect(createReferralPage.getPatient()).toEqual(dataStr);
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
                        expect(createReferralPage.getPatient()).toEqual(dataStr);
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
            
        });
    };
};

module.exports = new CreateReferralSpec();
