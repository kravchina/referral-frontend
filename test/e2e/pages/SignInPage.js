var SignInPage = function() {
    this.url = "/#/sign_in";
    
    this.open = function() {
        browser.get(this.url);
    };
    
    this.getEmail = function() {
        return element(by.model('user.email')).getAttribute('value');
    };
    
    this.setEmail = function(email) {
        element(by.model('user.email')).clear().sendKeys(email);
    };
    
    this.getPass = function() {
        return element(by.model('user.password')).getAttribute('value');
    };
    
    this.setPass = function(pass) {
        element(by.model('user.password')).clear().sendKeys(pass);
    };
    
    this.clickLogin = function() {
        element(by.buttonText('Login')).click();
    }
    
};

module.exports = new SignInPage();
