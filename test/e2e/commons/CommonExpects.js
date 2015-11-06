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
        browser.getCurrentUrl().then(function(url) {
            expect(url).toEqual(browser.baseUrl + pageUrl);
            if (doneCallback != undefined) doneCallback();
        });
    };
    
    this.expectCurrentUrlToContain = function(pageUrl) {
        expect(browser.getCurrentUrl()).toContain(browser.baseUrl + pageUrl);
    };

    this.expectErrorNotificationShown = function(){
        expect(element(by.css('div.global-notification-bar.alert-danger')).isDisplayed()).toBe(true);
    };

    this.expectSuccessNotificationShown = function(){
        expect(element(by.css('div.global-notification-bar.alert-success')).isDisplayed()).toBe(true);
    };

    this.expectWarningNotificationShown = function(){
        expect(element(by.css('div.global-notification-bar.alert-warning')).isDisplayed()).toBe(true);
    };

    this.expectInfoNotificationShown = function(){
        expect(element(by.css('div.global-notification-bar.alert-info')).isDisplayed()).toBe(true);
    };

    this.expectGlobalNotificationHidden = function(){
        expect(element(by.css('div.global-notification-bar')).isDisplayed()).toBe(false);
    };

    this.expectConsoleWithoutErrors = function(){
        if (browser.currentRunBrowserName !== 'internet explorer'){
        browser.manage().logs().get('browser').then(function (browserLog) {
            var i = 0,
                severWarnings = false;

            for (i; i <= browserLog.length - 1; i++) {
                if (browserLog[i].level.name === 'SEVERE') {
                    console.log('\n' + browserLog[i].level.name);
                    //print the error
                    console.log('(Possibly exception) \n' + browserLog[i].message);
                    console.log('Full log entry: \n' + require('util').inspect(browserLog));
                    severWarnings = true;
                }
            }

            expect(severWarnings).toBe(false);
    });}
    };

    this.expectConsoleWithoutErrorsExcept401 = function(){
        if (browser.currentRunBrowserName !== 'internet explorer'){
        browser.manage().logs().get('browser').then(function (browserLog) {
            var i = 0,
                severWarnings = false;

            for (i; i <= browserLog.length - 1; i++) {
                if (browserLog[i].level.name === 'SEVERE' && !/\s401\s/.test(browserLog[i].message)) {
                    console.log('\n' + browserLog[i].level.name);
                    //print the error
                    console.log('(Possibly exception) \n' + browserLog[i].message);

                    severWarnings = true;
                }
            }

            expect(severWarnings).toBe(false);
        });
    };}
};

module.exports = new CommonExpects();
