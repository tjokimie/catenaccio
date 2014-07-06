describe('Directive: pitch', function () {
    'use strict';

    var element, $scope, stageService, Tactics, dimensionService;

    beforeEach(module('catenaccio.directives'));

    beforeEach(module(function ($provide) {
        stageService = jasmine.createSpyObj('stageService', [
            'newStage', 'addLayer', 'getWidth', 'getHeight'
        ]);
        $provide.value('stageService', stageService);
    }));

    /* jshint camelcase: false */
    beforeEach(inject(function ($rootScope, $controller, _Tactics_, _dimensionService_) {
        element = angular.element('<pitch tactics="tactics"></pitch>');
        $scope = $rootScope.$new();
        Tactics = _Tactics_;
        $scope.tactics = new Tactics();
        dimensionService = _dimensionService_;
    }));
    /* jshint camelcase: true */

    it('should create stage based on dimensions', inject(function ($compile) {
        spyOn(dimensionService, 'width').and.returnValue(800);
        spyOn(dimensionService, 'height').and.returnValue(600);
        $compile(element)($scope);
        expect(stageService.newStage.calls.mostRecent().args[0]).toBe(800);
        expect(stageService.newStage.calls.mostRecent().args[1]).toBe(600);
    }));

    it('should add pitch and item layers', inject(function ($compile) {
        $compile(element)($scope);
        expect(stageService.addLayer.calls.count()).toBe(2);
    }));

    it('should add background and pitch', inject(function ($compile) {
        $compile(element)($scope);
        var shapes = stageService.addLayer.calls.argsFor(0)[0].getChildren();
        expect(shapes).toHaveLength(2);
    }));

    it('should add pitch markings', inject(function ($compile) {
        $compile(element)($scope);
        var shapes = stageService.addLayer.calls.argsFor(0)[0].getChildren()[1].getChildren();
        expect(shapes).toHaveLength(8);
    }));

    it('should add home and away players and a football', inject(function ($compile) {
        $compile(element)($scope);
        var shapes = stageService.addLayer.calls.argsFor(1)[0].getChildren();
        expect(shapes).toHaveLength(11 * 2 + 1);
    }));

    it('should add pencils', inject(function ($compile) {
        spyOn(Tactics.prototype, 'getPencils').and.returnValue([[1, 2, 3, 4], [1, 2]]);
        $compile(element)($scope);
        var shapes = stageService.addLayer.calls.argsFor(1)[0].getChildren();
        expect(shapes).toHaveLength(11 * 2 + 3);
    }));
});
