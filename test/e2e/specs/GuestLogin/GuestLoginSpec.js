var commonExpects = require('../../commons/CommonExpects');

var guestRegistrationSpec = require('./Registartion/GuestRegistrationSpec');
var guestCreateReferralSpec = require('./Referral/GuestCreateReferralSpec');

var GuestLoginSpec = function() {
    this.run = function() {
        describe('when user is guest', function() {
            beforeEach(function() {
                commonExpects.expectProgressDivHidden();
                commonExpects.expectMenuHidden();
            });

            guestRegistrationSpec.run();
            guestCreateReferralSpec.run();
        });
    };
};

module.exports = new GuestLoginSpec();
