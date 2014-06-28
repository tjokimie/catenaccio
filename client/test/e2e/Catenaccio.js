module.exports = function () {
    'use strict';

    this.notification = element(by.css('[notification-tooltip]'));

    this.get = function () {
        browser.get('http://localhost:8000');
    };

    this.new = function () {
        element(by.className('fa-file-o')).click();
    };

    this.save = function () {
        makeHistory();
        element(by.className('fa-save')).click();
    };

    function makeHistory() {
        browser.executeScript('angular.element(document.body).injector().get("layerService").makeHistory();');
    }
};