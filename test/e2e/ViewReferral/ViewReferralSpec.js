var commonActions = require('../CommonActions');
var commonExpects = require('../CommonExpects');
var viewReferralPage = require('./ViewReferralPage');

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
                    element(by.repeater('attachment in referral.attachments').row(0)).click();
                });
                
                it('opens a new tab with image in it', function(done) {
                    browser.getAllWindowHandles().then(function(handles) {
                        // assuming we now have exactly two tabs
                        browser.switchTo().window(handles[1]).then(function() {
                            expect(browser.driver.getCurrentUrl()).toContain('https://referral-server.herokuapp.com/attachment/?file=');
                            browser.driver.isElementPresent(by.css('img')).then(function(present) {
                                expect(present).toBeTruthy();
                                browser.close();
                                // switching back to first tab, otherwise EVERYTHING CRASHES!!11
                                browser.switchTo().window(handles[0]).then(function() {
                                    done(); // makes Jasmine wait for all these nested promises
                                });
                            });
                        });
                    });
                });
                
            });
            
            it('shows patient copy button on the page', function() {
                expect(element(by.css('button[ng-click="savePatientPdf()"]')).isPresent()).toBe(true);
            });
            
        });
    };
};

module.exports = new ViewReferralSpec();
