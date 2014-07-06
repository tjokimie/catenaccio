describe('Service: stageService', function () {
    'use strict';

    beforeEach(module('catenaccio.services'));

    var stageService, container, promise;

    beforeEach(module(function ($provide) {
        var $q = jasmine.createSpyObj('$q', ['defer']);
        promise = jasmine.createSpyObj('promise', ['resolve']);
        $q.defer.and.returnValue(promise);
        $provide.value('$q', $q);
    }));

    /* jshint camelcase: false */
    beforeEach(inject(function (_stageService_) {
        stageService = _stageService_;
        container = document.createElement('div');
    }));
    /* jshint camelcase: true */

    describe('new stage', function () {
        it('should set width based on height', function () {
            stageService.newStage(1000, 88, container);
            expect(stageService.getWidth()).toBe(125);
        });

        it('should set height based on width', function () {
            stageService.newStage(125, 1000, container);
            expect(stageService.getHeight()).toBe(88);
        });

        it('should scale based on width and height', function () {
            stageService.newStage(1250, 880, container);
            expect(stageService.getWidth()).toBe(1250);
            expect(stageService.getHeight()).toBe(880);
        });
    });

    describe('event listeners', function () {
        var listener;

        beforeEach(function () {
            var layer = new Kinetic.Layer();
            stageService.newStage(800, 600, container);
            stageService.addLayer(layer);
            listener = jasmine.createSpy('listener');
            stageService.addListener('foo', listener);
        });

        it('should add event listener', function () {
            fireEvent('foo');
            expect(listener).toHaveBeenCalled();
        });

        it('should remove event listener', function () {
            stageService.removeListener('foo', listener);
            fireEvent('foo');
            expect(listener).not.toHaveBeenCalled();
        });

        it('should keep event listener after stage update', function () {
            stageService.newStage(800, 600, container);
            fireEvent('foo');
            expect(listener).toHaveBeenCalled();
        });

        it('should not add removed event listener after stage update', function () {
            stageService.removeListener('foo', listener);
            stageService.newStage(800, 600, container);
            fireEvent('foo');
            expect(listener).not.toHaveBeenCalled();
        });

        function fireEvent(name, type) {
            var event = document.createEvent(type || 'Event');
            event.initEvent(name, false, false);
            container.dispatchEvent(event);
        }
    });

    describe('data url', function () {
        beforeEach(function () {
            var layer = new Kinetic.Layer();
            stageService.newStage(800, 600, container);
            stageService.addLayer(layer);
        });

        it('should sesolve promise', function (done) {
            promise.resolve.and.callFake(done);
            stageService.toDataURL();
        });

        it('should return data url', function (done) {
            promise.resolve.and.callFake(function (dataURL) {
                expect(dataURL.substring(0, 21)).toBe('data:image/png;base64');
                done();
            });
            stageService.toDataURL();
        });
    });
});
