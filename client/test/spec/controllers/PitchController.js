describe('Controller: PitchController', function () {
    'use strict';

    beforeEach(module('catenaccio'));

    beforeEach(module('views/app.html'));

    var scope, stageService, Tactics, dimensionService, createController;

    beforeEach(module(function ($provide) {
        stageService = jasmine.createSpyObj('stageService', [
            'newStage', 'addLayer', 'getWidth', 'getHeight'
        ]);
        $provide.value('stageService', stageService);
    }));

    /* jshint camelcase: false */
    beforeEach(inject(function ($rootScope, $controller, _Tactics_, _dimensionService_) {
        scope = $rootScope.$new();
        Tactics = _Tactics_;
        dimensionService = _dimensionService_;
        createController = function () {
            return $controller('PitchController', {
                '$scope': scope,
                tactics: new Tactics()
            });
        };
    }));
    /* jshint camelcase: true */

    it('should create stage based on dimensions', function () {
        spyOn(dimensionService, 'width').andReturn(800);
        spyOn(dimensionService, 'height').andReturn(600);
        createController();
        expect(stageService.newStage.mostRecentCall.args[0]).toBe(800);
        expect(stageService.newStage.mostRecentCall.args[1]).toBe(600);
    });

    it('should add pitch and item layers', function () {
        createController();
        expect(stageService.addLayer.calls.length).toBe(2);
    });

    it('should add background and pitch', function () {
        createController();
        var shapes = stageService.addLayer.calls[0].args[0].getChildren();
        expect(shapes.length).toBe(2);
    });

    it('should add pitch markings', function () {
        createController();
        var shapes = stageService.addLayer.calls[0].args[0].getChildren()[1].getChildren();
        expect(shapes.length).toBe(8);
    });

    it('should add home and away players and a football', function () {
        createController();
        var shapes = stageService.addLayer.calls[1].args[0].getChildren();
        expect(shapes.length).toBe(11 * 2 + 1);
    });

    it('should add pencils', function () {
        spyOn(Tactics.prototype, 'getPencils').andReturn([[1, 2, 3, 4], [1, 2]]);
        createController();
        var shapes = stageService.addLayer.calls[1].args[0].getChildren();
        expect(shapes.length).toBe(11 * 2 + 3);
    });
});
