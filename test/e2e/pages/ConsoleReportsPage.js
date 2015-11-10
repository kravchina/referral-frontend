var ConsoleReportsPage = function() {
    this.url = "/#/console/reports";

    this.open = function() {
        browser.get(this.url);
    };

    this.getInvitationHeader = function(){
        return element(by.css('.report-invitation h3'));
    };

    this.getPracticeHeader = function(){
        return element(by.css('.report-practice h3'));
    };

    this.getUserHeader = function(){
        return element(by.css('.report-user h3'));
    };

    this.getInvitationDay = function(){
        return element.all(by.css('.report-invitation span.badge')).get(0);
    };

    this.getInvitationWeek = function(){
        return element.all(by.css('.report-invitation span.badge')).get(1);
    };

    this.getInvitationYTD = function(){
        return element.all(by.css('.report-invitation span.badge')).get(2);
    };

    this.getPracticeDay = function(){
        return element.all(by.css('.report-practice span.badge')).get(0);
    };

    this.getPracticeWeek = function(){
        return element.all(by.css('.report-practice span.badge')).get(1);
    };

    this.getPracticeYTD = function(){
        return element.all(by.css('.report-practice span.badge')).get(2);
    };

    this.getUserDay = function(){
        return element.all(by.css('.report-user span.badge')).get(0);
    };

    this.getUserWeek = function(){
        return element.all(by.css('.report-user span.badge')).get(1);
    };

    this.getUserYTD = function(){
        return element.all(by.css('.report-user span.badge')).get(2);
    };

};

module.exports = new ConsoleReportsPage();
