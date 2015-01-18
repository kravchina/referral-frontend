var ViewReferralPage = function() {
    this.url = "/#/view_referral";
    
    this.open = function() {
        browser.get(this.url + '/215');
    };
    
};

module.exports = new ViewReferralPage();
