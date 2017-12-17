var commonActions = require('../../commons/CommonActions');
var commonExpects = require('../../commons/CommonExpects');
var commonMenu = require('../../commons/CommonMenu');

var signInPage = require('../../pages/SignInPage');
var adminPracticePage = require('../../pages/AdminPracticePage');

var promoRegistrationSpec = require('./PromoRegistrationSpec.js');
// TODO [ak] var adminInvitePracticeSpec = require('./AdminInvitePracticeSpec.js');
var adminInviteUserSpec = require('./AdminInviteUserSpec.js');
var createReferralInviteFrontDeskPracticeSpec = require('./CreateReferralInviteFrontDeskPracticeSpec.js');
var createReferralInviteProviderPracticeSpec = require('./CreateReferralInviteProviderPracticeSpec.js');
var superInvitePracticeSpec = require('./SuperInvitePracticeSpec.js');
var superInviteUserSpec = require('./SuperInviteUserSpec.js');

var commonExpects = require('../../commons/CommonExpects');

var RegistrationSpec = function() {
    this.run = function() {
        describe('and user registration is performed', function() {
            
            // every registration spec is expected to register a new user somehow and log him in.
            // this.user and this.practice should be set for each registration spec
            
            it('with promo', function() {
                this.user = {
                    salutation: "Mr.",
                    firstName: "Keanu",
                    middleInitial: "D",
                    lastName: "Reeves",
                    email: "neo@example.com",
                    password: "12345678"
                };
                this.practice = {
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
                promoRegistrationSpec.run(this.user, this.practice);
            });
            
            // adminInvitePracticeSpec.run();
            
            it('from Admin Practice page', function() {
                var emailAndRegistrationToken = (new Date()).getTime().toString();
                this.user = {
                    salutation: "Mr.",
                    firstName: "Smith",
                    middleInitial: "X",
                    lastName: "Brown",
                    email: emailAndRegistrationToken + "@example.com",
                    password: "12345678"
                };
                this.practice = browser.params.login.correct.practice;
                adminInviteUserSpec.run(emailAndRegistrationToken, this.user);
            });
            
            it('from create referral for provider', function() {
                var emailAndRegistrationToken = (new Date()).getTime().toString();
                this.user = {
                    salutation: "Mr.",
                    firstName: "Emmeth",
                    middleInitial: "D",
                    lastName: "Brown",
                    email: emailAndRegistrationToken + "@example.com",
                    password: "12345678"
                };
                this.practice = {
                    name: "Alcan Dental Group",
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
                createReferralInviteProviderPracticeSpec.run(emailAndRegistrationToken, this.user, this.practice);
            });
            
            it('from create referral for front-desk', function() {
                var emailAndRegistrationToken = (new Date()).getTime().toString();
                this.user = {
                    salutation: "Mr.",
                    firstName: "Front",
                    middleInitial: "X",
                    lastName: "Desk",
                    email: emailAndRegistrationToken + "@example.com",
                    password: "12345678"
                };
                this.practice = {
                    name: "Frontdesk practice",
                    type: "General Dentistry",
                    address: {
                        street1: "1111 Front desk str.",
                        city: "Anchorage",
                        state: "Alaska",
                        short_state: "AK",
                        zip: "99503",
                        phone: "901-562-0000",
                        website: "www.front.desk"
                    }
                };
                createReferralInviteFrontDeskPracticeSpec.run(emailAndRegistrationToken, this.user, this.practice);
            });
            
            it('from superuser console into existing practice', function() {
                var emailAndRegistrationToken = (new Date()).getTime().toString();
                this.user = {
                    salutation: "Mr.",
                    firstName: "Friend",
                    middleInitial: "O",
                    lastName: "Super2",
                    email: emailAndRegistrationToken + "@example.com",
                    password: "12345678"
                };
                this.practice = browser.params.login.correct.practice;
                superInviteUserSpec.run(emailAndRegistrationToken, this.user, this.practice);
            });
            
            it('from superuser console on behalf of a practice user', function() {
                var emailAndRegistrationToken = (new Date()).getTime().toString();
                this.user = {
                    salutation: "Mr.",
                    firstName: "Friend",
                    middleInitial: "O",
                    lastName: "Super",
                    email: emailAndRegistrationToken + "@example.com",
                    password: "12345678"
                };
                this.practice = {
                    name: "F practice",
                    type: "General Dentistry",
                    address: {
                        street1: "4222 Super str.",
                        city: "Anchorage",
                        state: "Alaska",
                        short_state: "AK",
                        zip: "11503",
                        phone: "901-562-1111",
                        website: "www.super"
                    }
                };
                superInvitePracticeSpec.run(emailAndRegistrationToken, this.user, this.practice);
            });
            
            afterEach(function(){
                commonExpects.expectConsoleWithoutErrors({except: ["401"]});
                
                // check that we're logged in as a correct user
                expect(commonMenu.getTitleElement().getText()).toEqual(this.user.salutation);
                expect(commonMenu.getFirstNameElement().getText()).toEqual(this.user.firstName);
                expect(commonMenu.getLastNameElement().getText()).toEqual(this.user.lastName);
                
                // verify we're in the correct practice
                adminPracticePage.open();
                commonExpects.expectProgressDivHidden();
                expect(adminPracticePage.getPracticeName()).toEqual(this.practice.name);
                
                // log out
                commonActions.signOut();
                commonExpects.expectProgressDivHidden();
                commonExpects.expectMenuHidden();
                commonExpects.expectCurrentUrlToBe(signInPage.url);
            });
        });
    };
};

module.exports = new RegistrationSpec();
