var ConsoleUtilitiesPage = function() {
    this.url = "/#/console/utilities";

    this.open = function() {
        browser.get(this.url);
    };

    this.getDownloadEmailsButton = function(){
        return element(by.css('.download-emails-btn'));
    };

};

module.exports = new ConsoleUtilitiesPage();
