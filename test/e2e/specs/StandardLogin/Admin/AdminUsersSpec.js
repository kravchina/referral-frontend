var commonExpects = require('../../../commons/CommonExpects');
var commonActions = require('../../../commons/CommonActions');
var adminUsersPage = require('../../../pages/AdminUsersPage');
var historyPage = require('../../../pages/HistoryPage');
var signInPage = require('../../../pages/SignInPage');
var registrationPage = require('../../../pages/RegistrationPage');

var AdminUsersSpec = function() {
    this.run = function() {
        describe('when user navigates to Admin Users', function() {
            beforeEach(function() {
                adminUsersPage.open();
                commonExpects.expectProgressDivHidden();
                commonExpects.expectCurrentUrlToBe(adminUsersPage.url);
            });
            
            it('shows Users page', function() {
                expect(element(by.css('th.cell-user')).isDisplayed()).toBe(true);
            });

            it('check delete user action', function(){
                adminUsersPage.getAllDeleteButtons().each(function(item){
                    item.click();
                    expect(adminUsersPage.getAllActiveDeleteButtons().count()).toBe(1);
                });
                browser.sleep(200);
                adminUsersPage.getLastActiveNoButton().click();
                expect(adminUsersPage.getAllActiveDeleteButtons().count()).toBe(0);
            });

            it('check salutation, addresses, is_admin checkbox is present on edit user dialog', function() {
                element.all(by.css('[ng-repeat="user in practice.users.concat(invitedUsers)"]')).filter(function (item) {
                    return item.all(by.css('td')).get(1).getText().then(function (text) {
                        return text == browser.params.login.correct.email;
                    });
                }).then(function (rows) {
                    rows[0].element(by.css('.dlicons-pencil')).click();
                    element(by.css('.modal-dialog')).isDisplayed().then(function () {
                        expect(adminUsersPage.getEditModalIsAdminCheckbox()).toBeTruthy();
                        expect(adminUsersPage.getEditModalFirstAddress().isEnabled()).toBe(false);
                        expect(adminUsersPage.getEditModalFirstAddress().getAttribute('checked')).toBeTruthy();
                        expect(adminUsersPage.getEditModalSalutation().isPresent()).toBe(true);
                        adminUsersPage.getEditModalDiscardButton().click();
                    });
                });
            });

            it('opens edit other user dialog, changes email, saves it successfully and stays logged in', function(){
                element.all(by.css('[ng-repeat="user in practice.users.concat(invitedUsers)"]'))
                    .then(function (rows) {
                    rows[1].element(by.css('.dlicons-pencil')).click();
                    element(by.css('.modal-dialog')).isDisplayed().then(function () {
                        adminUsersPage.setEmail('other@update.email');
                        adminUsersPage.getEditModalSaveButton().click().then(function(){
                            commonExpects.expectSuccessNotificationShown();
                            commonExpects.expectCurrentUrlToBe(adminUsersPage.url);
                            commonActions.clickLogo();
                            commonExpects.expectCurrentUrlToBe(historyPage.url);
                        });

                    });
                });
            });
        });
    };
};

module.exports = new AdminUsersSpec();
