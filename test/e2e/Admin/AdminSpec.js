var commonActions = require('../CommonActions');
var commonExpects = require('../CommonExpects');
var adminPage = require('./AdminPage');
var historyPage = require('../History/HistoryPage');

var AdminSpec = function() {
    this.run = function() {
        describe('when user navigates to Admin', function() {
            beforeEach(function() {
                adminPage.open();
                commonExpects.expectProgressDivHidden();
                commonExpects.expectCurrentUrlToBe(adminPage.url);
            });
            
            it('shows Admin page with Practice tab opened in Practice view mode', function() {
                expect(element(by.css('#adminTabContent')).isPresent()).toBe(true);
                adminPage.expectPracticeTabOpened();
                adminPage.expectPracticeViewMode();
                // TODO [ak] add more criteria of recognizing Admin page
            });
            
            describe('when user tries to enter Practice edit mode', function() {
                beforeEach(function() {
                    adminPage.clickPracticeTabEdit();
                });
                
                it('enters Practice edit mode', function() {
                    adminPage.expectPracticeEditMode();
                });
                
                it('allows navigation away without unsaved changes warning', function() {
                    commonActions.clickLogo();
                    commonExpects.expectProgressDivHidden();
                    commonExpects.expectCurrentUrlToBe(historyPage.url);
                });
                
                describe('when user changes Practice Name and tries to leave', function() {
                    var dataStr = 'asdf';
                    
                    beforeEach(function() {
                        adminPage.setPracticeName(dataStr);
                        expect(adminPage.getPracticeName()).toEqual(dataStr);
                        commonActions.clickLogo();
                    });
                    
                    var alertDialog; // TODO [ak] extract common alert functions somewhere, re-use code
                    
                    describe('when user accepts the unsaved changes alert', function() {
                        beforeEach(function() {
                            alertDialog = browser.switchTo().alert();
                            expect(alertDialog.getText()).toContain('unsaved');
                            expect(alertDialog.accept).toBeDefined();
                            alertDialog.accept();
                        });
                        
                        it('navigates away', function() {
                            commonExpects.expectProgressDivHidden();
                            commonExpects.expectCurrentUrlToBe(historyPage.url);
                        });
                    });
                    
                    describe('when user dismisses the unsaved changes alert', function() {
                        beforeEach(function() {
                            alertDialog = browser.switchTo().alert();
                            expect(alertDialog.getText()).toContain('unsaved');
                            expect(alertDialog.dismiss).toBeDefined();
                            alertDialog.dismiss();
                        });
                        
                        it('stays on page with data kept', function() {
                            commonExpects.expectCurrentUrlToBe(adminPage.url);
                            expect(adminPage.getPracticeName()).toEqual(dataStr);
                        });
                        
                        afterEach(function() {
                            // manually getting out of the page and accepting the alert to allow log out and other flows
                            commonActions.clickLogo();
                            alertDialog = browser.switchTo().alert();
                            alertDialog.accept();
                            commonExpects.expectProgressDivHidden();
                            commonExpects.expectCurrentUrlToBe(historyPage.url);
                        });
                    });
                    
                });
                
            });
            
            describe('when user clicks Users tab', function() {
                beforeEach(function() {
                    adminPage.clickUsersTab();
                });
                
                it('shows Users tab', function() {
                    expect(element(by.css('th.cell-user')).isDisplayed()).toBe(true);
                });
            });
            
            describe('when user clicks Invite Colleague tab', function() {
                beforeEach(function() {
                    adminPage.clickInviteColleagueTab();
                });
                
                it('shows Invite Colleague tab', function() {
                    expect(element(by.css('th.cell-provider')).isDisplayed()).toBe(true);
                });
            });
            
            describe('when user clicks Subscription tab', function() {
                beforeEach(function() {
                    adminPage.clickSubscriptionTab();
                });
                
                it('shows Subscription tab', function() {
                    expect(element(by.css('div#sectUpgrade>button[ng-click="upgradeDialog()"]')).isDisplayed()).toBe(true);
                });
            });
            
        });
    };
};

module.exports = new AdminSpec();
