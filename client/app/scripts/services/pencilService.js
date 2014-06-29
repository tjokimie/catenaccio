angular.module('catenaccio.services')
    .provider('pencilService', function () {
        'use strict';

        this.pencilColor = 'red';

        this.setPencilColor = function (pencilColor) {
            this.pencilColor = pencilColor;
        };

        this.$get = function (pitchDimensions, stageService, layerService) {
            var pencilService = {};

            var self = this;
            this.started = false;
            this.drawing = false;

            pencilService.toggleDraw = function () {
                if (!self.started) {
                    startDraw();
                } else {
                    endDraw();
                }
            };

            pencilService.hasStarted = function () {
                return self.started;
            };

            pencilService.newPencil = function (options) {
                var defaults = {
                    stroke: self.pencilColor,
                    strokeWidth: pitchDimensions.STROKE_WIDTH * 2 / 3,
                    lineCap: 'round',
                    lineJoin: 'round',
                    tension: 0
                };
                return new Kinetic.Line(angular.extend(defaults, options));
            };

            function startDraw() {
                document.body.style.cursor = 'crosshair';
                self.started = true;
                layerService.setDraggable(false);
                stageService.addListener('mousedown touchstart', start);
                stageService.addListener('mousemove touchmove', move);
                stageService.addListener('mouseup touchend', end);
            }

            function endDraw() {
                document.body.style.cursor = 'default';
                self.started = false;
                layerService.setDraggable(true);
                stageService.removeListener('mousedown touchstart', start);
                stageService.removeListener('mousemove touchmove', move);
                stageService.removeListener('mouseup touchend', end);
            }

            function start() {
                var position = stageService.getPointerPosition();
                self.drawing = true;
                var options = {
                    points: [position.x, position.y]
                };
                self.pencil = pencilService.newPencil(options);
                layerService.addShape(self.pencil);
            }

            function move() {
                if (self.drawing) {
                    addPointAndDraw();
                }
            }

            function end() {
                if (self.drawing) {
                    self.drawing = false;
                    addPointAndDraw();
                    layerService.makeHistory();
                }
            }

            function addPointAndDraw() {
                var position = stageService.getPointerPosition();
                self.pencil.attrs.points.push(position.x);
                self.pencil.attrs.points.push(position.y);
                self.pencil.setPoints(self.pencil.attrs.points);
                layerService.drawLayer();
            }

            return pencilService;
        };
    });
