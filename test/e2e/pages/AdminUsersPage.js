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

    this.getEditModalFirstAddress = function(){
        return element(by.repeater('address in practiceAddresses').row(0)).element(by.css('input[type="checkbox"]'));
    };

    this.getEditModalSpecialtySelect = function(){
        return element(by.model('user.specialty_type_id'));
    };

    this.getEditModalSalutation = function(){
        return element(by.css('#selectSalutation'));
    };

    this.getEditModalNoLogin = function(){
        return element(by.css('#editNoLoginUserForm'));
    };

    this.getEditModalNoLoginSetupLoginButton = function(){
        return element(by.css('#editNoLoginUserForm button[ng-click="setupLogin(user)"].btn'));
    };

    this.getEditModalNoLoginSaveButton = function(){
        return element(by.css('#editNoLoginUserForm button[ng-click="save(user)"].btn'));
    };

    this.getEditModalNoLoginDiscardButton = function(){
        return element(by.css('#editNoLoginUserForm button[ng-click="cancel()"].btn'));
    };

    this.getSetupLoginModal = function(){
      return element(by.css('#setupLoginForm'));
    };

    this.getSetupLoginModalDiscardButton = function(){
      return element(by.css('#setupLoginForm button[ng-click="cancel()"].btn'));
    };

    this.getSetupLoginModalEmail = function(){
      return element(by.css('#setupLoginForm button[ng-click="cancel()"].btn'));
    };

    this.getAddUserButton = function(){
        return element(by.css('button[ng-click="usersDialog()"]'));
    };

    this.getAddModal = function(){
        return element(by.css('#formNewuser'));
    };

    this.getAddModalFirstNameElement = function(){
        return element(by.css('#formNewuser input[name="firstName"]'));
    };

    this.getAddModalLastNameElement = function(){
        return element(by.css('#formNewuser input[name="lastName"]'));
    };

    this.getAddModalNoLoginRadioElement = function(){
        return element.all(by.css('#formNewuser input[ng-model="isInvite"]')).last();
    };

    this.getAddModalEmailElement = function(){
        return element(by.css('#formNewuser input[name="email"]'));
    };

    this.getAddModalAdminRadioElement = function(){
        return element(by.css('#formNewuser')).element(by.repeater('item in radios').row(0).column('item.name'));
    };

    this.getAddModalSendInviteButton = function(){
        return element(by.css('#formNewuser button[ng-click="ok(user)"][ng-show="isInvite"]'));
    };

    this.getAddModalSaveButton = function(){
        return element(by.css('#formNewuser button[ng-click="ok(user)"][ng-show="!isInvite"]'));
    };

    this.getAddModalSpecialtyElement = function() {
        return element(by.model('practiceType'));
    };

    this.getAddModalDiscardButton = function(){
        return element(by.css('#formNewUser button[ng-click="cancel()"]'));
    };

    this.getInviteUserResultModal = function(){
        return element(by.css('#inviteUserResult'));
    };

    this.getInviteUserResultOkButton = function(){
        return element(by.css('#inviteUserResult button[ng-click="ok()"]'));
    };
};

module.exports = new AdminUsersPage();
