describe('Directive: save', function () {
    'use strict';

    beforeEach(module('catenaccio.directives'));

    var element, scope, httpBackend, Tactics, $location, layerService, notificationService;

    beforeEach(inject(function ($rootScope, $httpBackend, _Tactics_, _$location_, _layerService_, _notificationService_) {
        element = angular.element('<save></save>');
        scope = $rootScope.$new();
        httpBackend = $httpBackend;
        Tactics = _Tactics_;
        spyOn(Tactics.prototype, 'fromShapes');
        $location = _$location_;
        spyOn($location, 'path');
        layerService = _layerService_;
        spyOn(layerService, 'hasSaved').andReturn(false);
        notificationService = _notificationService_;
        spyOn(notificationService, 'setNotification');
    }));

    afterEach(function () {
        httpBackend.verifyNoOutstandingExpectation();
        httpBackend.verifyNoOutstandingRequest();
    });

    it('should save items', inject(function ($compile) {
        element = $compile(element)(scope);
        scope.$digest();
        httpBackend.expectPOST('/api/tactics').respond(201);
        element.click();
        httpBackend.flush();
    }));

    it('should use layer shapes', inject(function ($compile) {
        element = $compile(element)(scope);
        scope.$digest();
        httpBackend.expectPOST('/api/tactics').respond(201);
        element.click();
        expect(Tactics.prototype.fromShapes).toHaveBeenCalled();
        httpBackend.flush();
    }));

    it('should disable save when saving', inject(function ($compile) {
        element = $compile(element)(scope);
        scope.$digest();
        httpBackend.expectPOST('/api/tactics').respond(201);
        element.click();
        expect(element).toHaveClass('disabled');
        httpBackend.flush();
    }));

    it('should disable when tactics are saved', inject(function ($compile) {
        layerService.hasSaved.andReturn(true);
        element = $compile(element)(scope);
        scope.$digest();
        expect(element).toHaveClass('disabled');
    }));

    it('should not call save when tactics are saved', inject(function ($compile) {
        layerService.hasSaved.andReturn(true);
        element = $compile(element)(scope);
        scope.$digest();
        element.click();
    }));

    describe('after successful save', function () {
        beforeEach(inject(function ($compile) {
            spyOn(layerService, 'setSaved');
            element = $compile(element)(scope);
            scope.$digest();
            httpBackend.expectPOST('/api/tactics').respond(201, { id: '1' });
            element.click();
            httpBackend.flush();
        }));

        it('should enable save', function () {
            expect(element).not.toHaveClass('disabled');
        });

        it('should set saved', function () {
            expect(layerService.setSaved).toHaveBeenCalledWith(true);
        });

        it('should notify', function () {
            expect(notificationService.setNotification).toHaveBeenCalled();
        });

        it('should change location', function () {
            expect($location.path).toHaveBeenCalledWith('/1');
        });
    });

    describe('after unsuccessful save', function () {
        beforeEach(inject(function ($compile) {
            element = $compile(element)(scope);
            scope.$digest();
            httpBackend.expectPOST('/api/tactics').respond(400);
            element.click();
            httpBackend.flush();
        }));

        it('should enable save', function () {
            expect(element).not.toHaveClass('disabled');
        });

        it('should not change location', function () {
            expect($location.path).not.toHaveBeenCalled();
        });

        it('should notify', function () {
            expect(notificationService.setNotification).toHaveBeenCalled();
        });
    });
});
