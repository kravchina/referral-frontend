var AdminInvitePage = function() {
    this.url = "/#/admin/invite";
    
    this.open = function() {
        browser.get(this.url);
    };
    
};

module.exports = new AdminInvitePage();
