var commonActions = require('../../commons/CommonActions');
var commonExpects = require('../../commons/CommonExpects');
var guestPage = require('../../pages/GuestPage');
var guestActivateReferralPage = require('../../pages/GuestActivateReferralPage');
var signInPage = require('../../pages/SignInPage');
var registrationPage = require('../../pages/RegistrationPage');
var historyPage = require('../../pages/HistoryPage');
var consolePracticePage = require('../../pages/ConsolePracticePage');

var GuestReferralSpec = function() {
    this.run = function() {
        var emailAndActivationToken = (new Date()).getTime().toString();
        var guest = {
            // guest fields
            firstName: 'GuestFirst',
            lastName: 'GuestLast',
            email: emailAndActivationToken + '@test.com',
            
            // registration fields
            salutation: "Dr.",
            middleInitial: "K",
            password: "12345678"
        };

        var patient = {
            firstName: 'Mark',
            lastName: 'Pupkin',
            phone: '1111111111',
            birthday: '2/2/1968'
        };

        var referral = {
            provider: 'Trial User',
            referralType: 'Endodontics',
            procedure: 'Trauma'
        };
        
        var guestPractice = {
            name: "Guest-to-user practice",
            type: "General Dentistry",
            address: {
                street1: "Guest street",
                city: "Anchorage",
                state: "Alaska",
                short_state: "AK",
                zip: "99444",
                phone: "901-111-4114",
                website: "guest.example.com"
            }
        };
        
        describe('guest visits guest create referral page', function() {

            beforeEach(function() {
                guestPage.openReferral();
                commonExpects.expectProgressDivHidden();
                commonExpects.expectMenuHidden();
                commonExpects.expectCurrentUrlToBe(guestPage.guest_referral_url);
            });

            it('shows the page fields', function() {
                expect(guestPage.guestFirstNameField().isPresent()).toBe(true);
                expect(guestPage.guestLastNameField().isPresent()).toBe(true);
                expect(guestPage.guestEmailNameField().isPresent()).toBe(true);

                expect(guestPage.patientFirstNameField().isPresent()).toBe(true);
                expect(guestPage.patientLastNameField().isPresent()).toBe(true);
                expect(guestPage.patientPhoneNameField().isPresent()).toBe(true);
                expect(guestPage.patientBirthdayNameField().isPresent()).toBe(true);

                expect(guestPage.practiceField().isPresent()).toBe(true);
                expect(guestPage.practiceField().isEnabled()).toBe(false);

                expect(guestPage.addressSelectField().isPresent()).toBe(true);
                expect(guestPage.addressSelectField().isEnabled()).toBe(false);

                expect(guestPage.destProviderSelectField().isPresent()).toBe(true);
                expect(guestPage.practiceTypeSelectField().isPresent()).toBe(true);
                expect(guestPage.procedureSelectField().isPresent()).toBe(true);

                commonActions.clickLogo();
                browser.wait(EC.alertIsPresent(), 10000);
                var alertDialog = browser.switchTo().alert();
                alertDialog.accept();

            });

            it('allows to Sign&Send and activate the referral', function() {
                // fill in fields and Sign&Send
                guestPage.guestFirstNameField().sendKeys(guest.firstName);
                guestPage.guestLastNameField().sendKeys(guest.lastName);
                guestPage.guestEmailNameField().sendKeys(guest.email);

                guestPage.patientFirstNameField().sendKeys(patient.firstName);
                guestPage.patientLastNameField().sendKeys(patient.lastName);
                guestPage.patientPhoneNameField().sendKeys(patient.phone);
                guestPage.patientBirthdayNameField().sendKeys(patient.birthday);

                expect(guestPage.practiceField().isEnabled()).toBe(false);

                guestPage.destProviderSelectField().element(by.cssContainingText("option", referral.provider)).click();
                expect(guestPage.destProviderSelectField().element(by.css("option:checked")).getText()).toEqual(referral.provider);

                guestPage.practiceTypeSelectField().element(by.cssContainingText("option", referral.referralType)).click();
                expect(guestPage.practiceTypeSelectField().element(by.css("option:checked")).getText()).toEqual(referral.referralType);

                guestPage.procedureSelectField().element(by.cssContainingText("option", referral.procedure)).click();
                expect(guestPage.procedureSelectField().element(by.css("option:checked")).getText()).toEqual(referral.procedure);

                expect(guestPage.getButtonSignSendElement().isEnabled()).toBe(true);
                guestPage.getButtonSignSendElement().click();
                
                // close the modal
                expect(guestPage.getGuestReferralSuccessModal().isDisplayed()).toBe(true);
                guestPage.getSuccessModalOkButton().click();
                
                commonExpects.expectProgressDivHidden();
                commonExpects.expectMenuHidden();
                commonExpects.expectCurrentUrlToBe(signInPage.url);
                
                // activate
                guestActivateReferralPage.open(emailAndActivationToken);
                guestActivateReferralPage.getOkButton().click();
                commonExpects.expectProgressDivHidden();
                commonExpects.expectMenuHidden();
                commonExpects.expectCurrentUrlToBe(signInPage.url);
                
                // make sure the same referral cannot be activated again
                guestActivateReferralPage.open(emailAndActivationToken);
                expect(guestActivateReferralPage.getErrorDiv().isPresent()).toBe(true);
                browser.wait(EC.elementToBeClickable(guestActivateReferralPage.getErrorCloseButton()), 5000);
                guestActivateReferralPage.getErrorCloseButton().click();
                commonExpects.expectProgressDivHidden();
                commonExpects.expectMenuHidden();
                commonExpects.expectCurrentUrlToBe(signInPage.url);
                
                // open the conversion page
                registrationPage.openGuestConversion(emailAndActivationToken);
                commonExpects.expectProgressDivHidden();
                
                // three fields are filled in
                expect(registrationPage.getEmailElement().getAttribute("value")).toEqual(guest.email);
                expect(registrationPage.getFirstNameElement().getAttribute("value")).toEqual(guest.firstName);
                expect(registrationPage.getLastNameElement().getAttribute("value")).toEqual(guest.lastName);
                
                // promo field is absent; email and roles fields are disabled
                expect(registrationPage.getPromoElement().isPresent()).toBe(false);
                expect(registrationPage.getEmailElement().isEnabled()).toBe(false);
                expect(registrationPage.getRoleElements().isEnabled()).toEqual([false, false]);
                
                // fill all others
                registrationPage.fillUserFields(guest, false, false);
                registrationPage.fillPracticeFields(guestPractice);
                registrationPage.getTNCElement().click();
                
                // convert!
                registrationPage.getGuestRegisterButtonElement().click();
                
                // TODO [ak] consider reusing the code below with PromoRegistrationSpec
                
                // waiting for a successful registration dialog and clicking OK
                browser.wait(EC.elementToBeClickable(registrationPage.getSuccessfulDialogOKButtonElement()), 30000);
                registrationPage.getSuccessfulDialogOKButtonElement().click();
                expect(registrationPage.getSuccessfulDialogElement().isPresent()).toBe(false);
                commonExpects.expectCurrentUrlToBe(signInPage.url);
                
                // check that new user cannot log in yet
                signInPage.setEmail(guest.email);
                signInPage.setPass(guest.password);
                signInPage.clickLogin();
                commonExpects.expectProgressDivHidden();
                commonExpects.expectMenuHidden();
                commonExpects.expectCurrentUrlToBe(signInPage.url);
                commonExpects.expectErrorNotificationShown();
                expect(signInPage.getEmail()).toEqual(guest.email);
                expect(signInPage.getPass()).toEqual('');
                
                // log in as superuser
                signInPage.setEmail(browser.params.login.super_user.email);
                signInPage.setPass(browser.params.login.super_user.pass);
                signInPage.clickLogin();
                commonExpects.expectProgressDivHidden();
                commonExpects.expectMenuShown();
                commonExpects.expectCurrentUrlToBe(historyPage.url);
                
                // navigate to Practice Console
                consolePracticePage.open();
                commonExpects.expectProgressDivHidden();
                commonExpects.expectCurrentUrlToBe(consolePracticePage.url);
                
                // find the new practice and approve it
                consolePracticePage.setPractice(guestPractice.name);
                consolePracticePage.getPracticeDropDownFirstRowElement().click();
                expect(consolePracticePage.getPracticeApproveButton().isDisplayed()).toBe(true);
                consolePracticePage.getPracticeApproveButton().click();
                commonExpects.expectSuccessNotificationShown();
                
                // log out
                commonActions.signOut();
                commonExpects.expectProgressDivHidden();
                commonExpects.expectMenuHidden();
                commonExpects.expectCurrentUrlToBe(signInPage.url);
                
                // log in as the new user
                signInPage.setEmail(guest.email);
                signInPage.setPass(guest.password);
                signInPage.clickLogin();
                commonExpects.expectProgressDivHidden();
                commonExpects.expectMenuShown();
                commonExpects.expectCurrentUrlToBe(historyPage.url);
                
                // TODO [ak] check there is a referral we've sent
                
                // log out
                commonActions.signOut();
                commonExpects.expectProgressDivHidden();
                commonExpects.expectMenuHidden();
                commonExpects.expectCurrentUrlToBe(signInPage.url);
            });

            afterEach(function() {
                commonExpects.expectConsoleWithoutErrors({except: [
                    "401", // returned when user tries to log in before practice is approved
                    "422" // returned when referral is already activated
                ]});
            });
        });
    };
};

module.exports = new GuestReferralSpec();
