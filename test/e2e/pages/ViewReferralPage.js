var ViewReferralPage = function() {
    this.url = "/#/view_referral";
    
    this.open = function() {
        browser.get(this.url + '/' + browser.params.viewReferralId);
    };
    
    // yes, referring simply by input indices below, because View Referral page doesn't provide other ways of recognizing fields
    
    function getInputByIndex(index) {
        return element.all(by.css('input')).get(index);
    }
    
    function getInputValue(input) {
        return input.getAttribute('value'); // TODO [ak] re-use code globally
    }
    
    function getInputCheckState(input) {
        return input.getAttribute('checked'); // TODO [ak] re-use code globally
    }
    
    this.getPatientValue = function() {
        return getInputValue(getInputByIndex(0));
    };

    this.getPatientPhoneValue = function() {
        return getInputValue(getInputByIndex(1));
    };
    
    this.getFromUserValue = function() {
        return getInputValue(getInputByIndex(2));
    };
    
    this.getFromPracticeValue = function() {
        return getInputValue(getInputByIndex(3));
    };
    
    this.getToUserValue = function() {
        return getInputValue(getInputByIndex(4));
    };
    
    this.getToPracticeValue = function() {
        return getInputValue(getInputByIndex(5));
    };
    
    this.getReferralTypeValue = function() {
        return getInputValue(getInputByIndex(6));
    };
    
    this.getProcedureValue = function() {
        return getInputValue(getInputByIndex(7));
    };
    
    this.isTeethCheckedByIndex = function(index) { // TODO [ak] reconsider design. This kind of index -- outside?.. or actually yes, because it's shared between create and view referral pages
        return getInputCheckState(element.all(by.css('input[type="checkbox"]')).get(index));
    };
    
    // TODO [ak] create re-usable methods like "get button by ng-click", "get modal dialog by smth"
    
    this.getButtonAddNoteElement = function() {
        return element(by.css('button[ng-click="noteDialog()"]'));
    };
    
    this.getNoteDialogElement = function() {
        return element(by.css('div.modal-dialog form#formNewNote'));
    };
    
    this.getNoteDialogNoteTextAreaElement = function() {
        return element(by.css('form#formNewNote textarea[name="note"]'));
    };
    
    this.getNoteDialogSaveButtonElement = function() {
        return element(by.css('form#formNewNote div.modal-footer button[ng-click="ok(note)"]')); // TODO [ak] re-usable method "get dialog footer button"
    };
    
    this.getLastNoteText = function() {
        return element.all(by.css('div.notes-wrapper li.note-block span.note-content')).last().getText();
    };

    this.getLastNote = function(){
        return element.all(by.css('div.notes-wrapper li.note-block')).last();
    };

    this.getEditNoteButton = function(elem){
        return elem.element(by.css('span.edit'));
    };

    this.getEditNoteDialogElement = function() {
        return element(by.css('div.modal-dialog form#formEditNote'));
    };

    this.getEditNoteDialogNoteTextAreaElement = function() {
        return element(by.css('form#formEditNote textarea[name="note"]'));
    };

    this.getEditNoteDialogSaveButtonElement = function() {
        return element(by.css('form#formEditNote div.modal-footer button[ng-click="ok(note)"]'));
    };

    this.getSelectProviderButton = function(){
        return element(by.css('button[ng-click="editDestProviderDialog()"]'));
    };

    this.getSelectProviderModal = function(){
        return element(by.css('form#formChangeDestProvider'));
    };

    this.getSelectProviderModalSelectAddressElement = function(){
        return element(by.model('referral.address_id'));
    };

    this.getSelectProviderModalSelectProviderElement = function(){
        return element(by.model('providerId'));
    };

    this.getSelectProviderModalDiscardButton = function(){
        return element(by.css('form#formChangeDestProvider .modal-footer button[ng-click="cancel()"]'));
    };

    this.getSelectProviderModalSaveButton = function(){
        return element(by.css('form#formChangeDestProvider button[ng-click="ok(providerId)"]'));
    };
};

module.exports = new ViewReferralPage();
