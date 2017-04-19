[
    {
        "key":"invitation.exists",
        "value":"This email already exists in our database. To send a referral to this practice, please find them by entering their name in the practice search field.",
        "description":"Validation message for the case when invited provider already exists in the system."
    },
    {
        "key":"user.save.failed",
        "value":"Error: failed to save user.",
        "description":"Validation message for the case when saving user during registration was not successful"
    },
    {
        "key":"invitation_token.promo.security_code.not.found",
        "value":"Error: invitation token promo or security code was not found",
        "description":"Validation message for the case when invitation_token, promo code or security_code was not found or was incorrect during registration"
    },
    {
        "key":"invitation.invalid",
        "value":"Something happened... Probably, invitation is invalid or was used already.",
        "description":"Error message for the case when invitation token considered invalid"
    },
    {
        "key":"invitation.exist",
        "value":"You already registered, Please log in.",
        "description":"Error message for the case when you already registered by this invitation."
    },
    {
        "key":"promotion.expired.header",
        "value":"Promo code has expired.",
        "description":"Error message for the case when promo code was expired"
    },
    {
        "key":"promotion.expired",
        "value":"This promo code has expired. If you are interested in registering a Dental Care Links account, please contact us at <a href='mailto:info@dentalcarelinks.com'>info@dentalcarelinks.com</a>",
        "description":"Error message for the case when promo code was expired"
    },
    {
        "key":"promotion.not.found.header",
        "value":"Promo code is not found.",
        "description":"Error message for the case when promo code was not found"
    },
    {
        "key":"promotion.not.found",
        "value":"Your promo code is not found. If you are interested in registering a Dental Care Links account, please contact us at <a href='mailto:info@dentalcarelinks.com'>info@dentalcarelinks.com</a>",
        "description":"Error message for the case when promo code was not found"
    },
    {
        "key":"practice.create.failed",
        "value":"Unable to create practice",
        "description":"Error message for the case when practice creation was failed"

    },
    {
        "key": "practice.doctor.not.found.header",
        "value": "Please add a doctor to your account",
        "description": "Message shown when current practice is no user with doctor role"
    },
    {
        "key": "practice.doctor.not.found",
        "value": "We are sorry, but in order to send a new referral, you have to have at least one doctor registered in your practice. Please follow this <a ui-sref='admin.users'>link</a> to add a doctor to your account.",
        "description": "Message shown when current practice is no user with doctor role"
    },
    {
        "key":"invalid.token",
        "value":"Error: provided token is invalid",
        "description":"Error message for the case when token was not valid"
    },
    {
        "key":"has an extension that does not match its contents",
        "value":"We do not currently support this file type, but if you believe it should be supported, let us know by sending a message to info@dentalcarelinks.com",
        "description":"Error message for the case when attachment file is not supported"
    },
    {
        "key":"user.exists",
        "value":"Sorry an account with this email address already exists. If you need further assistance please email us at info@dentalcarelinks.com",
        "description":"Error message for when person is trying to register with an email that we already have as a registered user or an invitation"
    },
    {
        "key":"referral.success.create",
        "value":"Your referral was sent successfully",
        "description":"Your referral was sent successfully"
    },

    {
        "key": "payment.required.header",
        "value": "PLEASE UPGRADE YOUR ACCOUNT TO VIEW NEW REFERRALS",
        "description": "Error page header for the case when user tries to open referral, but his practice didn't pay for a premium account."
    },
    {
        "key": "payment.required",
        "value": "We are sorry but your premium account trial period has ended.  In order to receive referrals from other providers you will need to upgrade to a PREMIUM ACCOUNT. Once your account has been upgraded to a premium account you will be able to send and receive referral information to any account. The recipient of your referrals will NOT need to upgrade to  a premium account.  Please follow this link to <a ui-sref='admin.subscription'>edit your account</a>.",
        "description": "Error message for the case when user tries to open referral, but his practice didn't pay for a premium account."
    },
    {
        "key": "access.denied.header",
        "value": "YOU ARE NOT ALLOWED TO VIEW THIS PAGE",
        "description": "Error page header for the case when user tries to open referral, but user doesn't have permissions for that."
    },
    {
        "key": "access.denied",
        "value": "We are sorry but you don't have appropriate permissions to view this page.",
        "description": "Error message for the case when user tries to open referral, but his practice didn't pay for a premium account."
    },
    {
        "key":"error.http.requestTimeout",
        "value":"Request Timeout Error. Please try again.",
        "description":"Request Timeout Error"
    },
    {
        "key":"error.http.serverError",
        "value":"Server Error. Please try again.",
        "description":"Server Error: 500 - 600"
    },
    {
        "key":"default.error.header",
        "value":"Error page",
        "description":"Unknown error page header"
    },
    {
        "key":"invitation.email.register",
        "value":"Sorry this email address is already in use. If this is your account please follow this <a ui-sref='signIn'>link</a> to login or reset your password if needed",
        "description":"Email registered"
    },
    {
        "key":"invitation.email.invited",
        "value":"Sorry, this email address already exists in our system. Click <button type='button' class='btn btn-orange notification-button' ng-click='notification.params.resend()'>here</button> and we will send you a link to register.",
        "description":"Email invited"
    },
    {
        "key": "register.invitation.resend",
        "value": "We have resent the email to your address. Please check your email and follow the directions to register your account using this email address.",
        "description": "Message show when invitation resend to email on register page"
    },
    {
        "key":"default.error",
        "value":"Unknown error",
        "description":"Unknown error message"
    },
    {
        "key": "email.exists",
        "value": "Your email is already registered. Please provide a new one.",
        "description": "Error is shown when user provides an email that already registered in our system"
    },
    {
        "key": "reset_password_token.invalid",
        "value": "Your reset password link is invalid. Most likely it is expired or was already used",
        "description": ""
    },
    {
        "key": "activity.address.create",
        "value": "created a new address",
        "description": ""
    },
    {
        "key": "activity.address.update",
        "value": "updated an address",
        "description": ""
    },
    {
        "key": "activity.address.destroy",
        "value": "removed an address",
        "description": ""
    },
    {
        "key": "activity.attachment.create",
        "value": "added an attachment",
        "description": ""
    },
    {
        "key": "activity.attachment.update",
        "value": "updated an attachment",
        "description": ""
    },
    {
        "key": "activity.attachment.destroy",
        "value": "removed an attachment",
        "description": ""
    },
    {
        "key": "activity.note.destroy",
        "value": "removed a note",
        "description": ""
    },
    {
        "key": "activity.note.update",
        "value": "updated a note",
        "description": ""
    },
    {
        "key": "activity.note.create",
        "value": "created a note",
        "description": ""
    },
    {
        "key": "activity.patient.create",
        "value": "created a new patient",
        "description": ""
    },
    {
        "key": "activity.patient.update",
        "value": "updated a patient",
        "description": ""
    },
    {
        "key": "activity.patient.destroy",
        "value": "removed a patient",
        "description": ""
    },
    {
        "key": "activity.practice.create",
        "value": "created practice",
        "description": ""
    },
    {
        "key": "activity.practice.update",
        "value": "updated practice information",
        "description": ""
    },
    {
        "key": "activity.promo.create",
        "value": "created a new promo code",
        "description": ""
    },
    {
        "key": "activity.promo.update",
        "value": "updated a promo code",
        "description": ""
    },
    {
        "key": "activity.promo.destroy",
        "value": "removed promo code",
        "description": ""
    },
    {
        "key": "activity.provider_invitation.create",
        "value": "invited new provider",
        "description": ""
    },
    {
        "key": "activity.provider_invitation.update",
        "value": "updated provider invitation",
        "description": ""
    },
    {
        "key": "activity.provider_invitation.destroy",
        "value": "removed provider invitation",
        "description": ""
    },
    {
        "key": "activity.referral.create",
        "value": "created new referral",
        "description": ""
    },
    {
        "key": "activity.referral.update",
        "value": "updated a referral",
        "description": ""
    },
    {
        "key": "activity.referral.destroy",
        "value": "removed a referral",
        "description": ""
    },
    {
        "key": "activity.referral.save_template",
        "value": "saved a referral draft",
        "description": ""
    },
    {
        "key": "activity.referral.change_status",
        "value": "changed referral status",
        "description": ""
    },
    {
        "key": "activity.security_code.create",
        "value": "created new security code",
        "description": ""
    },
    {
        "key": "activity.security_code.destroy",
        "value": "removed a security code",
        "description": ""
    },
    {
        "key": "activity.user.update",
        "value": "updated user's account",
        "description": ""
    },
    {
        "key": "activity.user.create",
        "value": "created user's account",
        "description": ""
    },
    {
        "key": "activity.user.destroy",
        "value": "destroyed user's account",
        "description": ""
    },
    {
        "key": "email.not.found",
        "value": "Error: This email address is not found in our database.",
        "description": "Message shown in case of non-existing email during request password reset (forgot password feature "
    },
    {
        "key": "unsubscribe.token.not.found.header",
        "value": "UNSUBSCRIBE FAILURE",
        "description": "Message shown in case of non-existing token during request unsubscribe"
    },
    {
        "key": "unsubscribe.token.not.found",
        "value": "Error: This email address is not found in our database.",
        "description": "Message shown in case of non-existing token during request unsubscribe"
    },
    {
        "key": "referral.not.found.header",
        "value": "Referral error",
        "description": "Message shown when referral not found or delete"
    },
    {
        "key": "referral.not.found",
        "value": "Sorry, referral not found or deleted",
        "description": "Message shown when referral not found or delete"
    }

]