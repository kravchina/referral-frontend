var GuestPage = function() {
    var pid = '__trialPublicId__';
    this.guest_sign_in_url = "/#/sign_in?pid=" + pid;
    this.guest_referral_url = "/#/create_guest_referral?pid=" + pid;

    this.openSignIn = function() {
        browser.get(this.guest_sign_in_url);
    };

    this.continueGuestLink = function() {
        return element(by.css('a[ui-sref="createGuestReferral({pid: pid})"]'));
    };

    this.openReferral = function() {
        browser.get(this.guest_referral_url);
    };

    this.clickLogo = function() {
        element(by.css('.navbar-header a')).click()
    };

    // referral page

    // guest
    this.guestFirstNameField = function() {
        return element(by.model('guest.first_name'));
    };

    this.guestLastNameField = function() {
        return element(by.model('guest.last_name'));
    };

    this.guestEmailNameField = function() {
        return element(by.model('guest.email'));
    };

    // patient
    this.patientFirstNameField = function() {
        return element(by.model('patient.first_name'));
    };

    this.patientLastNameField = function() {
        return element(by.model('patient.last_name'));
    };

    this.patientPhoneNameField = function() {
        return element(by.model('patient.phone'));
    };

    this.patientBirthdayNameField = function() {
        return element(by.model('patient.birthday'));
    };

    // practice
    this.practiceField = function() {
        return element(by.model('practiceSearchText'));
    };

    this.addressSelectField = function() {
        return element(by.model('model.referral.address_id'));
    };

    this.destProviderSelectField = function() {
        return element(by.model('model.referral.dest_provider_id'));
    };

    this.practiceTypeSelectField = function() {
        return element(by.model('practiceType'));
    };

    this.procedureSelectField = function() {
        return element(by.model('model.referral.procedure_id'));
    };

    this.getButtonSignSendElement = function() {
        return element(by.css('button[ng-click="createReferral(model)"]'));
    };

    this.getGuestReferralSuccessModal = function() {
        return element(by.css('#guestReferralModal'));
    };

    this.getSuccessModalOkButton = function() {
        return element(by.css('.modal button[ng-click="ok()"]'));
    };


};

module.exports = new GuestPage();
