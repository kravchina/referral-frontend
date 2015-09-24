var ConsolePracticePage = function() {
    this.url = "/#/console/practice";

    this.open = function() {
        browser.get(this.url);
    };

};

module.exports = new ConsolePracticePage();
