var GuestRegistartionPage = function() {
    this.registration_url = "/#/guest/registration/_TestPidForGuest_";

    this.open = function() {
        browser.get(this.registration_url);
    };

    this.getFirstNameField = function() {
        return element(by.css('form[name="guestForm"] input[name="first_name"]'));
    };

    this.getLastNameField = function(){
        return element(by.css('form[name="guestForm"] input[name="last_name"]'));
    };

    this.getEmailField = function(){
        return element(by.css('form[name="guestForm"] input[name="email"]'));
    };

    this.getReacaptcha = function(){
        return element(by.css('.recaptcha-checkbox'));
    };

    this.getCheckedReacaptcha = function(){
        return element(by.css('.recaptcha-checkbox.recaptcha-checkbox-checked'));
    };

    this.getContinueButton = function(){
        return element(by.css('form[name="guestForm"] button[ng-click="continue(guest)"]'));
    };

    this.getModalNotification = function(){
        return element(by.css('div.modal-dialog'));
    };

    this.getModalNotificationOkButton = function(){
        return element(by.css('div.modal-dialog button[ng-click="ok()"]'));
    };
};

module.exports = new GuestRegistartionPage();
