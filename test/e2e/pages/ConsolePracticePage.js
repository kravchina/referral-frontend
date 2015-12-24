var ConsolePracticePage = function() {
    this.url = "/#/console/practice";

    this.open = function() {
        browser.get(this.url);
    };

    //practice
    this.getPractice = function(){
        return element(by.model('practiceSearch'));
    };

    this.setPractice = function(practiceName){
        element(by.model('practiceSearch')).sendKeys(practiceName);
    };

    this.getPracticeDropDownElement = function() {
        return element(by.css('input[name="practice"] ~ ul.dropdown-menu'));
    };

    this.getPracticeDropDownFirstRowElement = function() {
        return element(by.css('input[name="practice"] ~ ul.dropdown-menu > li:nth-child(1)'));
    };

    this.getPracticeName = function(){
        return element.all(by.css('div[ng-show="practiceSearch"] .form-group input')).get(0);
    };

    //address
    this.getAddAddressButton = function(){
        return element(by.css('button[ng-click="addAddress()"]'));
    };

    this.getLastAddress = function(){
        return element.all(by.repeater('address in practiceSearch.addresses')).last();
    };

    this.toggleAddressForm = function(addressform){
        addressform.element(by.css('h4 a[ng-click="toggleOpen()"]')).click();
    };

    this.getEditAddressButton = function(addressForm){
        return addressForm.element(by.css('button.btn-edit[title="Edit this section"]'));
    };

    this.getSaveAddressButton = function(addressForm){
        return addressForm.element(by.css('button[ng-click="saveAddress(addressForm, address)"]'));
    };

    this.getAddressDeleteButton = function(addressForm){
        return addressForm.element(by.css('.btn-delete'));
    };

    this.getAddressDeleteYesButton = function(addressForm){
        return addressForm.element(by.css('.btn-delete a[ng-click="removeAddress(address)"]'));
    };

    this.getAddressStreetElement = function(addressForm){
        return addressForm.element(by.model('address.street_line_1'));
    };

    this.getAddressCityElement = function(addressForm){
        return addressForm.element(by.model('address.city'));
    };

    this.getAddressPhoneElement = function(addressForm){
        return addressForm.element(by.model('address.phone'));
    };

    this.getAddressStateElement = function(addressForm){
        return addressForm.element(by.model('address.state'));
    };

    this.getAddressZipElement = function(addressForm){
        return addressForm.element(by.model('address.zip'));
    };

    this.getAddressWebsiteElement = function(addressForm){
        return addressForm.element(by.model('address.website'));
    };

    //user
    this.getUser = function(){
        return element(by.css('select[name="user"]'));
    };

    this.getUserOptionByName = function(userName){
        return element(by.cssContainingText('option', userName));
    };

    this.getUserEmail = function(){
        return element.all(by.css('div[ng-show="practiceUser"] .form-group input')).get(1);
    };

    this.getUserEditButton = function(){
        return element(by.css('div[ng-click="editDialog(practiceUser)"]'));
    };

    this.getUserDeleteButton = function(){
        return element(by.css('div.btn-delete'));
    };

};

module.exports = new ConsolePracticePage();
