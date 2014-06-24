angular.module('catenaccio.services')
    .factory('notificationService', function ($interval) {
        'use strict';

        var notificationService = {};

        var self = this;

        notificationService.success = function (notification) {
            self.notification = notification;
            self.type = 'success';
            self.show = true;
            hideNotification();
        };

        notificationService.error = function (notification) {
            self.notification = notification;
            self.type = 'error';
            self.show = true;
            hideNotification();
        };

        notificationService.getNotification = function () {
            return self;
        };

        function hideNotification() {
            $interval(function () {
                self.show = false;
            }, 5000, 1);
        }

        return notificationService;
    });
