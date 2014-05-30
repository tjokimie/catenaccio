describe('Directive: drawMove', function () {
    'use strict';

    beforeEach(module('catenaccio.directives'));

    var element, scope, pencilService;

    beforeEach(module(function ($provide) {
        pencilService = jasmine.createSpyObj('pencilService', ['hasStarted', 'toggleDraw']);
        $provide.value('pencilService', pencilService);
    }));

    beforeEach(inject(function ($rootScope) {
        element = angular.element('<draw-move></draw-move>');
        scope = $rootScope.$new();
    }));

    it('should toggle draw on click', inject(function ($compile) {
        element = $compile(element)(scope);
        scope.$digest();
        element.click();
        expect(pencilService.toggleDraw).toHaveBeenCalled();
    }));

    it('should show arrows when drawing', inject(function ($compile) {
        pencilService.hasStarted.andReturn(true);
        element = $compile(element)(scope);
        scope.$digest();
        expect(element.find('i')).toHaveClass('fa-arrows');
    }));

    it('should show pencil when not drawing', inject(function ($compile) {
        pencilService.hasStarted.andReturn(false);
        element = $compile(element)(scope);
        scope.$digest();
        expect(element.find('i')).toHaveClass('fa-pencil');
    }));
});
