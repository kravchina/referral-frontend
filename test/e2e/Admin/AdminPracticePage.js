var commonActions = require('../CommonActions');

var AdminPracticePage = function() {
    this.url = "/#/admin/practice";
    
    this.open = function() {
        // TODO [ak] refactor both these things into a special menu-related component
        commonActions.openMenu();
        element(by.linkText('Account Settings')).click();
    };
    
    this.clickPracticeEdit = function() {
        element(by.css('form#formPracticeTab button.btn-edit[title="Edit this section"]')).click();
    };
    
    this.expectPracticeViewMode = function() {
        expect(element(by.css('input.data1[ng-model="practice.name"]')).isPresent()).toBe(true);
    };
    
    this.expectPracticeEditMode = function() {
        expect(element(by.css('input.data1[ng-model="practice.name"]')).isPresent()).toBe(false);
    };
    
    this.setPracticeName = function(value) {
        element(by.model('practice.name')).clear();
        element(by.model('practice.name')).sendKeys(value);
    };
    
    this.getPracticeName = function() {
        return element(by.model('practice.name')).getAttribute('value');
    };
    
};

module.exports = new AdminPracticePage();
