var ConsolePluginPage = function() {
    this.url = "/#/console/plugin";

    this.open = function () {
        browser.get(this.url);
    };

    this.getAddVersionButton = function(){
        return element(by.css('button[ng-click="addVersion()"]'));
    };

    this.getAddVersionModal = function(){
        return element(by.css('.modal-dialog .add-plugin-version'));
    };

    this.getVersionInputModal = function(){
        return element(by.css('.modal-dialog input[ng-model="version"]'));
    };

    this.getAddButtonModal = function () {
      return element(by.css('.modal-dialog button[ng-click="add()"]'));
    };

    this.getCancelButtonModal = function () {
        return element(by.css('.modal-dialog button[ng-click="cancel()"]'));
    };

    this.getFirstVersionElement = function(){
        return element.all(by.css('.panel-body .list-group > a[ng-click="selectVersion(version)"]')).get(0);
    };

    this.getAllVersionsElement = function(){
        return element.all(by.css('.panel-body .list-group > a[ng-click="selectVersion(version)"]'));
    };

    this.getVersionDeleteButton = function () {
      return element(by.css('div[ng-if="selectedVersion"] .btn-delete'));
    };

    this.getVersionDeleteYesButton = function () {
        return element(by.css('div[ng-if="selectedVersion"] .btn-delete a[ng-click="deleteVersion(selectedVersion)"]'));
    };

    this.getPluginLogsButton = function () {
        return element(by.css('div[ng-if="selectedVersion"] button[ng-click="getLogs(selectedVersion)"]'));
    };

    this.getPluginUploadButton = function () {
        return element(by.css('div[ng-if="selectedVersion"] input[uploader="uploader"]'));
    }
};

module.exports = new ConsolePluginPage();