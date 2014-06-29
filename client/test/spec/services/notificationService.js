describe('Service: notificationService', function () {
    'use strict';

    beforeEach(module('catenaccio.services'));

    var notificationService, $interval;

    /* jshint camelcase: false */
    beforeEach(inject(function (_notificationService_, _$interval_) {
        notificationService = _notificationService_;
        $interval = _$interval_;
    }));
    /* jshint camelcase: true */

    describe('success', function () {
        var success;

        beforeEach(function () {
            success = 'SUCCESS';
            notificationService.success(success);
        });

        it('should show the notification', function () {
            var notification = notificationService.getNotification();
            expect(notification.notification).toBe(success);
            expect(notification.type).toBe('success');
            expect(notification.show).toBe(true);
        });

        it('should hide the notification', function () {
            var notification = notificationService.getNotification();
            $interval.flush(5000);
            expect(notification.show).toBe(false);
        });
    });

    describe('error', function () {
        var error;

        beforeEach(function () {
            error = 'ERROR';
            notificationService.error(error);
        });

        it('should show the notification', function () {
            var notification = notificationService.getNotification();
            expect(notification.notification).toBe(error);
            expect(notification.type).toBe('error');
            expect(notification.show).toBe(true);
        });

        it('should hide the notification', function () {
            var notification = notificationService.getNotification();
            $interval.flush(5000);
            expect(notification.show).toBe(false);
        });
    });
});
