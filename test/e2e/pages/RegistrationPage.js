var RegistrationPage = function() {
    this.urlPart = "/#/register/";
    this.urlPromoPart = "/#/register/promo/";

    this.open = function(token) {
        // TODO [ak] inherit this code somehow?..
        browser.get(this.urlPart + token);
    };

    this.openPromo = function(promoCode) {
        browser.get(this.urlPromoPart + promoCode);
    };
    
    // personal info
    
    this.getSalutationElement = function() {
        return element(by.model('invitation.title'));
    };
    
    this.getFirstNameElement = function() {
        return element(by.model('invitation.first_name'));
    };
    
    this.getMiddleInitialElement = function() {
        return element(by.model('invitation.middle_initial'));
    };
    
    this.getLastNameElement = function() {
        return element(by.model('invitation.last_name'));
    };

    this.getSpecialtyElement = function() {
        return element(by.model('invitation.specialty_type_id'));
    };
    
    // practice
    
    this.getPracticeNameElement = function() {
        return element(by.model('practice.name'));
    };
    
    this.getPracticeTypeElement = function() {
        return element(by.model('practice.practice_type_id'));
    };
    
    this.getPracticeAddressStreetElement = function() {
        return element(by.model('practice.addresses_attributes[0].street_line_1'));
    };
    
    this.getPracticeAddressCityElement = function() {
        return element(by.model('practice.addresses_attributes[0].city'));
    };
    
    this.getPracticeAddressStateElement = function() {
        return element(by.model('practice.addresses_attributes[0].state'));
    };
    
    this.getPracticeAddressZipElement = function() {
        return element(by.model('practice.addresses_attributes[0].zip'));
    };
    
    this.getPracticeAddressPhoneElement = function() {
        return element(by.model('practice.addresses_attributes[0].phone'));
    };
    
    this.getPracticeAddressWebsiteElement = function() {
        return element(by.model('practice.addresses_attributes[0].website'));
    };

    // access details
    
    this.getEmailElement = function() {
        return element(by.model('invitation.email'));
    };
    
    this.getPasswordElement = function() {
        return element(by.model('invitation.password'));
    };
    
    this.getPasswordConfirmationElement = function() {
        return element(by.model('invitation.password_confirmation'));
    };
    
    this.getTNCElement = function() {
        return element(by.model('invitation.tnc'));
    };
    
    // final buttons
    
    this.getRegisterButtonElement = function() {
        return element(by.css('button[ng-click="register(practice, invitation)"]'));
    };

    this.getPromoRegisterButtonElement = function() {
        return element(by.css('button[ng-click="createPracticeAndRegister(practice, invitation)"]'));
    };
    
    // post-final dialog
    
    this.getSuccessfulDialogElement = function() {
        return element(by.cssContainingText('div.modal-dialog h4#myModalLabel', 'Registration successful'));
    };
    
    this.getSuccessfulDialogOKButtonElement = function() {
        return element(by.css('button[ng-click="ok()"]'));
    };
    
    this.fillUserFields = function(user, withFirstLast, withEmail) {
        if (withFirstLast) {
            this.getFirstNameElement().sendKeys(user.firstName);
            this.getLastNameElement().sendKeys(user.lastName);
        }
        if (withEmail) {
            this.getEmailElement().sendKeys(user.email);
        }
        this.getSalutationElement().element(by.cssContainingText("option", user.salutation)).click(); // TODO [ak] reuse select option click code
        this.getMiddleInitialElement().sendKeys(user.middleInitial);
        this.getPasswordElement().sendKeys(user.password);
        this.getPasswordConfirmationElement().sendKeys(user.password);
    };
    
    this.fillPracticeFields = function(practice) {
        this.getSpecialtyElement().element(by.cssContainingText("option", practice.type)).click();
        this.getPracticeNameElement().sendKeys(practice.name);
        this.getPracticeAddressStreetElement().sendKeys(practice.address.street1);
        this.getPracticeAddressCityElement().sendKeys(practice.address.city);
        this.getPracticeAddressStateElement().element(by.cssContainingText("option", practice.address.state)).click();
        this.getPracticeAddressZipElement().sendKeys(practice.address.zip);
        this.getPracticeAddressPhoneElement().sendKeys(practice.address.phone);
        this.getPracticeAddressWebsiteElement().sendKeys(practice.address.website);
    };
    
};

module.exports = new RegistrationPage();
