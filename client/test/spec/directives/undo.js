describe('Directive: undo', function () {
    'use strict';

    beforeEach(module('catenaccio.directives'));

    var element, $scope, layerService;

    beforeEach(module(function ($provide) {
        layerService = jasmine.createSpyObj('layerService', ['hasHistoryUndo', 'undoHistory']);
        $provide.value('layerService', layerService);
    }));

    beforeEach(inject(function ($rootScope) {
        element = angular.element('<undo></undo>');
        $scope = $rootScope.$new();
    }));

    it('should undo history on click', inject(function ($compile) {
        layerService.hasHistoryUndo.andReturn(true);
        element = $compile(element)($scope);
        $scope.$digest();
        element.click();
        expect(layerService.undoHistory).toHaveBeenCalled();
    }));

    it('should disable the button', inject(function ($compile) {
        layerService.hasHistoryUndo.andReturn(false);
        element = $compile(element)($scope);
        $scope.$digest();
        expect(element).toHaveClass('disabled');
    }));

    it('should not call undo when disabled', inject(function ($compile) {
        layerService.hasHistoryUndo.andReturn(false);
        element = $compile(element)($scope);
        $scope.$digest();
        element.click();
        expect(layerService.undoHistory).not.toHaveBeenCalled();
    }));

    it('should enable the button', inject(function ($compile) {
        layerService.hasHistoryUndo.andReturn(true);
        element = $compile(element)($scope);
        $scope.$digest();
        expect(element).not.toHaveClass('disabled');
    }));
});
