var commonActions = require('./commons/CommonActions');
var commonExpects = require('./commons/CommonExpects');

var signInPage = require('./pages/SignInPage');

var invalidLoginSpec = require('./specs/InvalidLoginSpec');
var standardLoginSpec = require('./specs/StandardLogin/StandardLoginSpec');
var superUserLoginSpec = require('./specs/SuperUserLogin/SuperUserLoginSpec');
var adminPracticePremiumSpec = require('./specs/AdminPracticePremiumSpec');
var adminPracticeNonPremiumSpec = require('./specs/AdminPracticeNonPremiumSpec');
var adminSubscriptionPremiumSpec = require('./specs/AdminSubscriptionPremiumSpec');
var changeSubscriptionSpec = require('./specs/ChangeSubscriptionSpec');
var guestSpec = require('./specs/Guest/GuestSpec');
var registrationSpec = require('./specs/Registration/RegistrationSpec');

describe('when user navigates to Sign In page', function() {
    commonActions.maximizeBrowser();
    
    beforeEach(function() {
        signInPage.open();
        commonExpects.expectProgressDivHidden();
        commonExpects.expectMenuHidden();
    });
    
    it('shows Sign In page with empty fields', function() {
      expect(signInPage.getEmail()).toEqual('');
      expect(signInPage.getPass()).toEqual('');
    });

    describe('and user tries to login with incorrect credentials', function(){
        invalidLoginSpec.run();
        afterEach(function(){
            commonExpects.expectConsoleWithoutErrors({except: ["401"]});
        });
    });

    describe('and user tries to login with correct credentials', function(){
        standardLoginSpec.run();
        superUserLoginSpec.run();
        adminPracticePremiumSpec.run();
        adminPracticeNonPremiumSpec.run();
        adminSubscriptionPremiumSpec.run();
        changeSubscriptionSpec.run();
        afterEach(function(){
            commonExpects.expectConsoleWithoutErrors();
        });
    });
    
    guestSpec.run();
    registrationSpec.run();
});
