var ConsoleUtilitiesPage = function() {
    this.url = "/#/console/utilities";

    this.open = function() {
        browser.get(this.url);
    };

    this.getDownloadEmailsButton = function(){
        return element(by.css('.download-emails-btn'));
    };

    this.getShowVersionButton = function(){
        return element(by.css('.show-version-btn'));
    };

};

module.exports = new ConsoleUtilitiesPage();
