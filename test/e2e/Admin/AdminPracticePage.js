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

    this.getPracticeSaveButton = function(){
        return element(by.css('button[ng-click="savePractice(practiceForm)"]'));
    };

    this.clickAddAddress = function(){
        element(by.css('button[ng-click="addAddress()"]')).click();
    };

    this.getLastAddress = function(){
        return element.all(by.repeater('address in practice.addresses')).last();
    };

    this.getStreetElement = function(addressForm){
        return addressForm.element(by.model('address.street_line_1'));
    };

    this.getCityElement = function(addressForm){
        return addressForm.element(by.model('address.city'));
    };

    this.getStateElement = function(addressForm){
        return addressForm.element(by.model('address.state'));
    };

    this.getZipElement = function(addressForm){
        return addressForm.element(by.model('address.zip'));
    };

    this.getSubscriptionNotificationModal = function(){
        return element(by.css('div.modal-content'));
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

    this.clickPracticeSave = function(){
        element(by.css("button[ng-click='savePractice(practiceForm)']")).click();
    };

    this.clickRemoveAddress = function(item){
        item.element(by.css('span.dlicons-remove')).click();
    }

};

module.exports = new AdminPracticePage();
