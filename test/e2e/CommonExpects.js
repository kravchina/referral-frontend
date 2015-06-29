var CommonExpects = function() {
    
    this.expectProgressDivHidden = function() {
        expect(element(by.css('div#resultLoading.ng-hide')).isPresent()).toBe(true);
    };
    
    this.expectMenuShown = function() {
        expect(element(by.css('ul.nav.navbar-nav.navbar-right')).isPresent()).toBe(true);
    };
    
    this.expectMenuHidden = function() {
        expect(element(by.css('ul.nav.navbar-nav.navbar-right.ng-hide')).isPresent()).toBe(true);
    };
    
    this.expectCurrentUrlToBe = function(pageUrl, doneCallback) {
        // refactored to using then() after URL mismatches from time to time
        browser.getLocationAbsUrl().then(function(url) {
            expect(url).toEqual(browser.baseUrl + pageUrl);
            if (doneCallback != undefined) doneCallback();
        });
    };
    
    this.expectCurrentUrlToContain = function(pageUrl) {
        expect(browser.getLocationAbsUrl()).toContain(browser.baseUrl + pageUrl);
    };
    
};

module.exports = new CommonExpects();
