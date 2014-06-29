describe('Service: pitchBuilder', function () {
    'use strict';

    beforeEach(module('catenaccio.services'));

    var pitchBuilder;

    /* jshint camelcase: false */
    beforeEach(inject(function (_pitchBuilder_) {
        pitchBuilder = _pitchBuilder_;
    }));
    /* jshint camelcase: true */

    it('should add background', function () {
        var layer = pitchBuilder.newLayer().addBackground().build();
        expect(layer.getChildren().length).toBe(2);
    });

    it('should add pitch markings', function () {
        var layer = pitchBuilder.newLayer()
            .addGoals().addGoalAreas().addPenaltyAreas()
            .addCorners().addHalfwayLine().addCenterCircle()
            .addTouchlineAndGoalLine().build();
        expect(layer.getChildren().length).toBe(1);
        expect(layer.getChildren()[0].getChildren().length).toBe(7);
    });
});
