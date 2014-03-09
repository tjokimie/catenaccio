angular.module('catenaccio.services')
    .factory('notificationService', function () {
        'use strict';

        var notificationService = {};

        var self = this;

        notificationService.setNotification = function (notification) {
            self.notification = notification;
        };

        notificationService.getNotification = function () {
            return self.notification;
        };

        notificationService.removeNotification = function () {
            delete self.notification;
        };

        return notificationService;
    });