var commonExpects = require('../../../commons/CommonExpects');
var guestRegistrationPage = require('../../../pages/GuestRegistrationPage');

var GuestRegistrationSpec = function() {
    this.run = function() {
        var guest = {
            firstName: 'Bob',
            lastName: 'Guest',
            email: 'bobguest@example.com'
        };
        describe('when guest navigates to Guest Registration', function() {
            beforeEach(function() {
                guestRegistrationPage.open();
                commonExpects.expectProgressDivHidden();
                commonExpects.expectCurrentUrlToBe(guestRegistrationPage.registration_url);
            });

            it('check that page is shown', function() {
                expect(guestRegistrationPage.getFirstNameField().isPresent()).toBe(true);
                expect(guestRegistrationPage.getLastNameField().isPresent()).toBe(true);
                expect(guestRegistrationPage.getEmailField().isPresent()).toBe(true);
                expect(guestRegistrationPage.getContinueButton().isEnabled()).toBe(false);
            });

            it("fill fields and register", function () {
                /*browser.switchTo().frame(0).then(function () {
                    browser.ignoreSynchronization = true;
                    var checkbox = guestRegistrationPage.getReacaptcha();
                    browser.actions().mouseMove(checkbox).perform();
                    browser.sleep(500);
                    checkbox.click();
                    browser.sleep(1000);
                    browser.ignoreSynchronization = false;
                    browser.getAllWindowHandles().then(function(handles){
                        browser.switchTo().window(handles[handles.length - 1]).then(function() {
                            guestRegistrationPage.getFirstNameField().sendKeys(guest.firstName);
                            guestRegistrationPage.getLastNameField().sendKeys(guest.lastName);
                            guestRegistrationPage.getEmailField().sendKeys(guest.email);
                            guestRegistrationPage.getContinueButton().click();
                            browser.sleep(1000);
                            expect(guestRegistrationPage.getModalNotification().isPresent()).toBe(true);
                            guestRegistrationPage.getModalNotificationOkButton().click();
                            expect(guestRegistrationPage.getModalNotification().isPresent()).toBe(false);
                        });
                    });
                });*/

            });
        });

    };
};

module.exports = new GuestRegistrationSpec();