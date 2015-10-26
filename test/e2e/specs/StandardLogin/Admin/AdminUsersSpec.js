var commonExpects = require('../../../commons/CommonExpects');
var adminUsersPage = require('../../../pages/AdminUsersPage');

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

            it('check is_admin checkbox is present on edit user dialog', function(){
                element.all(by.css('[ng-repeat="user in practice.users.concat(invitedUsers)"]')).filter(function(item){
                    return item.all(by.css('td')).get(1).getText().then(function(text){
                        return text == browser.params.login.correct.email;
                    });
                }).then(function(rows){
                    rows[0].element(by.css('.dlicons-pencil')).click();
                    element(by.css('.modal-dialog')).isDisplayed().then(function(){
                        expect(element(by.css('.modal-dialog input[name="is_admin"]'))).toBeTruthy();
                        element(by.css('.modal-dialog button[ng-click="cancel()"]')).click();
                    });
                });
            });
            
        });
    };
};

module.exports = new AdminUsersSpec();
