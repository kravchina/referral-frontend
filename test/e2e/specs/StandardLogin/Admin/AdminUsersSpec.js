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

            it('check delete user action', function(){
                element.all(by.css('[delete-button]')).each(function(item){
                    item.click();
                    expect(element.all(by.css('[delete-button].active')).count()).toBe(1);
                });
                element.all(by.css('[delete-button] .link-orange')).last().click();
                expect(element.all(by.css('[delete-button].active')).count()).toBe(0);
            });
            
        });
    };
};

module.exports = new AdminUsersSpec();
