var commonExpects = require('../../../commons/CommonExpects');
var adminSubscriptionPage = require('../../../pages/AdminSubscriptionPage');

var AdminSubscriptionSpec = function() {
    this.run = function() {
        describe('when user navigates to Admin Subscription', function() {
            beforeEach(function() {
                adminSubscriptionPage.open();
                commonExpects.expectProgressDivHidden();
                commonExpects.expectCurrentUrlToBe(adminSubscriptionPage.url);
            });
            
            it('shows Subscription page', function() {
                expect(element(by.css('div#admintabAccount form#formAccountTab h2')).isDisplayed()).toBe(true);
            });
            
        });
    };
};

module.exports = new AdminSubscriptionSpec();
