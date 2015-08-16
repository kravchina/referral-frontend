var AdminUsersPage = function() {
    this.url = "/#/admin/users";
    
    this.open = function() {
        browser.get(this.url);
    };
    
};

module.exports = new AdminUsersPage();
