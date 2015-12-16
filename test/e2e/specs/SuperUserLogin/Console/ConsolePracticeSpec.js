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
                expect(consolePracticePage.getPractice().isDisplayed()).toBe(true);
                expect(consolePracticePage.getUser().isDisplayed()).toBe(true);
            });

            it('fill input fields and check output data', function(){
                var userFullName = browser.params.login.super_user.firstName + ' ' + browser.params.login.super_user.lastName;
                //practice fields
                expect(consolePracticePage.getPracticeDropDownElement().isDisplayed()).toBe(false);
                consolePracticePage.setPractice(browser.params.login.super_user.practice.searchText);
                expect(consolePracticePage.getPracticeDropDownElement().isDisplayed()).toBe(true);
                consolePracticePage.getPracticeDropDownFirstRowElement().click();
                expect(consolePracticePage.getPracticeDropDownElement().isDisplayed()).toBe(false);
                expect(consolePracticePage.getPracticeName().getAttribute('value')).toMatch(browser.params.login.super_user.practice.name);

                //user fields
                consolePracticePage.getUser().click();
                expect(consolePracticePage.getUserOptionByName(userFullName).isDisplayed()).toBe(true);
                consolePracticePage.getUserOptionByName(userFullName).click();
                expect(consolePracticePage.getUserEmail().getAttribute('value')).toMatch(browser.params.login.super_user.email);
                expect(consolePracticePage.getUserDeleteButton().isPresent()).toBe(true);
                expect(consolePracticePage.getUserEditButton().isPresent()).toBe(true);
            });

        });
    };
};

module.exports = new ConsolePracticeSpec();
