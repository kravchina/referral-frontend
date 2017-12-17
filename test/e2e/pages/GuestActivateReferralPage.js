var GuestActivateReferralPage = function() {
    this.urlPart = "/#/activate_guest_referral?activation_token=";

    this.open = function(activation_token) {
        browser.get(this.urlPart + activation_token);
    };

    this.getOkButton = function() {
        return element(by.css('.panel-success button[href="#/sign_in"]'));
    };
    
    this.getErrorDiv = function() {
        return element(by.css('div.alert-danger'));
    };
    
    this.getErrorCloseButton = function() {
        return element(by.css('.row a[href="#/history"]'));
    };
};

module.exports = new GuestActivateReferralPage();
