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
    
    this.expectCurrentUrlToBe = function(pageUrl) {
        expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + pageUrl);
    };
    
};

module.exports = new CommonExpects();
