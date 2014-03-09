angular.module('catenaccio.services')
    .factory('layerService', function ($rootScope, stageService) {
        'use strict';

        var layerService = {};

        var self = this;
        self.draggable = true;
        self.listeners = [];
        self.history = [];
        self.historyStep = -1;
        self.saved = false;

        layerService.setLayer = function (layer) {
            if (self.layer) {
                self.layer.destroy();
            }
            self.layer = layer;
            layerService.setDraggable(self.draggable);
            if (self.historyStep === -1) {
                init();
            }
            setListeners();
            stageService.addLayer(layer);
        };

        layerService.addShape = function (element) {
            element.draggable(self.draggable);
            setDragListeners(element);
            self.layer.add(element);
        };

        layerService.findShapes = function (selector) {
            return self.layer.find(selector);
        };

        layerService.addListener = function (event, fn) {
            self.listeners.push([event, fn]);
            if (self.layer) {
                self.layer.on(event, fn);
            }
        };

        layerService.setDraggable = function (draggable) {
            self.draggable = draggable;
            self.layer.getChildren().each(function (child) {
                child.draggable(draggable);
            });
        };

        layerService.drawLayer = function () {
            self.layer.draw();
        };

        layerService.makeHistory = function () {
            self.historyStep++;
            if (self.historyStep < self.history.length) {
                $rootScope.$safeApply(function () {
                    self.history.splice(self.historyStep, self.history.length - 1);
                });
            }
            $rootScope.$safeApply(function () {
                self.history.push(self.layer.toJSON());
            });
            layerService.setSaved(false);
        };

        layerService.undoHistory = function () {
            if (layerService.hasHistoryUndo()) {
                self.historyStep--;
                var history = self.history[self.historyStep];
                var layer = Kinetic.Node.create(history, 'container');
                layerService.setSaved(false);
                layerService.setLayer(layer);
            }
        };

        layerService.hasHistoryUndo = function () {
            return self.historyStep > 0;
        };

        layerService.redoHistory = function () {
            if (layerService.hasHistoryRedo()) {
                self.historyStep++;
                var history = self.history[self.historyStep];
                var layer = Kinetic.Node.create(history, 'container');
                layerService.setSaved(false);
                layerService.setLayer(layer);
            }
        };

        layerService.hasHistoryRedo = function () {
            return self.historyStep < self.history.length - 1;
        };

        layerService.setSaved = function (saved) {
            self.saved = saved;
        };

        layerService.hasSaved = function () {
            return self.saved;
        };

        function init() {
            self.listeners.push(['dragend', layerService.makeHistory]);
            layerService.makeHistory();
            layerService.setSaved(true);
        }

        function setListeners() {
            self.listeners.forEach(function (listener) {
                self.layer.on.apply(self.layer, listener);
            });
            self.layer.getChildren().each(setDragListeners);
        }

        function setDragListeners(element) {
            return element
                .on('mouseover', function () {
                    if (this.draggable()) {
                        document.body.style.cursor = 'pointer';
                    }
                })
                .on('mouseout', function () {
                    if (this.draggable()) {
                        document.body.style.cursor = 'default';
                    }
                })
                .on('dragstart', function () {
                    if (this.draggable()) {
                        this.moveToTop();
                        document.body.style.cursor = 'move';
                    }
                })
                .on('dragend', function () {
                    if (this.draggable()) {
                        document.body.style.cursor = 'default';
                        $rootScope.$digest();
                    }
                });
        }

        return layerService;
    });