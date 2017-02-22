var ChangeSubscriptionPage = function () {
    this.url = "/#/subscription/change";

    this.open = function () {
        browser.get(this.url);
    };

    this.clickBasicPlan = function () {
        element(by.css('button[ng-click="cancelSubscription()"]')).click();
    };
    this.clickMonthlyPlan = function () {
        element(by.id('upgrade-month')).click();
    };
    this.clickAnnualPlan = function () {
        element(by.id('upgrade-year')).click();
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
    };
    this.getDowngradeConfirmationDialog = function(){
        return element(by.css('div.modal-dialog h4#confirmationTitle'));
    };
    this.getDowngradeButton = function(){
        return element(by.id('downgradeConfirmBtn'));
    };
    this.getFreePlanIndicator = function(){
        return element(by.id('freePlanIndicator'));
    };
    this.getMonthlyPlanIndicator = function(){
        return element(by.id('monthlyPlanIndicator'));
    };
    this.getAnnualPlanIndicator = function(){
        return element(by.id('annualPlanIndicator'));
    };

};

module.exports = new ChangeSubscriptionPage();
