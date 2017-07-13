var GuestReferralPage = function() {
    this.url = "/#/guest/_ConfirmToken_?pid=_TestPidForGuest_";

    this.open = function() {
        browser.get(this.url);
    };

    this.getSuccessModal = function() {
        return element(by.css('#formReferralCreate'));
    };

    this.getSuccessModalCloseButton = function() {
        return element(by.css('#formReferralCreate .modal-footer button[ng-click="cancel()"]'));
    };

};

module.exports = new GuestReferralPage();
