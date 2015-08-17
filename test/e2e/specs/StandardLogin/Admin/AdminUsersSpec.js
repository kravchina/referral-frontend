var commonExpects = require('../../../commons/CommonExpects');
var adminUsersPage = require('../../../pages/AdminUsersPage');

var AdminUsersSpec = function() {
    this.run = function() {
        describe('when user navigates to Admin Users', function() {
            beforeEach(function() {
                adminUsersPage.open();
                commonExpects.expectProgressDivHidden();
                commonExpects.expectCurrentUrlToBe(adminUsersPage.url);
            });
            
            it('shows Users page', function() {
                expect(element(by.css('th.cell-user')).isDisplayed()).toBe(true);
            });
            
        });
    };
};

module.exports = new AdminUsersSpec();
