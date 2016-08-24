var commonActions = require('../../../commons/CommonActions');
var commonExpects = require('../../../commons/CommonExpects');
var viewReferralDraftPage = require('../../../pages/ViewReferralDraftPage');

var ViewReferralDraftSpec = function() {
    this.run = function() {
        describe('when user navigates to View Referral Draft', function() {

            beforeEach(function() {
                viewReferralDraftPage.open();
                commonExpects.expectProgressDivHidden();
                commonExpects.expectCurrentUrlToContain(viewReferralDraftPage.url);
            });

            it('shows View Referral Draft page', function() {
                expect(element(by.css('button[ng-click="discardTemplate(model.referral)"]')).isPresent()).toBe(true);
            });

            it('edit image last modified date', function() {
                expect(viewReferralDraftPage.getSaveButton().isEnabled()).toBe(false);
                expect(viewReferralDraftPage.getSignSendButton().isEnabled()).toBe(false);

                viewReferralDraftPage.getImageEditLastModifiedButton().click();

                expect(viewReferralDraftPage.getCalendar().isDisplayed()).toBe(true);
                viewReferralDraftPage.getToday().click();
                expect(viewReferralDraftPage.getCalendar().isPresent()).toBe(false);
                expect(viewReferralDraftPage.getSaveButton().isEnabled()).toBe(true);
                expect(viewReferralDraftPage.getSignSendButton().isEnabled()).toBe(true);
            });

        });
    };
};

module.exports = new ViewReferralDraftSpec();
