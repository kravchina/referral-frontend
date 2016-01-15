var commonExpects = require('../../../commons/CommonExpects');
var consolePracticePage = require('../../../pages/ConsolePracticePage');

var ConsolePracticeSpec = function() {
    this.run = function() {
        var address = {
            street: 'Test street',
            city: 'Test City',
            phone: '9998887777',
            state: 'DE',
            zip: '666999',
            website: 'www.testsite.com'
        };
        var practice = {
            name: 'TestPracticeMock',
            type: 'General Dentistry',
            state: 'Hawaii'
        };
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

            it('check practice address add, edit, delete', function(){
                consolePracticePage.setPractice(browser.params.login.super_user.practice.name);
                expect(consolePracticePage.getPracticeDropDownElement().isDisplayed()).toBe(true);
                consolePracticePage.getPracticeDropDownFirstRowElement().click();

                consolePracticePage.getAddAddressButton().click();
                var lastAddress = consolePracticePage.getLastAddress();

                consolePracticePage.getAddressStreetElement(lastAddress).sendKeys(address.street);
                consolePracticePage.getAddressCityElement(lastAddress).sendKeys(address.city);
                consolePracticePage.getAddressPhoneElement(lastAddress).sendKeys(address.phone);
                consolePracticePage.getAddressStateElement(lastAddress).element(by.cssContainingText('option', address.state)).click();
                consolePracticePage.getAddressZipElement(lastAddress).sendKeys(address.zip);
                consolePracticePage.getAddressWebsiteElement(lastAddress).sendKeys(address.website);
                consolePracticePage.getSaveAddressButton(lastAddress).click();
                commonExpects.expectSuccessNotificationShown();
                consolePracticePage.getEditAddressButton(lastAddress).click();
                consolePracticePage.getAddressStreetElement(lastAddress).sendKeys(' update');
                consolePracticePage.getSaveAddressButton(lastAddress).click();
                commonExpects.expectSuccessNotificationShown();
                consolePracticePage.getEditAddressButton(lastAddress).click();
                consolePracticePage.getAddressDeleteButton(lastAddress).click();
                browser.sleep(300);
                consolePracticePage.getAddressDeleteYesButton(lastAddress).click();
                commonExpects.expectSuccessNotificationShown();
            });

            it('check create, edit, delete practice', function(){
                consolePracticePage.getPracticeAddButton().click();
                expect(consolePracticePage.getAddPracticeModal().isDisplayed()).toBe(true);

                consolePracticePage.getNameModalElement().sendKeys(practice.name);
                consolePracticePage.getPracticeTypeModalElement().element(by.cssContainingText('option', practice.type)).click();
                consolePracticePage.getAddressModalElement().sendKeys(address.street);
                consolePracticePage.getCityModalElement().sendKeys(address.city);
                consolePracticePage.getStateModalElement().element(by.cssContainingText('option', practice.state)).click();
                consolePracticePage.getZipModalElement().sendKeys(address.zip);
                consolePracticePage.getPhoneModalElement().sendKeys(address.phone);
                consolePracticePage.getWebsiteModalElement().sendKeys(address.website);
                expect(consolePracticePage.getSaveButtonModalElement().isEnabled()).toBe(true);
                consolePracticePage.getSaveButtonModalElement().click();
                commonExpects.expectSuccessNotificationShown();

                consolePracticePage.getEditPracticeButton().click();
                consolePracticePage.getPracticeName().sendKeys('Edit');
                consolePracticePage.getSavePracticeButton().click();
                commonExpects.expectSuccessNotificationShown();

                consolePracticePage.getPractice().clear();
                consolePracticePage.setPractice(practice.name + 'Edit');
                expect(consolePracticePage.getPracticeDropDownElement().isDisplayed()).toBe(true);
                consolePracticePage.getPracticeDropDownFirstRowElement().click();

                expect(consolePracticePage.getPracticeName().getAttribute('value')).toEqual(practice.name + 'Edit');

                consolePracticePage.getEditPracticeButton().click();
                expect(consolePracticePage.getDeletePracticeButton().isDisplayed()).toBe(true);
                consolePracticePage.getDeletePracticeButton().click();
                browser.sleep(300);
                consolePracticePage.getDeletePracticeYesButton().click();
                expect(consolePracticePage.getDeletePracticeModal().isDisplayed()).toBe(true);
                expect(consolePracticePage.getDeletePracticeNameModal().getAttribute('value')).toEqual(practice.name + 'Edit');
                consolePracticePage.getDeleteButtonModal().click();
                commonExpects.expectSuccessNotificationShown();

            });

            it('check multi specialty practice and user', function(){
                expect(consolePracticePage.getPracticeDropDownElement().isDisplayed()).toBe(false);
                consolePracticePage.setPractice(browser.params.login.correct.practice.name);
                expect(consolePracticePage.getPracticeDropDownElement().isDisplayed()).toBe(true);
                consolePracticePage.getPracticeDropDownFirstRowElement().click();
                expect(consolePracticePage.getPracticeDropDownElement().isDisplayed()).toBe(false);

                expect(consolePracticePage.getPracticeMultispecialtyCheckbox().isDisplayed()).toBe(true);
                expect(consolePracticePage.getPracticeMultispecialtyCheckbox()).toBeTruthy();

                consolePracticePage.getUser().click();
                expect(consolePracticePage.getUserOptionByName(browser.params.login.correct.firstName + ' ' + browser.params.login.correct.lastName).isDisplayed()).toBe(true);
                consolePracticePage.getUserOptionByName(browser.params.login.correct.firstName + ' ' + browser.params.login.correct.lastName).click();
                expect(consolePracticePage.getUserSpecialty().isDisplayed()).toBe(true);
            });

        });
    };
};

module.exports = new ConsolePracticeSpec();
