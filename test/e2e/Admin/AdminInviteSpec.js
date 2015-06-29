var commonExpects = require('../CommonExpects');
var adminInvitePage = require('./AdminInvitePage');

var AdminInviteSpec = function() {
    this.run = function() {
        describe('when user navigates to Admin Invite', function() {
            beforeEach(function() {
                adminInvitePage.open();
                commonExpects.expectProgressDivHidden();
                commonExpects.expectCurrentUrlToBe(adminInvitePage.url);
            });
            
            it('shows Invite Colleague page', function() {
                expect(element(by.css('th.cell-provider')).isDisplayed()).toBe(true);
            });
            
        });
    };
};

module.exports = new AdminInviteSpec();
