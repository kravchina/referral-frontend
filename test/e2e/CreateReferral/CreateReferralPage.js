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
    
    // provider block
    
    this.getProviderElement = function() {
        return element(by.model('model.referral.dest_provider_id'));
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
