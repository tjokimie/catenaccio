describe('Service: notificationService', function () {
    'use strict';

    beforeEach(module('catenaccio.services'));

    var notificationService;

    beforeEach(inject(function (_notificationService_) {
        notificationService = _notificationService_;
    }));

    it('should not have notification', function () {
        var notification = notificationService.getNotification();
        expect(notification).toBeUndefined();
    });

    describe('with notification', function () {
        var setNotification;

        beforeEach(function () {
            setNotification = { message: 'Success!' };
            notificationService.setNotification(setNotification);
        });

        it('should have set notification', function () {
            var notification = notificationService.getNotification();
            expect(notification).toBe(setNotification);
        });

        it('should remove notification', function () {
            notificationService.removeNotification();
            var notification = notificationService.getNotification();
            expect(notification).toBeUndefined();
        });
    });
});
