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
                expect(element(by.cssContainingText('h3', 'Invitations')).isDisplayed()).toBe(true);
                expect(element(by.cssContainingText('h3', 'Practices')).isDisplayed()).toBe(true);
                expect(element(by.cssContainingText('h3', 'Users')).isDisplayed()).toBe(true);
            });

        });
    };
};

module.exports = new ConsoleReportsSpec();
