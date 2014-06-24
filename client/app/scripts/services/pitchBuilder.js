angular.module('catenaccio.services')
    .constant('pitchDimensions', {
        TOUCHLINE_LENGTH: 105,
        GOAL_LINE_LENGTH: 68,
        CENTER_CIRCLE_RADIUS: 9.15,
        CORNER_ARC_RADIUS: 4,
        GOAL: {
            WIDTH: 2.44,
            LENGTH: 7.32
        },
        GOAL_AREA: {
            WIDTH: 5.5,
            HEIGHT: 18.3
        },
        PENALTY_AREA: {
            WIDTH: 16.5,
            HEIGHT: 40.3,
            SPOT_DISTANCE_FROM_GOAL_LINE: 11,
            ARC_RADIUS: 9.15
        },
        SIDE_LENGTH: 10,
        STROKE_WIDTH: 1
    })
    .provider('pitchBuilder', function () {
        'use strict';

        this.lineColor = 'white';
        this.grassColor = 'green';
        this.grassStripeColor = 'rgba(255,255,255,.1)';
        this.grassStripes = 24;

        this.setLineColor = function (lineColor) {
            this.lineColor = lineColor;
        };

        this.setGrassColor = function (grassColor) {
            this.grassColor = grassColor;
        };

        this.setGrassStripeColor = function (grassStripeColor) {
            this.grassStripeColor = grassStripeColor;
        };

        this.setGrassStripes = function (grassStripes) {
            this.grassStripes = grassStripes;
        };

        this.$get = function (pitchDimensions) {
            var pitchBuilder = {};

            var self = this;

            pitchBuilder.newLayer = function () {
                self.pitch = new Kinetic.Layer();
                self.insidePitch = new Kinetic.Group({
                    x: pitchDimensions.SIDE_LENGTH,
                    y: pitchDimensions.SIDE_LENGTH
                });
                return pitchBuilder;
            };

            pitchBuilder.addBackground = function () {
                var background = new Kinetic.Rect({
                    width: pitchDimensions.TOUCHLINE_LENGTH + pitchDimensions.SIDE_LENGTH * 2,
                    height: pitchDimensions.GOAL_LINE_LENGTH + pitchDimensions.SIDE_LENGTH * 2,
                    fill: self.grassColor
                });
                self.pitch.add(background);
                return pitchBuilder;
            };

            pitchBuilder.addGrass = function () {
                var grassLines = new Kinetic.Group();
                var grassLineWidth = pitchDimensions.TOUCHLINE_LENGTH / self.grassStripes;
                for (var i = 0; i < self.grassStripes; i++) {
                    var grassLine = new Kinetic.Rect({
                        x: grassLineWidth * i,
                        y: 0,
                        width: grassLineWidth,
                        height: pitchDimensions.GOAL_LINE_LENGTH,
                        fill: i % 2 === 0 ? self.grassColor : self.grassStripeColor
                    });
                    grassLines.add(grassLine);
                }
                self.insidePitch.add(grassLines);
                return pitchBuilder;
            };

            pitchBuilder.addGoals = function () {
                var leftGoal = new Kinetic.Rect({
                    x: -pitchDimensions.GOAL.WIDTH,
                    y: (pitchDimensions.GOAL_LINE_LENGTH - pitchDimensions.GOAL.LENGTH) / 2,
                    width: pitchDimensions.GOAL.WIDTH,
                    height: pitchDimensions.GOAL.LENGTH,
                    stroke: self.lineColor,
                    strokeWidth: pitchDimensions.STROKE_WIDTH
                });
                var rightGoal = leftGoal.clone({
                    x: pitchDimensions.TOUCHLINE_LENGTH
                });

                var goals = new Kinetic.Group()
                    .add(leftGoal)
                    .add(rightGoal);
                self.insidePitch.add(goals);
                return pitchBuilder;
            };

            pitchBuilder.addGoalAreas = function () {
                var goalAreaLeft = new Kinetic.Rect({
                    x: 0,
                    y: (pitchDimensions.GOAL_LINE_LENGTH - pitchDimensions.GOAL_AREA.HEIGHT) / 2,
                    width: pitchDimensions.GOAL_AREA.WIDTH,
                    height: pitchDimensions.GOAL_AREA.HEIGHT,
                    stroke: self.lineColor,
                    strokeWidth: pitchDimensions.STROKE_WIDTH
                });
                var goalAreaRight = goalAreaLeft.clone({
                    x: pitchDimensions.TOUCHLINE_LENGTH - pitchDimensions.GOAL_AREA.WIDTH
                });

                var goalAreas = new Kinetic.Group()
                    .add(goalAreaLeft)
                    .add(goalAreaRight);
                self.insidePitch.add(goalAreas);
                return pitchBuilder;
            };

            pitchBuilder.addPenaltyAreas = function () {
                var penaltyArcStartAngle = 0.3 * Math.PI;
                var penaltyArcEndAngle = 1.7 * Math.PI;
                var penaltyAreaLeft = new Kinetic.Group({
                    x: 0,
                    y: (pitchDimensions.GOAL_LINE_LENGTH - pitchDimensions.PENALTY_AREA.HEIGHT) / 2
                });
                var penaltyArc = new Kinetic.Shape({
                    drawFunc: drawArc(pitchDimensions.PENALTY_AREA.SPOT_DISTANCE_FROM_GOAL_LINE, pitchDimensions.PENALTY_AREA.HEIGHT / 2, pitchDimensions.PENALTY_AREA.ARC_RADIUS, penaltyArcStartAngle, penaltyArcEndAngle),
                    stroke: self.lineColor,
                    strokeWidth: pitchDimensions.STROKE_WIDTH
                });
                var penaltySpot = createSpot({
                    x: pitchDimensions.PENALTY_AREA.SPOT_DISTANCE_FROM_GOAL_LINE,
                    y: pitchDimensions.PENALTY_AREA.HEIGHT / 2
                });
                var penaltyArea = new Kinetic.Rect({
                    width: pitchDimensions.PENALTY_AREA.WIDTH,
                    height: pitchDimensions.PENALTY_AREA.HEIGHT,
                    stroke: self.lineColor,
                    strokeWidth: pitchDimensions.STROKE_WIDTH
                });
                penaltyAreaLeft.add(penaltyArc)
                    .add(penaltySpot)
                    .add(penaltyArea);
                var penaltyAreaRight = penaltyAreaLeft.clone({
                    x: pitchDimensions.TOUCHLINE_LENGTH,
                    rotation: 180,
                    offsetY: pitchDimensions.PENALTY_AREA.HEIGHT
                });

                var penaltyAreas = new Kinetic.Group()
                    .add(penaltyAreaLeft)
                    .add(penaltyAreaRight);
                self.insidePitch.add(penaltyAreas);
                return pitchBuilder;
            };

            pitchBuilder.addCorners = function () {
                var topLeftCornerArcStartAngle = 0.5 * Math.PI;
                var topLeftCornerArcEndAngle = 2 * Math.PI;
                var topLeftCornerArc = new Kinetic.Shape({
                    drawFunc: drawArc(0, 0, pitchDimensions.CORNER_ARC_RADIUS, topLeftCornerArcStartAngle, topLeftCornerArcEndAngle),
                    stroke: self.lineColor,
                    strokeWidth: pitchDimensions.STROKE_WIDTH
                });
                var topRightCornerArc = topLeftCornerArc.clone({
                    x: pitchDimensions.TOUCHLINE_LENGTH,
                    y: 0,
                    rotation: 90
                });
                var bottomLeftCornerArc = topLeftCornerArc.clone({
                    x: 0,
                    y: pitchDimensions.GOAL_LINE_LENGTH,
                    rotation: 270
                });
                var bottomRightCornerArc = topLeftCornerArc.clone({
                    x: pitchDimensions.TOUCHLINE_LENGTH,
                    y: pitchDimensions.GOAL_LINE_LENGTH,
                    rotation: 180
                });

                var corners = new Kinetic.Group()
                    .add(topLeftCornerArc)
                    .add(topRightCornerArc)
                    .add(bottomLeftCornerArc)
                    .add(bottomRightCornerArc);
                self.insidePitch.add(corners);
                return pitchBuilder;
            };

            pitchBuilder.addHalfwayLine = function () {
                var halfwayLine = new Kinetic.Line({
                    points: [pitchDimensions.TOUCHLINE_LENGTH / 2, 0, pitchDimensions.TOUCHLINE_LENGTH / 2, pitchDimensions.GOAL_LINE_LENGTH],
                    stroke: self.lineColor,
                    strokeWidth: pitchDimensions.STROKE_WIDTH
                });
                self.insidePitch.add(halfwayLine);
                return pitchBuilder;
            };

            pitchBuilder.addCenterCircle = function () {
                var center = new Kinetic.Group({
                    x: pitchDimensions.TOUCHLINE_LENGTH / 2,
                    y: pitchDimensions.GOAL_LINE_LENGTH / 2
                });
                var centerCircle = new Kinetic.Circle({
                    radius: pitchDimensions.CENTER_CIRCLE_RADIUS,
                    stroke: self.lineColor,
                    strokeWidth: pitchDimensions.STROKE_WIDTH
                });
                var centerSpot = createSpot();

                center.add(centerCircle).add(centerSpot);
                self.insidePitch.add(center);
                return pitchBuilder;
            };

            pitchBuilder.addTouchlineAndGoalLine = function () {
                var touchlineAndGoalLine = new Kinetic.Rect({
                    width: pitchDimensions.TOUCHLINE_LENGTH,
                    height: pitchDimensions.GOAL_LINE_LENGTH,
                    stroke: self.lineColor,
                    strokeWidth: pitchDimensions.STROKE_WIDTH
                });
                self.insidePitch.add(touchlineAndGoalLine);
                return pitchBuilder;
            };

            pitchBuilder.build = function () {
                return self.pitch.add(self.insidePitch);
            };

            function drawArc(x, y, r, startAngle, endAngle) {
                return function (context) {
                    context.beginPath();
                    context.arc(x, y, r, startAngle, endAngle, true);
                    context.fillStrokeShape(this);
                };
            }

            function createSpot(options) {
                var defaults = {
                    radius: pitchDimensions.STROKE_WIDTH,
                    stroke: self.lineColor,
                    fill: self.lineColor,
                    strokeWidth: pitchDimensions.STROKE_WIDTH
                };
                return new Kinetic.Circle(angular.extend({}, defaults, options || {}));
            }

            return pitchBuilder;
        };
    });
