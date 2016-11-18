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
                expect(consoleReportsPage.getInvitationMenuLink().isDisplayed()).toBe(true);
                expect(consoleReportsPage.getPracticeMenuLink().isDisplayed()).toBe(true);
                expect(consoleReportsPage.getUserMenuLink().isDisplayed()).toBe(true);
                expect(consoleReportsPage.getListOfRemindersMenuLink().isDisplayed()).toBe(true);
                expect(consoleReportsPage.getSiteStatsMenuLink().isDisplayed()).toBe(true);
            });

            it('check report invitations', function(){
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

            it('check list of reminders', function(){
                consoleReportsPage.getListOfRemindersMenuLink().click();
                expect(consoleReportsPage.getListOfRemindersTable().isDisplayed()).toBe(true);
            });

        });
    };
};

module.exports = new ConsoleReportsSpec();
