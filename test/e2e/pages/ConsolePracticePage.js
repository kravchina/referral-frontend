var ConsolePracticePage = function() {
    this.url = "/#/console/practice";

    this.open = function() {
        browser.get(this.url);
    };

    this.getPractice = function(){
        return element(by.model('practiceSearchText'));
    };

    this.setPractice = function(practiceName){
        element(by.model('practiceSearchText')).sendKeys(practiceName);
    };

    this.getPracticeDropDownElement = function() {
        return element(by.css('input[name="practice"] ~ ul.dropdown-menu'));
    };

    this.getPracticeDropDownFirstRowElement = function() {
        return element(by.css('input[name="practice"] ~ ul.dropdown-menu > li:nth-child(1)'));
    };

    this.getPracticeName = function(){
        return element.all(by.css('div[ng-show="practiceSearchText"] .form-group input')).get(0);
    };

    this.getUser = function(){
        return element(by.css('select[name="user"]'));
    };

    this.getUserOptionByName = function(userName){
        return element(by.cssContainingText('option', userName));
    };

    this.getUserEmail = function(){
        return element.all(by.css('div[ng-show="practiceUsers"] .form-group input')).get(1);
    };

};

module.exports = new ConsolePracticePage();
