var commonActions = require('../../../commons/CommonActions');
var commonExpects = require('../../../commons/CommonExpects');
var viewReferralPage = require('../../../pages/ViewReferralPage');

var ViewReferralSpec = function() {
    this.run = function() {
        describe('when user navigates to View Referral', function() {
            
            beforeEach(function() {
                viewReferralPage.open();
                commonExpects.expectProgressDivHidden(); // TODO [ak] consider placing these expects into open(). And for all pages
                commonExpects.expectCurrentUrlToContain(viewReferralPage.url);
            });
            
            it('shows View Referral page', function() {
                expect(element(by.css('button[ng-click="savePdf()"]')).isPresent()).toBe(true); // TODO [ak] consider adding more criteria of recognizing the page
            });
            
            // test for #86373800
            describe('when user clicks the attachment', function() {
                
                beforeEach(function() {
                    element(by.css('div.attachments-wrapper ul > li:nth-child(1) > a[target="_blank"]')).click();
                });
                
                it('opens a new tab with image in it', function(done) {
                    var d = protractor.promise.defer(); // refactored from simple getAllWindowHandles().then() to this after getting second handle as '' from time to time
                    var newWindowGotHandle = false;
                    
                    function checkWindowHandles() {
                        browser.getAllWindowHandles().then(function(handles) {
                            if (handles[handles.length-1] !== '') {
                                newWindowGotHandle = true;
                                d.fulfill(handles);
                            } else {
                                setTimeout(checkWindowHandles, 1000)
                            }
                        });
                    };
                    
                    setTimeout(checkWindowHandles, 1000);
                    
                    d.promise.then(function(handles) {
                        // assuming we now have exactly two tabs
                        browser.switchTo().window(handles[1]).then(function() {
                            expect(browser.driver.getCurrentUrl()).toContain(browser.params.attachmentUrlPart);
                            browser.ignoreSynchronization = true;
                            browser.wait(EC.visibilityOf(element(by.tagName('img'))), 5000).then(function(present) {
                                expect(present).toBeTruthy();
                                browser.close();
                                // switching back to first tab, otherwise EVERYTHING CRASHES!!11
                                browser.switchTo().window(handles[0]).then(function() {
                                    browser.ignoreSynchronization = false;
                                    done(); // makes Jasmine wait for all these nested promises
                                });
                            });
                        });
                    });
                });
                
            });

            it('check select provider', function(){
                viewReferralPage.getSelectProviderButton().click();

                expect(viewReferralPage.getSelectProviderModal().isDisplayed()).toBe(true);
                expect(viewReferralPage.getSelectProviderModalSelectAddressElement().isPresent()).toBe(true);
                expect(viewReferralPage.getSelectProviderModalSelectProviderElement().isPresent()).toBe(true);

                viewReferralPage.getSelectProviderModalDiscardButton().click();
            });
            
            it('shows patient copy button on the page', function() {
                expect(element(by.css('button[ng-click="savePatientPdf()"]')).isPresent()).toBe(true);
            });
            
            describe('when user adds a note', function() {
                var noteText = "note @ " + new Date();
                
                beforeEach(function() {
                    viewReferralPage.getButtonAddNoteElement().click();
                    expect(viewReferralPage.getNoteDialogElement().isDisplayed()).toBe(true);
                    viewReferralPage.getNoteDialogNoteTextAreaElement().sendKeys(noteText);
                    viewReferralPage.getNoteDialogSaveButtonElement().click();
                    expect(viewReferralPage.getNoteDialogElement().isPresent()).toBe(false);
                });
                
                it('shows the new note at the bottom of the list', function() {
                    expect(viewReferralPage.getLastNoteText()).toEqual(noteText);
                });
            });

            describe('when user edit a note', function(){

                it('select the last note and edit it', function(){
                    var testText = 'Test Note Edit';

                    viewReferralPage.getEditNoteButton(viewReferralPage.getLastNote()).click();
                    expect(viewReferralPage.getEditNoteDialogElement().isDisplayed()).toBe(true);
                    viewReferralPage.getEditNoteDialogNoteTextAreaElement().clear();
                    viewReferralPage.getEditNoteDialogNoteTextAreaElement().sendKeys(testText);
                    viewReferralPage.getEditNoteDialogSaveButtonElement().click();
                    expect(viewReferralPage.getLastNoteText()).toEqual(testText);
                });
            });

            describe('when user delete attachment', function(){

                it('show confirmation modal', function(){
                    element(by.css('div.attachments-wrapper ul > li:nth-child(1) > button[ng-click="deleteAttachment(attachment)"]')).click();

                    expect(viewReferralPage.getConfirmationModal().isDisplayed()).toBe(true);
                    viewReferralPage.getConfirmationNoButton().click();
                    expect(viewReferralPage.getConfirmationModal().isPresent()).toBe(false);
                });
            });

        });
    };
};

module.exports = new ViewReferralSpec();
