describe('Service: pencilService', function () {
    'use strict';

    beforeEach(module('catenaccio.services'));

    var pencilService, stageService, layerService;

    beforeEach(module(function ($provide) {
        stageService = jasmine.createSpyObj('stageService', ['addListener', 'removeListener', 'getPointerPosition']);
        stageService.addListener.andReturn(stageService);
        stageService.removeListener.andReturn(stageService);
        layerService  = jasmine.createSpyObj('layerService', ['addShape', 'setDraggable', 'drawLayer', 'makeHistory']);
        $provide.value('stageService', stageService);
        $provide.value('layerService', layerService);
    }));

    beforeEach(inject(function (_pencilService_) {
        pencilService = _pencilService_;
    }));

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
                expect(layerService.setDraggable.mostRecentCall.args[0]).toBe(false);
            });

            it('should set listeners', function () {
                expect(stageService.addListener.calls.length).toBe(3);
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
                expect(layerService.setDraggable.mostRecentCall.args[0]).toBe(true);
            });

            it('should remove listeners', function () {
                expect(stageService.removeListener.calls.length).toBe(3);
            });
        });
    });

    describe('mouse events', function () {
        var listeners = {}, startPoint;

        beforeEach(function () {
            startPoint = { x: 1, y: 2 };
            stageService.addListener.andCallFake(function (name, fn) {
                listeners[name] = fn;
                return stageService;
            });
            stageService.getPointerPosition.andReturn(startPoint);
            pencilService.toggleDraw();
            listeners.mousedown();
        });

        it('should create spline on mousedown', function () {
            var points = layerService.addShape.mostRecentCall.args[0].getPoints();
            expect(points.length).toBe(2);
            expect(points[0]).toEqual(startPoint.x);
            expect(points[1]).toEqual(startPoint.y);
        });

        it('should continue spline on mousemove', function () {
            var point = { x: 2, y: 3 };
            stageService.getPointerPosition.andReturn(point);
            listeners.mousemove();
            var points = layerService.addShape.mostRecentCall.args[0].getPoints();
            expect(points.length).toBe(4);
            expect(points[2]).toEqual(point.x);
            expect(points[3]).toEqual(point.y);
            expect(layerService.drawLayer).toHaveBeenCalled();
        });

        it('should end spline on mouseup', function () {
            var point = { x: 3, y: 4 };
            stageService.getPointerPosition.andReturn(point);
            listeners.mouseup();
            var points = layerService.addShape.mostRecentCall.args[0].getPoints();
            expect(points.length).toBe(4);
            expect(points[2]).toEqual(point.x);
            expect(points[3]).toEqual(point.y);
            expect(layerService.drawLayer).toHaveBeenCalled();
        });

        describe('after draw', function () {
            beforeEach(function () {
                listeners.mouseup();
            });

            it('should make history', function () {
                expect(layerService.makeHistory).toHaveBeenCalled();
            });

            it('should not draw on mousemove', function () {
                listeners.mousemove();
                var points = layerService.addShape.mostRecentCall.args[0].getPoints();
                expect(points.length).toBe(4);
                expect(layerService.drawLayer.calls.length).toBe(1);
            });

            it('should not draw on mouseup', function () {
                listeners.mouseup();
                var points = layerService.addShape.mostRecentCall.args[0].getPoints();
                expect(points.length).toBe(4);
                expect(layerService.drawLayer.calls.length).toBe(1);
            });
        });
    });
});
