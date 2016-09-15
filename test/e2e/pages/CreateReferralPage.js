var CreateReferralPage = function() {
    this.url = "/#/create_referral";
    
    this.open = function() {
        browser.get(this.url);
    };
    
    // TODO [ak] try out current implementation, but consider refactoring. Might be better to only operate with simple values here (strings, booleans), not elements
    
    // buttons
    
    this.getButtonSaveElement = function() {
        return element(by.css('button[ng-click="saveTemplate(model)"]'));
    };
    
    this.getButtonSignSendElement = function() {
        return element(by.css('button[ng-click="createReferral(model)"]'));
    };
    
    this.getButtonDiscardElement = function() {
        return element(by.css('button[ng-click="discardTemplate(model.referral)"]'));
    };
    
    this.getCreationConfirmationDialogElement = function() {
        return element(by.css('div.modal-dialog form#formReferralCreate'));
    };
    
    this.getCreationConfirmationDialogCloseButton = function() {
        return element(by.css('form#formReferralCreate div.modal-footer button[ng-click="cancel()"]'));
    };
    
    // patient block
    
    this.getPatientElement = function() {
        return element(by.model('patient'));
    };
    
    this.getPatientDropDownElement = function() {
        return element(by.css('input[name="patient"] ~ ul.dropdown-menu'));
    };
    
    this.getPatientDropDownFirstRowElement = function() {
        return element(by.css('input[name="patient"] ~ ul.dropdown-menu > li:nth-child(1)'));
    };

    this.getPatientCreateButton = function(){
        return element(by.css('button[ng-click="patientDialog()"]'));
    };

    //patient create modal

    this.getPatientCreateModal = function(){
        return element(by.css('#formNewPatient'));
    };

    this.getPatientFirstNameModalElement = function(){
        return element(by.css('#formNewPatient input[name="firstName"]'));
    };

    this.getPatientLastNameModalElement = function(){
        return element(by.css('#formNewPatient input[name="lastName"]'));
    };

    this.getPatientBirthdayModalElement = function(){
        return element(by.css('#formNewPatient input[name="birthday"]'));
    };

    this.getPatientSaveModalButton = function(){
        return element(by.css('#formNewPatient button[ng-click="ok(patient)"]'));
    };

    this.getPatientDiscardModalButton = function(){
        return element(by.css('#formNewPatient button[ng-click="cancel()"]:last-child'));
    };

    //patient deduping modal

    this.getDedupingModal = function(){
        return element(by.css('#formDedupingPatient'));
    };

    this.getDedupingOkModalButton = function(){
        return element(by.css('#formDedupingPatient button[ng-click="ok(patient)"]'));
    };

    this.getDedupingDiscardModalButton = function(){
        return element(by.css('#formDedupingPatient button[ng-click="cancel()"]:last-child'));
    };

    // practice block
    
    this.getPracticeElement = function() {
        return element(by.model('practiceSearchText'));
    };
    
    this.getPracticeDropDownElement = function() {
        return element(by.css('input[name="practice"] ~ ul.dropdown-menu'));
    };
    
    this.getPracticeDropDownFirstRowElement = function() {
        return element(by.css('input[name="practice"] ~ ul.dropdown-menu > li:nth-child(1)'));
    };

    this.getAddressElement = function(){
        return element(by.css('#selectAddress'));
    };
    
    // provider block
    
    this.getProviderElement = function() {
        return element(by.model('model.referral.dest_provider_id'));
    };
    
    this.getInvitedProviderElement = function() {
        return element(by.model('model.referral.dest_provider_invited_id'));
    };
    
    this.getInviteProviderButton = function() {
        return element(by.css('button[ng-click="providerDialog()"]'));
    };
    
    this.getProviderDialogElement = function() {
        return element(by.css('div.modal-dialog form#formNewProvider'));
    };

    this.getProviderDialogFrontDeskRadioButton = function(){
        return element.all(by.model('isProviderInvite')).get(1);
    };
    
    this.getProviderDialogFirstNameElement = function() {
        return element(by.model('model.provider.first_name'));
    };
    
    this.getProviderDialogLastNameElement = function() {
        return element(by.model('model.provider.last_name'));
    };
    
    this.getProviderDialogEmailElement = function() {
        return element(by.css('input[ng-model="model.provider.email"][ng-show="isProviderInvite"]'));
    };

    this.getFrontDeskDialogEmailElement = function() {
        return element(by.css('input[ng-model="model.provider.email"][ng-show="!isProviderInvite"]'));
    };
    
    this.getProviderDialogSendButton = function() {
        return element(by.css('button[ng-click="ok(model.provider)"]'));
    };

    //delete provider modal

    this.getDeleteProviderDialog = function() {
        return element(by.css('div.modal-dialog form#formDeleteProvider'));
    };

    this.getDeleteProviderDialogOkButton = function() {
        return element(by.css('form#formDeleteProvider button[ng-click="ok()"]'));
    };

    this.getDeleteProviderDialogDiscardButton = function() {
        return element(by.css('form#formDeleteProvider button[ng-click="cancel()"]'));
    };

    // referral type block
    
    this.getReferralTypeElement = function() {
        return element(by.model('practiceType'));
    };
    
    // procedure block
    
    this.getProcedureElement = function() {
        return element(by.model('model.referral.procedure_id'));
    };
    
};

module.exports = new CreateReferralPage();
