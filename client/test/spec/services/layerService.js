describe('Service: layerService', function () {
    'use strict';

    beforeEach(module('catenaccio.services'));

    var layerService, stageService, layer;

    beforeEach(module(function ($provide) {
        stageService = jasmine.createSpyObj('stageService', ['addLayer']);
        $provide.value('stageService', stageService);
    }));

    /* jshint camelcase: false */
    beforeEach(inject(function (_layerService_) {
        layerService = _layerService_;
        layer = new Kinetic.Layer();
    }));
    /* jshint camelcase: true */

    describe('set layer', function () {
        beforeEach(function () {
            layerService.setLayer(layer);
            spyOn(layer, 'destroy');
        });

        it('should add layer to stage', function () {
            expect(stageService.addLayer).toHaveBeenCalled();
        });

        it('should destroy old layer', function () {
            var newLayer = new Kinetic.Layer();
            layerService.setLayer(newLayer);
            expect(layer.destroy).toHaveBeenCalled();
        });
    });

    describe('add shape', function () {
        var circle;

        beforeEach(function () {
            circle = new Kinetic.Circle();
            layerService.setLayer(layer);
            layerService.addShape(circle);
        });

        it('should add shape to layer', function () {
            expect(layer.getChildren().length).toBe(1);
        });

        it('should set shape draggable', function () {
            expect(circle.draggable()).toBe(true);
        });

        describe('drag listeners', function () {
            beforeEach(function () {
                document.body.style.cursor = 'text';
                spyOn(circle, 'moveToTop');
            });

            describe('when drag is enabled', function () {
                it('should set cursor to pointer on mouseover', function () {
                    circle.fire('mouseover');
                    expect(document.body.style.cursor).toBe('pointer');
                });

                it('should set cursor to auto on mouseout', function () {
                    circle.fire('mouseout');
                    expect(document.body.style.cursor).toBe('auto');
                });

                it('should set cursor to move on dragstart', function () {
                    circle.fire('dragstart');
                    expect(document.body.style.cursor).toBe('move');
                });

                it('should set cursor to auto on dragend', function () {
                    circle.fire('dragend');
                    expect(document.body.style.cursor).toBe('auto');
                });

                it('should move element to top on dragstart', function () {
                    circle.fire('dragstart');
                    expect(circle.moveToTop).toHaveBeenCalled();
                });
            });

            describe('when drag is disabled', function () {
                beforeEach(function () {
                    layerService.setDraggable(false);
                });

                it('should disable mouseover', function () {
                    circle.fire('mouseover');
                    expect(document.body.style.cursor).toBe('text');
                });

                it('should disable mouseout', function () {
                    circle.fire('mouseout');
                    expect(document.body.style.cursor).toBe('text');
                });

                it('should disable dragstart', function () {
                    circle.fire('dragstart');
                    expect(document.body.style.cursor).toBe('text');
                });

                it('should disable dragend', function () {
                    circle.fire('dragend');
                    expect(document.body.style.cursor).toBe('text');
                    expect(circle.moveToTop).not.toHaveBeenCalled();
                });
            });
        });
    });

    describe('find shapes', function () {
        beforeEach(function () {
            var circle = new Kinetic.Circle();
            var rectangle = new Kinetic.Rect();
            layerService.setLayer(layer);
            layerService.addShape(circle);
            layerService.addShape(rectangle);
        });

        it('should not find shapes', function () {
            expect(layerService.findShapes('Text').length).toBe(0);
        });

        it('should have shapes', function () {
            expect(layerService.findShapes('Circle').length).toBe(1);
        });
    });

    describe('set listener', function () {
        var listener;

        beforeEach(function () {
            layerService.setLayer(layer);
            listener = jasmine.createSpy('listener');
            layerService.addListener('click', listener);
        });

        it('should add listener to layer', function () {
            layer.fire('click');
            expect(listener).toHaveBeenCalled();
        });

        it('should be able to add listener before layer init', function () {
            layer.fire('click');
            expect(listener).toHaveBeenCalled();
        });

        it('should have listeners on new layer', function () {
            var newLayer = new Kinetic.Layer();
            layerService.setLayer(newLayer);
            newLayer.fire('click');
            expect(listener).toHaveBeenCalled();
        });
    });

    describe('set draggable', function () {
        beforeEach(function () {
            var circle = new Kinetic.Circle();
            layer.add(circle);
            layerService.setLayer(layer);
            layerService.setDraggable(false);
        });

        it('should disable drag on children', function () {
            expect(layer.getChildren()[0].draggable()).toBe(false);
        });

        it('should enable drag on children', function () {
            layerService.setDraggable(true);
            expect(layer.getChildren()[0].draggable()).toBe(true);
        });
    });

    describe('draw layer', function () {
        it('should call draw', function () {
            spyOn(layer, 'draw');
            layerService.setLayer(layer);
            layerService.drawLayer();
            expect(layer.draw).toHaveBeenCalled();
        });
    });

    describe('history', function () {
        beforeEach(function () {
            var circle = new Kinetic.Circle();
            layerService.setLayer(layer);
            layerService.addShape(circle);
            spyOn(layerService, 'setLayer').and.callThrough();
        });

        it('should not have undo', function () {
            expect(layerService.hasHistoryUndo()).toBe(false);
        });

        it('should not have redo', function () {
            expect(layerService.hasHistoryRedo()).toBe(false);
        });

        it('should make history on drag', function () {
            layer.fire('dragend');
            expect(layerService.hasHistoryUndo()).toBe(true);
        });

        describe('after make', function () {
            beforeEach(function () {
                layerService.makeHistory();
            });

            it('should have undo', function () {
                expect(layerService.hasHistoryUndo()).toBe(true);
            });

            it('should do undo', function () {
                layerService.undoHistory();
                var children = layerService.setLayer.calls.mostRecent().args[0].getChildren();
                expect(children.length).toBe(0);
            });
        });

        describe('after make and undo', function () {
            beforeEach(function () {
                layerService.makeHistory();
                layerService.undoHistory();
            });

            it('should have redo', function () {
                expect(layerService.hasHistoryRedo()).toBe(true);
            });

            it('should do redo', function () {
                layerService.redoHistory();
                var children = layerService.setLayer.calls.mostRecent().args[0].getChildren();
                expect(children.length).toBe(1);
            });

            it('should not have redo after make', function () {
                layerService.makeHistory();
                expect(layerService.hasHistoryRedo()).toBe(false);
            });
        });
    });

    describe('saved', function () {
        beforeEach(function () {
            layerService.setLayer(layer);
        });

        it('should be saved after init', function () {
            expect(layerService.hasSaved()).toBe(true);
        });

        it('should set saved', function () {
            layerService.makeHistory();
            layerService.setSaved(true);
            expect(layerService.hasSaved()).toBe(true);
        });

        it('should not be saved after history make', function () {
            layerService.makeHistory();
            expect(layerService.hasSaved()).toBe(false);
        });

        it('should not be saved after history undo', function () {
            layerService.makeHistory();
            layerService.setSaved(true);
            layerService.undoHistory();
            expect(layerService.hasSaved()).toBe(false);
        });

        it('should not be saved after history redo', function () {
            layerService.makeHistory();
            layerService.undoHistory();
            layerService.setSaved(true);
            layerService.redoHistory();
            expect(layerService.hasSaved()).toBe(false);
        });
    });
});
