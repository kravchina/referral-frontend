var AdminSubscriptionPage = function () {
    this.url = "/#/admin/subscription";

    this.open = function () {
        browser.get(this.url);
    };

    this.clickUpgradeSubscription = function () {
        element(by.id('upgradeBtn')).click();
    };

    this.getSubscriptionDialogElement = function () {
        return element(by.css('div.modal-dialog form#formUpgrade'));
    };
    this.getSubscriptionDialogNameElement = function () {
        return element(by.model('payment_info.name_on_card'));
    };
    this.getSubscriptionDialogCardNumberElement = function () {
        return element(by.model('payment_info.card_number'));
    };
    this.getSubscriptionDialogCvcElement = function () {
        return element(by.model('payment_info.card_cvc'));
    };
    this.getSubscriptionDialogMonthElement = function () {
        return element(by.model('payment_info.card_exp_month'));
    };
    this.getSubscriptionDialogUpgradeButton = function () {
        return element(by.id('upgradeSubscriptionBtn'));
    }

};

module.exports = new AdminSubscriptionPage();
