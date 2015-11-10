var commonExpects = require('../../../commons/CommonExpects');
var consoleReportsPage = require('../../../pages/ConsoleReportsPage');

var ConsoleReportsSpec = function() {
    this.run = function() {
        describe('when user navigates to Console Reports', function() {
            beforeEach(function() {
                consoleReportsPage.open();
                commonExpects.expectProgressDivHidden();
                commonExpects.expectCurrentUrlToBe(consoleReportsPage.url);
            });

            it('shows Reports page', function() {
                expect(consoleReportsPage.getInvitationHeader().isDisplayed()).toBe(true);
                expect(consoleReportsPage.getInvitationHeader().getText()).toMatch('INVITATIONS');
                expect(consoleReportsPage.getPracticeHeader().isDisplayed()).toBe(true);
                expect(consoleReportsPage.getPracticeHeader().getText()).toMatch('PRACTICES');
                expect(consoleReportsPage.getUserHeader().isDisplayed()).toBe(true);
                expect(consoleReportsPage.getUserHeader().getText()).toMatch('USERS');

                expect(consoleReportsPage.getInvitationDay().getText()).not.toBe(null);
                expect(consoleReportsPage.getInvitationWeek().getText()).not.toBe(null);
                expect(consoleReportsPage.getInvitationYTD().getText()).not.toBe(null);

                expect(consoleReportsPage.getPracticeDay().getText()).not.toBe(null);
                expect(consoleReportsPage.getPracticeWeek().getText()).not.toBe(null);
                expect(consoleReportsPage.getPracticeYTD().getText()).not.toBe(null);

                expect(consoleReportsPage.getUserDay().getText()).not.toBe(null);
                expect(consoleReportsPage.getUserWeek().getText()).not.toBe(null);
                expect(consoleReportsPage.getUserYTD().getText()).not.toBe(null);
            });

        });
    };
};

module.exports = new ConsoleReportsSpec();
