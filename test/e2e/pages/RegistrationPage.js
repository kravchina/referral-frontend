var RegistrationPage = function() {
    this.urlPart = "/#/register/";
    
    this.open = function(token) {
        // TODO [ak] inherit this code somehow?..
        browser.get(this.urlPart + token);
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
    
    // post-final dialog
    
    this.getSuccessfulDialogElement = function() {
        return element(by.cssContainingText('div.modal-dialog h4#myModalLabel', 'Registration successful'));
    };
    
    this.getSuccessfulDialogOKButtonElement = function() {
        return element(by.css('button[ng-click="ok()"]'));
    };
    
};

module.exports = new RegistrationPage();
