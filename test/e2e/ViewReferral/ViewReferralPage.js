var ViewReferralPage = function() {
    this.url = "/#/view_referral";
    
    this.open = function() {
        browser.get(this.url + '/' + browser.params.viewReferralId);
    };
    
};

module.exports = new ViewReferralPage();
