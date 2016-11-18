var ConsoleReportsPage = function() {
    this.url = "/#/console/reports";

    this.open = function() {
        browser.get(this.url);
    };

    this.getInvitationMenuLink = function(){
        return element(by.css('.nav li[heading="Invitation"] a'));
    };

    this.getPracticeMenuLink = function(){
        return element(by.css('.nav li[heading="Practices"] a'));
    };

    this.getUserMenuLink = function(){
        return element(by.css('.nav li[heading="Users"] a'));
    };

    this.getListOfRemindersMenuLink = function(){
        return element(by.css('.nav li[heading="List of reminders"] a'));
    };

    this.getSiteStatsMenuLink = function(){
        return element(by.css('.nav li[heading="Site stats"] a'));
    };

    this.getInvitationDay = function(){
        return element.all(by.css('.btn-group span.badge')).get(0);
    };

    this.getInvitationWeek = function(){
        return element.all(by.css('.btn-group span.badge')).get(1);
    };

    this.getInvitationYTD = function(){
        return element.all(by.css('.btn-group span.badge')).get(2);
    };

    this.getPracticeDay = function(){
        return element.all(by.css('.btn-group span.badge')).get(0);
    };

    this.getPracticeWeek = function(){
        return element.all(by.css('.btn-group span.badge')).get(1);
    };

    this.getPracticeYTD = function(){
        return element.all(by.css('.btn-group span.badge')).get(2);
    };

    this.getUserDay = function(){
        return element.all(by.css('.btn-group span.badge')).get(0);
    };

    this.getUserWeek = function(){
        return element.all(by.css('.btn-group span.badge')).get(1);
    };

    this.getUserYTD = function(){
        return element.all(by.css('.btn-group span.badge')).get(2);
    };

    this.getListOfRemindersTable = function(){
        return element(by.css('.list-of-reminders'));
    };

};

module.exports = new ConsoleReportsPage();
