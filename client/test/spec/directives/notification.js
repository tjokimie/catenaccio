describe('Directive: notification', function () {
    'use strict';

    beforeEach(module('catenaccio.directives'));

    var element, scope, notificationService;

    beforeEach(inject(function ($rootScope, _notificationService_) {
        element = angular.element('<notification></notification>');
        scope = $rootScope.$new();
        notificationService = _notificationService_;
    }));

    it('should not show notification', inject(function ($compile) {
        element = $compile(element)(scope);
        expect(element.find('div').children()).toHaveLength(0);
    }));

    describe('with success notification', function () {
        beforeEach(function () {
            notificationService.setNotification({
                key: 'SUCCESS',
                class: 'success'
            });
        });

        it('should show notification', inject(function ($compile) {
            element = $compile(element)(scope);
            scope.$digest();
            expect(element.find('div').children()).toHaveLength(2);
        }));

        it('should close notification', inject(function ($compile) {
            element = $compile(element)(scope);
            scope.$digest();
            element.find('i').click();
            expect(element.find('div').children()).toHaveLength(0);
        }));

        it('should have success class', inject(function ($compile) {
            element = $compile(element)(scope);
            scope.$digest();
            expect(element).toHaveClass('success');
        }));
    });
});
