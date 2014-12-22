var CreateReferralPage = function() {
    this.url = "/#/create_referral";
    
    this.open = function() {
        browser.get(this.url);
    };
    
    this.getPatient = function() {
        return element(by.model('patient')).getAttribute('value');
    };
    
    this.setPatient = function(value) {
        element(by.model('patient')).sendKeys(value);
    };
    
};

module.exports = new CreateReferralPage();
