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
                expect(element(by.css('.tab-content h3')).isDisplayed()).toBe(true);
            });

        });
    };
};

module.exports = new ConsoleReportsSpec();
