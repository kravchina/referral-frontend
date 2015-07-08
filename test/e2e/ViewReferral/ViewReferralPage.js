var ViewReferralPage = function() {
    this.url = "/#/view_referral";
    
    this.open = function() {
        browser.get(this.url + '/' + browser.params.viewReferralId);
    };
    
    // yes, referring simply by input indices below, because View Referral page doesn't provide other ways of recognizing fields
    
    function getInputByIndex(index) {
        return element.all(by.css('input')).get(index);
    }
    
    function getInputValue(input) {
        return input.getAttribute('value'); // TODO [ak] re-use code globally
    }
    
    function getInputCheckState(input) {
        return input.getAttribute('checked'); // TODO [ak] re-use code globally
    }
    
    this.getPatientValue = function() {
        return getInputValue(getInputByIndex(0));
    };
    
    this.getFromUserValue = function() {
        return getInputValue(getInputByIndex(1));
    };
    
    this.getFromPracticeValue = function() {
        return getInputValue(getInputByIndex(2));
    };
    
    this.getToUserValue = function() {
        return getInputValue(getInputByIndex(3));
    };
    
    this.getToPracticeValue = function() {
        return getInputValue(getInputByIndex(4));
    };
    
    this.getReferralTypeValue = function() {
        return getInputValue(getInputByIndex(5));
    };
    
    this.getProcedureValue = function() {
        return getInputValue(getInputByIndex(6));
    };
    
    this.isTeethCheckedByIndex = function(index) { // TODO [ak] reconsider design. This kind of index -- outside?.. or actually yes, because it's shared between create and view referral pages
        return getInputCheckState(element.all(by.css('input[type="checkbox"]')).get(index));
    };
    
};

module.exports = new ViewReferralPage();
