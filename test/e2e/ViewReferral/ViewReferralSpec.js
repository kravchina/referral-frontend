var commonActions = require('../CommonActions');
var commonExpects = require('../CommonExpects');
var viewReferralPage = require('./ViewReferralPage');

var ViewReferralSpec = function() {
    this.run = function() {
        describe('when user navigates to View Referral', function() {
            
            beforeEach(function() {
                viewReferralPage.open();
                commonExpects.expectProgressDivHidden(); // TODO [ak] consider placing these expects into open(). And for all pages
                commonExpects.expectCurrentUrlToContain(viewReferralPage.url);
            });
            
            it('shows View Referral page', function() {
                expect(element(by.css('button[ng-click="savePdf()"]')).isPresent()).toBe(true); // TODO [ak] consider adding more criteria of recognizing the page
            });
            
        });
    };
};

module.exports = new ViewReferralSpec();
