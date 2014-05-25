angular.module('catenaccio.services')
    .factory('stageService', function ($q, pitchDimensions) {
        'use strict';

        var stageService = {};

        var self = this;
        self.listeners = [];

        stageService.newStage = function (width, height, container) {
            var options = getScaledStageOptions(width, height);
            options.container = container;
            self.stage = new Kinetic.Stage(options);
            setListeners();
        };

        stageService.addLayer = function (layer) {
            self.stage.add(layer);
        };

        stageService.addListener = function (event, fn) {
            var container = self.stage.getContainer();
            var listener = [ event, fn, false ];
            self.listeners.push(listener);
            container.addEventListener.apply(container, listener);
        };

        stageService.removeListener = function (event, fn) {
            var container = self.stage.getContainer();
            var listener = [ event, fn, false ];
            var index = self.listeners.indexOf(listener);
            if (index >= 0) {
                self.listeners.splice(index, 0);
            }
            container.removeEventListener.apply(container, listener);
        };

        stageService.getWidth = function () {
            return self.stage.getWidth();
        };

        stageService.getHeight = function () {
            return self.stage.getHeight();
        };

        stageService.getPointerPosition = function () {
            var pointer = self.stage.getPointerPosition();
            var position = self.stage.getPosition();
            var offset = self.stage.getOffset();
            var scale = self.stage.getScale();
            return {
                x: (pointer.x / scale.x) - (position.x / scale.x) + offset.x,
                y: (pointer.y / scale.y) - (position.y / scale.y) + offset.y
            };
        };

        stageService.toDataURL = function () {
            var deferred = $q.defer();
            self.stage.toDataURL({
                callback: function (dataURL) {
                    deferred.resolve(dataURL);
                }
            });
            return deferred.promise;
        };

        function getScaledStageOptions(width, height) {
            var sideLength = pitchDimensions.SIDE_LENGTH * 2;
            var widthPerHeight = (pitchDimensions.TOUCHLINE_LENGTH + sideLength) / (pitchDimensions.GOAL_LINE_LENGTH + sideLength);
            var widthScale = width / (pitchDimensions.TOUCHLINE_LENGTH + sideLength);
            var heightScale = height / (pitchDimensions.GOAL_LINE_LENGTH + sideLength);
            if (widthScale < heightScale) {
                return {
                    width: width,
                    height: width / widthPerHeight,
                    scale: {
                        x: widthScale,
                        y: widthScale
                    }
                };
            } else {
                return {
                    width: height * widthPerHeight,
                    height: height,
                    scale: {
                        x: heightScale,
                        y: heightScale
                    }
                };
            }
        }

        function setListeners() {
            var container = self.stage.getContainer();
            self.listeners.forEach(function (listener) {
                container.addEventListener.apply(container, listener);
            });
        }

        return stageService;
    });
