describe('Service: pencilService', function () {
    'use strict';

    beforeEach(module('catenaccio.services'));

    var pencilService, stageService, layerService;

    beforeEach(module(function ($provide) {
        stageService = jasmine.createSpyObj('stageService', ['addListener', 'removeListener', 'getPointerPosition']);
        stageService.addListener.and.returnValue(stageService);
        stageService.removeListener.and.returnValue(stageService);
        layerService  = jasmine.createSpyObj('layerService', ['addShape', 'setDraggable', 'drawLayer', 'makeHistory']);
        $provide.value('stageService', stageService);
        $provide.value('layerService', layerService);
    }));

    /* jshint camelcase: false */
    beforeEach(inject(function (_pencilService_) {
        pencilService = _pencilService_;
    }));
    /* jshint camelcase: true */

    describe('toggle draw', function () {
        beforeEach(function () {
            pencilService.toggleDraw();
        });

        describe('on draw', function () {
            it('should have started draw', function () {
                expect(pencilService.hasStarted()).toBe(true);
            });

            it('should set cursor to crosshair', function () {
                expect(document.body.style.cursor).toBe('crosshair');
            });

            it('should set layer draggable to false', function () {
                expect(layerService.setDraggable.calls.mostRecent().args[0]).toBe(false);
            });

            it('should set listeners', function () {
                expect(stageService.addListener.calls.count()).toBe(3);
            });
        });

        describe('after draw', function () {
            beforeEach(function () {
                pencilService.toggleDraw();
            });

            it('should have ended draw', function () {
                expect(pencilService.hasStarted()).toBe(false);
            });

            it('should set cursor to default', function () {
                expect(document.body.style.cursor).toBe('default');
            });

            it('should set layer draggable to true', function () {
                expect(layerService.setDraggable.calls.mostRecent().args[0]).toBe(true);
            });

            it('should remove listeners', function () {
                expect(stageService.removeListener.calls.count()).toBe(3);
            });
        });
    });

    describe('mouse and touch events', function () {
        var listeners = {}, startPoint;

        beforeEach(function () {
            startPoint = { x: 1, y: 2 };
            stageService.addListener.and.callFake(function (name, fn) {
                listeners[name] = fn;
                return stageService;
            });
            stageService.getPointerPosition.and.returnValue(startPoint);
            pencilService.toggleDraw();
            listeners['mousedown touchstart']();
        });

        it('should create spline on mousedown or touchstart', function () {
            var points = layerService.addShape.calls.mostRecent().args[0].getPoints();
            expect(points.length).toBe(2);
            expect(points[0]).toEqual(startPoint.x);
            expect(points[1]).toEqual(startPoint.y);
        });

        it('should continue spline on mousemove or touchmove', function () {
            var point = { x: 2, y: 3 };
            stageService.getPointerPosition.and.returnValue(point);
            listeners['mousemove touchmove']();
            var points = layerService.addShape.calls.mostRecent().args[0].getPoints();
            expect(points.length).toBe(4);
            expect(points[2]).toEqual(point.x);
            expect(points[3]).toEqual(point.y);
            expect(layerService.drawLayer).toHaveBeenCalled();
        });

        it('should end spline on mouseup or touchend', function () {
            var point = { x: 3, y: 4 };
            stageService.getPointerPosition.and.returnValue(point);
            listeners['mouseup touchend']();
            var points = layerService.addShape.calls.mostRecent().args[0].getPoints();
            expect(points.length).toBe(4);
            expect(points[2]).toEqual(point.x);
            expect(points[3]).toEqual(point.y);
            expect(layerService.drawLayer).toHaveBeenCalled();
        });

        describe('after mouseup or touchend', function () {
            beforeEach(function () {
                listeners['mouseup touchend']();
            });

            it('should make history', function () {
                expect(layerService.makeHistory).toHaveBeenCalled();
            });

            it('should not draw on mousemove or touchmove', function () {
                listeners['mousemove touchmove']();
                var points = layerService.addShape.calls.mostRecent().args[0].getPoints();
                expect(points.length).toBe(4);
                expect(layerService.drawLayer.calls.count()).toBe(1);
            });

            it('should not draw on mouseup or touchend', function () {
                listeners['mouseup touchend']();
                var points = layerService.addShape.calls.mostRecent().args[0].getPoints();
                expect(points.length).toBe(4);
                expect(layerService.drawLayer.calls.count()).toBe(1);
            });
        });
    });
});
