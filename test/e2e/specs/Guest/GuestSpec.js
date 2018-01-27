var guestSignInSpec = require('../Guest/GuestSignInSpec');
var guestReferralSpec = require('../Guest/GuestReferralSpec');
var guestActivationErrorSpec = require('../Guest/GuestActivationErrorSpec');

var GuestSpec = function() {
    this.run = function() {
        describe('user as guest', function() {
            guestSignInSpec.run();
            guestReferralSpec.run();
            guestActivationErrorSpec.run();
        });
    };
};

module.exports = new GuestSpec();
