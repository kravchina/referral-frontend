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
    
    this.getNewPracticeButtonElement = function() {
        return element(by.css('button[ng-click="practiceDialog()"]'));
    };
    
    this.getPracticeDialogElement = function() {
        return element(by.css('div.modal-dialog form#formNewPatient'));
    };
    
    this.getPracticeDialogPracticeNameElement = function() {
        return element(by.model('practice.name'));
    };
    
    this.getPracticeDialogPracticeTypeElement = function() {
        return element(by.model('practice.practice_type_id'));
    };
    
    this.getPracticeDialogPracticeAddressStreetElement = function() {
        return element(by.model('address.street_line_1'));
    };
    
    this.getPracticeDialogPracticeAddressCityElement = function() {
        return element(by.model('address.city'));
    };
    
    this.getPracticeDialogPracticeAddressStateElement = function() {
        return element(by.model('address.state'));
    };
    
    this.getPracticeDialogPracticeAddressZipElement = function() {
        return element(by.model('address.zip'));
    };
    
    this.getPracticeDialogPracticeAddressPhoneElement = function() {
        return element(by.model('address.phone'));
    };
    
    this.getPracticeDialogPracticeAddressWebsiteElement = function() {
        return element(by.model('address.website'));
    };
    
    this.getPracticeDialogSaveButtonElement = function() {
        return element(by.css('button[ng-click="ok(practice)"]'));
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
        return element(by.css('button[ng-click="register(invitation)"]'));
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
