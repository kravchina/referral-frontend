var commonActions = require('../CommonActions');

var AdminPage = function() {
    this.url = "/#/admin";
    
    this.open = function() {
        // TODO [ak] refactor both these things into a special menu-related component
        commonActions.openMenu();
        element(by.linkText('Account Settings')).click();
    };
    
    this.expectPracticeTabOpened = function() {
        expect(element(by.model('practice.name')).isDisplayed()).toBe(true); // this input is displayed on the tab in both view and edit modes
    };
    
    this.clickPracticeTabEdit = function() {
        element(by.css('form#formPracticeTab button.btn-edit[title="Edit this section"]')).click();
    };
    
    this.expectPracticeViewMode = function() {
        expect(element(by.css('input.data1[ng-model="practice.name"]')).isPresent()).toBe(true);
    };
    
    this.expectPracticeEditMode = function() {
        expect(element(by.css('input.data1[ng-model="practice.name"]')).isPresent()).toBe(false);
    };
    
    this.clickUsersTab = function() {
        element.all(by.css('li.ng-isolate-scope>a')).get(1).click();
    };
    
    this.clickInviteColleagueTab = function() {
        element.all(by.css('li.ng-isolate-scope>a')).get(2).click();
    };
    
    this.clickSubscriptionTab = function() {
        element.all(by.css('li.ng-isolate-scope>a')).get(3).click();
    };
    
    this.setPracticeName = function(value) {
        element(by.model('practice.name')).clear();
        element(by.model('practice.name')).sendKeys(value);
    };
    
    this.getPracticeName = function() {
        return element(by.model('practice.name')).getAttribute('value');
    };
    
};

module.exports = new AdminPage();
