var ConsoleUtilitiesPage = function() {
    this.url = "/#/console/utilities";

    this.open = function() {
        browser.get(this.url);
    };

};

module.exports = new ConsoleUtilitiesPage();
