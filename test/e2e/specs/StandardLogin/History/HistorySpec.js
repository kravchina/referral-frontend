var commonActions = require('../../../commons/CommonActions');
var commonExpects = require('../../../commons/CommonExpects');
var historyPage = require('../../../pages/HistoryPage');

var HistorySpec = function() {
    this.run = function() {
        describe('when user navigates to History Practice', function() {
            it('check that search state does not change when navigate to other page and back', function() {
                historyPage.getStatusFilter().click();
                historyPage.getStatusFilterOptionByName("Active").click();
                historyPage.getSearchField().sendKeys(browser.params.login.correct.lastName);
                expect(browser.getCurrentUrl()).toContain('status=Active');
                expect(browser.getCurrentUrl()).toContain('query=' + browser.params.login.correct.lastName);

                historyPage.getNewRefferalButton().click();
                commonExpects.expectProgressDivHidden();
                browser.navigate().back();
                expect(browser.getCurrentUrl()).toContain('status=Active');
                expect(browser.getCurrentUrl()).toContain('query=' + browser.params.login.correct.lastName);
            });
        });

    };
};

module.exports = new HistorySpec();