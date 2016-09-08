var ConsolePracticePage = function() {
    this.url = "/#/console/practice/";

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
        return element.all(by.css('div[ng-if="practiceSearch"] .form-group input')).get(0);
    };

    this.getPracticeAddButton = function(){
        return element(by.css('button[ng-click="createPractice()"]'));
    };

    this.getEditPracticeButton = function(){
        return element(by.css('#formConsolePractice .console-practice-btns .btn-edit'));
    };

    this.getSavePracticeButton = function(){
        return element(by.css('#formConsolePractice button[ng-click="savePractice(practiceForm, destinationPractice)"]'));
    };

    this.getDeletePracticeButton = function(){
        return element(by.css('#formConsolePractice .btn-delete'));
    };

    this.getDeletePracticeYesButton = function(){
        return element(by.css('#formConsolePractice .btn-delete a[ng-click="removePractice(destinationPractice)"]'));
    };

    this.getPracticeTypeSelect = function(){
        return element(by.css('#formConsolePractice select[name="practiceType"]'));
    };

    //delete practice modal
    this.getDeletePracticeModal = function(){
        return element(by.css('#formPracticeDelete'));
    };

    this.getDeletePracticeNameModal = function(){
        return element(by.css('#formPracticeDelete input[name="name"]'));
    };

    this.getDeleteButtonModal = function(){
        return element(by.css('#formPracticeDelete button[ng-click="deletePractice()"]'));
    };

    this.getDiscardButtonModal = function(){
        return element(by.css('#formPracticeDelete button[ng-click="cancel()"]'));
    };

    //add practice modal
    this.getAddPracticeModal = function(){
        return element(by.css('#formNewPractice'));
    };

    this.getNameModalElement = function(){
        return element(by.css('#formNewPractice input[name="name"]'));
    };

    this.getPracticeTypeModalElement = function(){
        return element(by.css('#formNewPractice select[name="practiceType"]'));
    };

    this.getAddressModalElement = function(){
        return element(by.css('#formNewPractice input[name="address"]'));
    };

    this.getCityModalElement = function(){
        return element(by.css('#formNewPractice input[name="city"]'));
    };

    this.getStateModalElement = function(){
        return element(by.css('#formNewPractice select[name="state"]'));
    };

    this.getZipModalElement = function(){
        return element(by.css('#formNewPractice input[name="zip"]'));
    };

    this.getPhoneModalElement = function(){
        return element(by.css('#formNewPractice input[name="phone"]'));
    };

    this.getWebsiteModalElement = function(){
        return element(by.css('#formNewPractice input[name="website"]'));
    };

    this.getSaveButtonModalElement = function(){
        return element(by.css('#formNewPractice button[ng-click="ok(practice)"]'));
    };

    this.getDiscardButtonModalElement = function(){
        return element(by.css('#formNewPractice button[ng-click="cancel()"]'));
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

    this.getUserSpecialty = function(){
        return element(by.css('input[name="userSpecialty"]'));
    };

    this.getUserEditButton = function(){
        return element(by.css('div[ng-click="editDialog(practiceUser)"]'));
    };

    this.getUserDeleteButton = function(){
        return element(by.css('div.btn-delete'));
    };

    this.getInviteDialogButton = function(){
        return element(by.css('button[ng-click="inviteDialog()"]'));
    };

    //invite dialog
    this.getInviteDialog = function(){
        return element(by.css('#formNewProvider'));
    };

    this.getInviteDialogFirstName = function(){
        return element(by.css('#formNewProvider input[name="firstName"]'));
    };

    this.getInviteDialogLastName = function(){
        return element(by.css('#formNewProvider input[name="lastName"]'));
    };

    this.getInviteDialogEmail = function(){
        return element.all(by.css('#formNewProvider input[name="email"]')).get(0);
    };

    this.getInviteDialogSendButton = function(){
        return element(by.css('#formNewProvider button[ng-click="ok(model.provider)"]'));
    };

    this.getInviteDialogDiscardButton =  function(){
        return element(by.css('#formNewProvider button[ng-click="cancel()"]'));
    };

    //edit user dialog
    this.getEditUserDialog = function(){
        return element(by.css('#formEditUser'));
    };

    this.getEditUserDialogButton = function(){
        return element(by.css('div[ng-click="editDialog(practiceUser)"]'));
    };

    this.getEditUserDialogSalutation = function(){
        return element(by.css('#selectSalutation'));
    };

    this.getEditUserDialogSaveButton = function(){
        return element(by.css('#formEditUser button[ng-click="ok(user)"]'));
    };

    this.getEditUserDialogDiscardButton = function(){
        return element(by.css('#formEditUser button[ng-click="cancel()"].btn'));
    };

};

module.exports = new ConsolePracticePage();
