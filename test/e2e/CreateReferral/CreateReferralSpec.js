var commonExpects = require('../CommonExpects');
var createReferralPage = require('./CreateReferralPage');

var createReferralNoSaveSpec = require('./CreateReferralNoSaveSpec.js');
var createReferralSaveSpec = require('./CreateReferralSaveSpec.js');

var CreateReferralSpec = function() {
    this.run = function() {
        describe('when user navigates to Create Referral', function() {
            
            beforeEach(function() {
                createReferralPage.open();
                commonExpects.expectProgressDivHidden();
                commonExpects.expectCurrentUrlToBe(createReferralPage.url);
            });
            
            it('shows Create Referral page', function() {
                expect(createReferralPage.getPatientElement().isDisplayed()).toBe(true);
                expect(createReferralPage.getPracticeElement().isDisplayed()).toBe(true);
                expect(createReferralPage.getProviderElement().isDisplayed()).toBe(true);
                expect(createReferralPage.getReferralTypeElement().isDisplayed()).toBe(true);
                expect(createReferralPage.getProcedureElement().isDisplayed()).toBe(true);
                // TODO [ak] teeth, attachments, notes?
                expect(createReferralPage.getButtonSaveElement().isDisplayed()).toBe(true);
                expect(createReferralPage.getButtonSignSendElement().isDisplayed()).toBe(true);
                expect(createReferralPage.getButtonDiscardElement().isDisplayed()).toBe(false);
                
                // some elements and buttons should be disabled
                expect(createReferralPage.getProviderElement().isEnabled()).toBe(false);
                expect(createReferralPage.getProcedureElement().isEnabled()).toBe(false);
                expect(createReferralPage.getButtonSaveElement().isEnabled()).toBe(false);
                expect(createReferralPage.getButtonSignSendElement().isEnabled()).toBe(false);
            });
            
            createReferralNoSaveSpec.run();
            createReferralSaveSpec.run();
            
        });
    };
};

module.exports = new CreateReferralSpec();
