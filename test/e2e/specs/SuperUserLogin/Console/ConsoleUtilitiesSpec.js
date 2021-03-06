var commonExpects = require('../../../commons/CommonExpects');
var consoleUtilitiesPage = require('../../../pages/ConsoleUtilitiesPage');

var ConsoleUtilitiesSpec = function() {
    this.run = function() {
        describe('when user navigates to Console Utilities', function() {
            beforeEach(function() {
                consoleUtilitiesPage.open();
                commonExpects.expectProgressDivHidden();
                commonExpects.expectCurrentUrlToBe(consoleUtilitiesPage.url);
            });

            it('shows Utilities page', function() {
                expect(consoleUtilitiesPage.getDownloadEmailsButton().isDisplayed()).toBe(true);

            });

        });
    };
};

module.exports = new ConsoleUtilitiesSpec();
