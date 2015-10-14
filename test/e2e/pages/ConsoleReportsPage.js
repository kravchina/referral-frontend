var ConsoleReportsPage = function() {
    this.url = "/#/console/reports";

    this.open = function() {
        browser.get(this.url);
    };

};

module.exports = new ConsoleReportsPage();
