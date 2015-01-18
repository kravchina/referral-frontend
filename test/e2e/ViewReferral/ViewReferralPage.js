var ViewReferralPage = function() {
    this.url = "/#/view_referral";
    
    this.open = function() {
        // TODO [ak] rework into opening the particular referral when we have 'expected' DB
        // assuming we're on history page by default
        element(by.repeater('referral in referrals').row(0)).click();
    };
    
};

module.exports = new ViewReferralPage();
