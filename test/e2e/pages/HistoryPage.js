var HistoryPage = function() {
    this.url = "/#/history";

    this.getStatusFilter = function() {
        return element(by.css('select[ng-model="statusFilter"]'));
    };

    this.getStatusFilterOptionByName = function(filterName){
        return element(by.cssContainingText('option', filterName));
    };

    this.getSearchField = function() {
        return element(by.css('input[ng-model="query"]'));
    };

    this.getNewRefferalButton = function() {
        return element(by.css('a[ng-click="newRefferal()"]'));
    };
    
};

module.exports = new HistoryPage();
