var AddPasswordPage = function() {
    this.urlPart = "/#/add_password/";

    this.open = function(token) {
        // TODO [ak] inherit this code somehow?..
        browser.get(this.urlPart + token);
    };

    this.getPasswordElement = function() {
        return element(by.model('model.password'));
    };
    
    this.getPasswordConfirmationElement = function() {
        return element(by.model('model.password_confirmation'));
    };
    
    this.getSubmitButtonElement = function() {
        return element(by.css('button[ng-click="savePassword(model)"]'));
    };

    this.fillPasswordFields = function(password) {
        this.getPasswordElement().sendKeys(password);
        this.getPasswordConfirmationElement().sendKeys(password);
    };
    
};

module.exports = new AddPasswordPage();
