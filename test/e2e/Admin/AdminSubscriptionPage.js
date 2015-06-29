var AdminSubscriptionPage = function() {
    this.url = "/#/admin/subscription";
    
    this.open = function() {
        browser.get(this.url);
    };
    
};

module.exports = new AdminSubscriptionPage();
