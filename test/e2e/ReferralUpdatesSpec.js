var commonActions = require('./CommonActions');
var commonExpects = require('./CommonExpects');
var signInPage = require('./SignIn/SignInPage');
var historyPage = require('./History/HistoryPage');

describe('when user navigates to Sign In page', function() {
    commonActions.maximizeBrowser();

    signInPage.open();
    commonExpects.expectProgressDivHidden();
    commonExpects.expectMenuHidden();

    signInPage.setEmail(wrongEmail);
    signInPage.setPass(wrongPass);
    signInPage.clickLogin();
    commonExpects.expectProgressDivHidden();

    commonExpects.expectMenuShown();
    commonExpects.expectCurrentUrlToBe(historyPage.url);

    //create new referral to ensure it is available for testing

    //logout and login as another user
    commonActions.signOut();
    commonExpects.expectProgressDivHidden();
    commonExpects.expectMenuHidden();
    commonExpects.expectCurrentUrlToBe(signInPage.url);


    commonExpects.expectProgressDivHidden();
    commonExpects.expectMenuHidden();

    signInPage.setEmail(browser.params.login1.user);
    signInPage.setPass(browser.params.login1.pass);
    signInPage.clickLogin();
    commonExpects.expectProgressDivHidden();

    commonExpects.expectMenuShown();
    commonExpects.expectCurrentUrlToBe(historyPage.url);


    //check that referral has updates indicator
    var historyReferrals = element.all(by.repeater('referral in referrals'));
    expect(historyReferrals.first().has_updates).toEqual(true);
    //open referral and return to history
    element(historyReferrals.first()).click();
    commonExpects.expectProgressDivHidden();

    //check that updates indicator dissapeared
     expect(historyReferrals.first().has_updates).toEqual(false);
    //open referral and change something
     element(historyReferrals.first()).click();
     var teeth = element.all(by.repeater("item in ['9','10','11','12','13','14','15','16']"));
     element(teeth.first()).click();



    //go to history page and check that this referral doesn't have updates indicator
    commonActions.clickLogo();
    commonExpects.expectCurrentUrlToBe(historyPage.url);
    expect(historyReferrals.first().has_updates).toEqual(false);

    //logout and login as another user
    commonActions.signOut();
    commonExpects.expectCurrentUrlToBe(signInPage.url);
    signInPage.setEmail(browser.params.login2.user);
    signInPage.setPass(browser.params.login2.pass);
    signInPage.clickLogin();
    commonExpects.expectProgressDivHidden();

    //check that updates indicator is visible for that user
    commonExpects.expectCurrentUrlToBe(historyPage.url);
    expect(historyReferrals.first().has_updates).toEqual(true);//todo we need to ensure, that first referral is the same as for initial user.


    //open referral and return back to history
    element(historyReferrals.first()).click();

    //check that updates indicator doesn't show any more
    commonActions.clickLogo();
    commonExpects.expectCurrentUrlToBe(historyPage.url);
    expect(historyReferrals.first().has_updates).toEqual(false);
    //test finished

});