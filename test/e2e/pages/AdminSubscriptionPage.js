var AdminSubscriptionPage = function () {
    this.url = "/#/admin/subscription";

    this.open = function () {
        browser.get(this.url);
    };

    this.clickChangeSubscription = function () {
        element(by.id('changeSubscription')).click();
    };

    this.clickChangePaymentSource = function(){
        element(by.css('button[ng-click="upgradeDialog()"]')).click();
    };

    this.getSubscriptionDialogElement = function () {
        return element(by.id('formUpgrade'));
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
    };
    this.getSubscriptionDialogSaveButton = function () {
        return element(by.id('changePaymentInfo'));
    };

};

module.exports = new AdminSubscriptionPage();
