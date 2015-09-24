var commonExpects = require('../../../commons/CommonExpects');
var consolePracticePage = require('../../../pages/ConsolePracticePage');

var ConsolePracticeSpec = function() {
    this.run = function() {
        describe('when user navigates to Console Practice', function() {
            beforeEach(function() {
                consolePracticePage.open();
                commonExpects.expectProgressDivHidden();
                commonExpects.expectCurrentUrlToBe(consolePracticePage.url);
            });

            it('shows Practice page', function() {
                expect(element(by.css('.tab-content h3')).isDisplayed()).toBe(true);
            });

        });
    };
};

module.exports = new ConsolePracticeSpec();
