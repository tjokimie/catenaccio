describe('Directive: redo', function () {
    'use strict';

    beforeEach(module('catenaccio.directives'));

    var element, $scope, layerService;

    beforeEach(module(function ($provide) {
        layerService = jasmine.createSpyObj('layerService', ['hasHistoryRedo', 'redoHistory']);
        $provide.value('layerService', layerService);
    }));

    beforeEach(inject(function ($rootScope) {
        element = angular.element('<redo></redo>');
        $scope = $rootScope.$new();
    }));

    it('should redo history on click', inject(function ($compile) {
        layerService.hasHistoryRedo.andReturn(true);
        element = $compile(element)($scope);
        $scope.$digest();
        element.click();
        expect(layerService.redoHistory).toHaveBeenCalled();
    }));

    it('should disable the button', inject(function ($compile) {
        layerService.hasHistoryRedo.andReturn(false);
        element = $compile(element)($scope);
        $scope.$digest();
        expect(element).toHaveClass('disabled');
    }));

    it('should not call redo when disabled', inject(function ($compile) {
        layerService.hasHistoryRedo.andReturn(false);
        element = $compile(element)($scope);
        $scope.$digest();
        element.click();
        expect(layerService.redoHistory).not.toHaveBeenCalled();
    }));

    it('should enable the button', inject(function ($compile) {
        layerService.hasHistoryRedo.andReturn(true);
        element = $compile(element)($scope);
        $scope.$digest();
        expect(element).not.toHaveClass('disabled');
    }));
});
