angular.module('catenaccio.services')
    .provider('tacticsBuilder', function () {
        'use strict';

        this.homePlayerStrokeColor = 'white';
        this.homePlayerColor = 'blue';
        this.homeGoalkeeperStrokeColor = 'blue';
        this.homeGoalkeeperColor = 'white';
        this.awayPlayerStrokeColor = 'white';
        this.awayPlayerColor = 'red';
        this.awayGoalkeeperStrokeColor = 'red';
        this.awayGoalkeeperColor = 'white';
        this.footballStrokeColor = 'white';
        this.footballColor = 'black';

        this.setHomePlayerStrokeColor = function (homePlayerStrokeColor) {
            this.homePlayerStrokeColor = homePlayerStrokeColor;
        };

        this.setHomePlayerColor = function (homePlayerColor) {
            this.homePlayerColor = homePlayerColor;
        };

        this.setHomeGoalkeeperStrokeColor = function (homeGoalkeeperStrokeColor) {
            this.homeGoalkeeperStrokeColor = homeGoalkeeperStrokeColor;
        };

        this.setHomeGoalkeeperColor = function (homeGoalkeeperColor) {
            this.homeGoalkeeperColor = homeGoalkeeperColor;
        };

        this.setAwayPlayerStrokeColor = function (awayPlayerStrokeColor) {
            this.awayPlayerStrokeColor = awayPlayerStrokeColor;
        };

        this.setAwayPlayerColor = function (awayPlayerColor) {
            this.awayPlayerColor = awayPlayerColor;
        };

        this.setAwayGoalkeeperStrokeColor = function (awayGoalkeeperStrokeColor) {
            this.awayGoalkeeperStrokeColor = awayGoalkeeperStrokeColor;
        };

        this.setAwayGoalkeeperColor = function (awayGoalkeeperColor) {
            this.awayGoalkeeperColor = awayGoalkeeperColor;
        };

        this.setFootballStrokeColor = function (footballStrokeColor) {
            this.footballStrokeColor = footballStrokeColor;
        };

        this.setFootballColor = function (footballColor) {
            this.footballColor = footballColor;
        };

        this.$get = function (pitchDimensions, pencilService) {
            var tacticsBuilder = {};

            var self = this;

            tacticsBuilder.newLayer = function () {
                self.layer = [];
                return tacticsBuilder;
            };

            tacticsBuilder.setTactics = function (tactics) {
                self.tactics = tactics;
                return tacticsBuilder;
            };

            tacticsBuilder.addFootball = function () {
                var options = self.tactics.getFootball();
                options.fill = self.footballColor;
                options.stroke = self.footballStrokeColor;
                var football = createCircle(options);
                self.layer.push(football);
                return tacticsBuilder;
            };

            tacticsBuilder.addHomeGoalkeeper = function () {
                var circleOptions = {
                    fill: self.homeGoalkeeperColor,
                    stroke: self.homeGoalkeeperStrokeColor
                };
                var groupOptions = self.tactics.getHomeGoalkeeper();
                addPlayerWithNumber(groupOptions, circleOptions, 1);
                return tacticsBuilder;
            };

            tacticsBuilder.addHomePlayers = function () {
                var circleOptions = {
                    fill: self.homePlayerColor,
                    stroke: self.homePlayerStrokeColor
                };
                for (var number = 2; number <= 11; number++) {
                    var groupOptions = self.tactics.getHomePlayer(number);
                    addPlayerWithNumber(groupOptions, circleOptions, number);
                }
                return tacticsBuilder;
            };

            tacticsBuilder.addAwayGoalkeeper = function () {
                var circleOptions = {
                    fill: self.awayGoalkeeperColor,
                    stroke: self.awayGoalkeeperStrokeColor
                };
                var groupOptions = self.tactics.getAwayGoalkeeper();
                addPlayerWithNumber(groupOptions, circleOptions, 1);
                return tacticsBuilder;
            };

            tacticsBuilder.addAwayPlayers = function () {
                var circleOptions = {
                    fill: self.awayPlayerColor,
                    stroke: self.awayPlayerStrokeColor
                };
                for (var number = 2; number <= 11; number++) {
                    var groupOptions = self.tactics.getAwayPlayer(number);
                    addPlayerWithNumber(groupOptions, circleOptions, number);
                }
                return tacticsBuilder;
            };

            tacticsBuilder.addPencils = function () {
                var pencils = self.tactics.getPencils();
                _(pencils).forEach(function (pencil) {
                    var p = pencilService.newPencil(pencil);
                    self.layer.push(p);
                });
                return tacticsBuilder;
            };

            tacticsBuilder.build = function () {
                var layer = new Kinetic.Layer();
                _(self.layer)
                    .sort(function (a, b) {
                        return a.attrs.z > b.attrs.z;
                    })
                    .forEach(function (item) {
                        layer.add(item);
                    });
                return layer;
            };

            function addPlayerWithNumber(groupOptions, circleOptions, number) {
                var player = createGroupWithCircleAndText(groupOptions, circleOptions, number.toString());
                self.layer.push(player);
            }

            function createGroupWithCircleAndText(groupOptions, circleOptions, text) {
                var group = new Kinetic.Group(groupOptions);
                var circle = createCircle(circleOptions);
                textPositionBugWithSmallFontsWorkaround(group, circle);
                var options = {
                    text: text,
                    fontSize: circle.getRadius(),
                    fill: circle.getStroke()
                };
                var textShape = createText(options);
                return group.add(circle).add(textShape);
            }

            function createCircle(options) {
                var defaults = {
                    radius: pitchDimensions.STROKE_WIDTH * 3 / 2,
                    strokeWidth: pitchDimensions.STROKE_WIDTH / 2
                };
                return new Kinetic.Circle(_.extend(defaults, options || {}));
            }

            function createText(options) {
                var defaults = {
                    fontFamily: 'sans-serif',
                    fontStyle: 'bold'
                };
                var text = new Kinetic.Text(_.extend(defaults, options || {}));
                text.setOffset({
                    x: text.getWidth() / 2,
                    y: text.getHeight() / 2
                });
                return text;
            }

            function textPositionBugWithSmallFontsWorkaround(group, circle) {
                var SCALE = 10;
                group.setScale({
                    x: 1 / SCALE,
                    y: 1 / SCALE
                });
                circle.setRadius(circle.getRadius() * SCALE);
                circle.setStrokeWidth(circle.getStrokeWidth() * SCALE);
            }

            return tacticsBuilder;
        };
    });
