module.exports = function () {
    'use strict';

    this.notification = element(by.css('[notification-tooltip]'));

    this.get = function () {
        browser.get('http://localhost:8000');
    };

    this.save = function () {
        enableSave();
        element(by.className('fa-save')).click();
    };

    function enableSave() {
        browser.executeScript('angular.element($(".fa-save")).scope().isDisabled = function () {}');
    }
};