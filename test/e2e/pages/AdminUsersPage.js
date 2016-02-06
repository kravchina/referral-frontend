var AdminUsersPage = function() {
    this.url = "/#/admin/users";
    
    this.open = function() {
        browser.get(this.url);
    };

    this.getAllDeleteButtons = function(){
        return element.all(by.css('[delete-button]'));
    };

    this.getAllActiveDeleteButtons = function(){
        return element.all(by.css('[delete-button].active'));
    };

    this.getLastActiveNoButton = function(){
        return element.all(by.css('[delete-button] .link-orange')).last();
    };

    this.getEditModalDiscardButton = function(){
        return element(by.css('.modal-dialog button[ng-click="cancel()"].btn'));
    };

    this.getEditModalSaveButton = function(){
        return element(by.css('.modal-dialog button[ng-click="ok(user)"].btn'));
    };

    this.setEmail = function(email) {
        var emailField = element(by.model('user.email'));
        emailField.clear().then(function(){
            emailField.sendKeys(email)});
    };

    this.getEditModalIsAdminCheckbox = function(){
        return element(by.css('.modal-dialog input[name="is_admin"]'));
    };

    this.getEditModalSpecialtySelect = function(){
        return element(by.model('user.specialty_type_id'));
    };
    
};

module.exports = new AdminUsersPage();
