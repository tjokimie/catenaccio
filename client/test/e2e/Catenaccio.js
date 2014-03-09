module.exports = function () {
    'use strict';

    this.get = function () {
        browser.get('http://localhost:8000');
    };

    this.save = function () {
        browser.executeScript('angular.element($(".fa-save")).scope().isDisabled = function () {}');
        element(by.css('.fa-save')).click();
    };

    this.notification = element(by.css('.notification'));
};