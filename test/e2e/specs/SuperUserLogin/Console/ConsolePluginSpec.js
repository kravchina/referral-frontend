var commonExpects = require('../../../commons/CommonExpects');
var consolePluginPage = require('../../../pages/ConsolePluginPage');

var ConsolePluginSpec = function() {
    this.run = function() {
        describe('when user navigates to Console Plugin', function() {
            beforeEach(function() {
                consolePluginPage.open();
                commonExpects.expectProgressDivHidden();
                commonExpects.expectCurrentUrlToBe(consolePluginPage.url);
            });

            it('add new od version', function() {
                expect(consolePluginPage.getAddVersionButton().isDisplayed()).toBe(true);
                consolePluginPage.getAddVersionButton().click();
                expect(consolePluginPage.getAddVersionModal().isDisplayed()).toBe(true);
                consolePluginPage.getVersionInputModal().sendKeys('17.17.17');
                consolePluginPage.getAddButtonModal().click();
                expect(consolePluginPage.getFirstVersionElement().getText()).toMatch('17.17.17');
            });

            it('check plugin version info', function() {
                consolePluginPage.getFirstVersionElement().click();
                expect(consolePluginPage.getVersionDeleteButton().isDisplayed()).toBe(true);
                expect(consolePluginPage.getPluginLogsButton().isDisplayed()).toBe(true);
                expect(consolePluginPage.getPluginUploadButton().isPresent()).toBe(true);
            });

            it('check deleting version', function() {
                consolePluginPage.getFirstVersionElement().click();
                consolePluginPage.getVersionDeleteButton().click();
                browser.sleep(300);
                consolePluginPage.getVersionDeleteYesButton().click();
                expect(consolePluginPage.getAllVersionsElement().count()).toBe(0);
            });

        });
    };
};

module.exports = new ConsolePluginSpec();
