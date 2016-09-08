var ViewReferralDraftPage = function() {
    this.url = "/#/create_referral";

    this.open = function() {
        browser.get(this.url + '/' + browser.params.viewReferralDraftId);
    };

    this.getSaveButton = function() {
        return element(by.css('button[ng-click="saveTemplate(model)"]'));
    };

    this.getSignSendButton = function() {
        return element(by.css('button[ng-click="createReferral(model)"]'));
    };

    this.getImageEditLastModifiedButton = function() {
        return element(by.css('span[ng-click="editLastModified($event, attachment)"]'));
    };

    this.getCalendar = function() {
        return element(by.css('.modal-dialog .datepicker'));
    };

    this.getToday = function() {
        return element(by.css('.datepicker table button.btn.active'));
    };

};

module.exports = new ViewReferralDraftPage();
