var guestSignInSpec = require('../Guest/GuestSignInSpec');
var guestReferralSpec = require('../Guest/GuestReferralSpec');

var GuestSpec = function() {
    this.run = function() {
        describe('user as guest', function() {
            guestSignInSpec.run();
            guestReferralSpec.run();
        });
    };
};

module.exports = new GuestSpec();
