var commonActions = require('../commons/CommonActions');
var commonExpects = require('../commons/CommonExpects');
var commonMenu = require('../commons/CommonMenu');
var signInPage = require('../pages/SignInPage');
var registrationPage = require('../pages/RegistrationPage');
var historyPage = require('../pages/HistoryPage');

var PromoRegistrationSpec = function() {
    this.run = function() {
        var newProvider = {
            salutation: "Mr.",
            firstName: "Keanu",
            middleInitial: "D",
            lastName: "Reeves",
            email: "neo@example.com",
            password: "12345678"
        };
        var newPractice = {
            name: "Promo Dental Group",
            type: "General Dentistry",
            address: {
                street1: "2819 Dawson St",
                city: "Anchorage",
                state: "Alaska",
                short_state: "AK",
                zip: "99503",
                phone: "907-562-4774",
                website: "www.alcandentalanchorage.com"
            }
        };

        describe('user register through promo code', function() {
            it('check that after registration user cannot go to the history page', function() {

                // visit registration page as new doctor
                registrationPage.openPromo('getstarted');

                registrationPage.getSalutationElement().element(by.cssContainingText("option", newProvider.salutation)).click(); // TODO [ak] reuse select option click code

                // fill first and last names
                registrationPage.getFirstNameElement().sendKeys(newProvider.firstName);
                registrationPage.getLastNameElement().sendKeys(newProvider.lastName);

                registrationPage.getMiddleInitialElement().sendKeys(newProvider.middleInitial);
                registrationPage.getSpecialtyElement().element(by.cssContainingText("option", newPractice.type)).click();

                // creating new practice
                registrationPage.getPracticeNameElement().sendKeys(newPractice.name);
                registrationPage.getPracticeAddressStreetElement().sendKeys(newPractice.address.street1);
                registrationPage.getPracticeAddressCityElement().sendKeys(newPractice.address.city);
                registrationPage.getPracticeAddressStateElement().element(by.cssContainingText("option", newPractice.address.state)).click();
                registrationPage.getPracticeAddressZipElement().sendKeys(newPractice.address.zip);
                registrationPage.getPracticeAddressPhoneElement().sendKeys(newPractice.address.phone);
                registrationPage.getPracticeAddressWebsiteElement().sendKeys(newPractice.address.website);

                // fill email
                registrationPage.getEmailElement().sendKeys(newProvider.email);

                registrationPage.getPasswordElement().sendKeys(newProvider.password);
                registrationPage.getPasswordConfirmationElement().sendKeys(newProvider.password);
                registrationPage.getTNCElement().click();

                // register!
                registrationPage.getPromoRegisterButtonElement().click();

                // closing a successful registration dialog with OK
                expect(registrationPage.getSuccessfulDialogElement().isDisplayed()).toBe(true);
                registrationPage.getSuccessfulDialogOKButtonElement().click();
                expect(registrationPage.getSuccessfulDialogElement().isPresent()).toBe(false);
                commonExpects.expectCurrentUrlToBe(signInPage.url);
            });

        });
    };
};

module.exports = new PromoRegistrationSpec();
