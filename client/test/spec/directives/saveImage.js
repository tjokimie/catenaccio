describe('Directive: saveImage', function () {
    'use strict';

    beforeEach(module('catenaccio.directives', 'views/save_image_modal.html'));

    var element, $scope, document, stageService;

    beforeEach(module(function ($provide) {
        stageService = jasmine.createSpyObj('stageService', ['toDataURL']);
        stageService.toDataURL.and.returnValue('data:image/png;base64,FOO');
        $provide.value('stageService', stageService);
    }));

    beforeEach(inject(function ($rootScope, $document) {
        element = angular.element('<save-image></save-image>');
        $scope = $rootScope.$new();
        document = $document;
    }));

    afterEach(function () {
        var body = document.find('body');
        body.find('div.modal').remove();
        body.find('div.modal-backdrop').remove();
        body.removeClass('modal-open');
    });

    it('should call data url on open', inject(function ($compile) {
        element = $compile(element)($scope);
        $scope.$digest();
        element.click();
        expect(stageService.toDataURL).toHaveBeenCalled();
    }));

    it('should have data in image', inject(function ($compile) {
        element = $compile(element)($scope);
        $scope.$digest();
        element.click();
        expect(document.find('.modal-body img')).toHaveAttr('src', 'data:image/png;base64,FOO');
    }));

    it('should be disabled after click', inject(function ($compile) {
        element = $compile(element)($scope);
        $scope.$digest();
        element.click();
        expect(element).toHaveClass('disabled');
    }));

    it('should not call data url when disabled', inject(function ($compile) {
        element = $compile(element)($scope);
        $scope.$digest();
        element.click();
        element.click();
        expect(stageService.toDataURL.calls.count()).toBe(1);
    }));

    it('should be enabled after close', inject(function ($compile) {
        element = $compile(element)($scope);
        $scope.$digest();
        element.click();
        document.find('.modal-close').click();
        expect(element).not.toHaveClass('disabled');
    }));
});
