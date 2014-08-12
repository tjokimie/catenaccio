module.exports = function () {
    'use strict';

    this.notification = element(by.className('success'));

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

    this.saveImage = function () {
        element(by.className('fa-picture-o')).click();
        browser.sleep(200);
    };

    this.closeSaveImage = function () {
        element(by.className('modal-close')).click();
        browser.sleep(200);
    };

    function makeHistory() {
        browser.executeScript('angular.element(document.body).injector().get("layerService").makeHistory();');
    }
};
