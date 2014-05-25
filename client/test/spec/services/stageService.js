describe('Service: stageService', function () {
    'use strict';

    beforeEach(module('catenaccio.services'));

    var q, stageService, container;

    beforeEach(module(function ($provide) {
        q = jasmine.createSpyObj('$q', ['defer']);
        $provide.value('$q', q);
    }));

    beforeEach(inject(function (_stageService_) {
        stageService = _stageService_;
        container = document.createElement('div');
    }));

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

        it('should keep listener after stage update', function () {
            stageService.newStage(800, 600, container);
            fireEvent('foo');
            expect(listener).toHaveBeenCalled();
        });

        function fireEvent(name, type) {
            var event = document.createEvent(type || 'Event');
            event.initEvent(name, false, false);
            container.dispatchEvent(event);
        }
    });

    describe('data url', function () {
        var resolver;

        beforeEach(function () {
            var layer = new Kinetic.Layer();
            stageService.newStage(800, 600, container);
            stageService.addLayer(layer);
            resolver = jasmine.createSpyObj('resolver', ['resolve']);
            q.defer.andReturn(resolver);
        });

        it('should resolve promise', function () {
            stageService.toDataURL();
            waitsForPromiseToBeResolved();
            runs(function () {
                expect(resolver.resolve).toHaveBeenCalled();
            });
        });

        it('should return data url', function () {
            stageService.toDataURL();
            waitsForPromiseToBeResolved();
            runs(function () {
                var type = resolver.resolve.mostRecentCall.args[0].substring(0, 21);
                expect(type).toBe('data:image/png;base64');
            });
        });

        function waitsForPromiseToBeResolved() {
            waitsFor(function () {
                return resolver.resolve.calls.length > 0;
            }, 'promise to be resolved', 5000);
        }
    });
});
