describe('Directive: save', function () {
    'use strict';

    beforeEach(module('catenaccio.directives'));

    var element, $scope, $httpBackend, Tactics, locationService, layerService, notificationService;

    /* jshint camelcase: false */
    beforeEach(inject(
        function ($rootScope, _$httpBackend_, _Tactics_, _locationService_, _layerService_, _notificationService_) {
            element = angular.element('<save></save>');
            $scope = $rootScope.$new();
            $httpBackend = _$httpBackend_;
            Tactics = _Tactics_;
            spyOn(Tactics.prototype, 'fromShapes');
            locationService = _locationService_;
            spyOn(locationService, 'pathWithoutReload');
            layerService = _layerService_;
            spyOn(layerService, 'hasSaved').andReturn(false);
            notificationService = _notificationService_;
            spyOn(notificationService, 'success').andCallThrough();
            spyOn(notificationService, 'error').andCallThrough();
        }
    ));
    /* jshint camelcase: true */

    afterEach(function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it('should save items', inject(function ($compile) {
        element = $compile(element)($scope);
        $scope.$digest();
        $httpBackend.expectPOST('/api/tactics').respond(201);
        element.find('button').click();
        $httpBackend.flush();
    }));

    it('should use layer shapes', inject(function ($compile) {
        element = $compile(element)($scope);
        $scope.$digest();
        $httpBackend.expectPOST('/api/tactics').respond(201);
        element.find('button').click();
        expect(Tactics.prototype.fromShapes).toHaveBeenCalled();
        $httpBackend.flush();
    }));

    it('should disable save when saving', inject(function ($compile) {
        element = $compile(element)($scope);
        $scope.$digest();
        $httpBackend.expectPOST('/api/tactics').respond(201);
        element.find('button').click();
        expect(element.find('button')).toHaveClass('disabled');
        $httpBackend.flush();
    }));

    it('should disable when tactics are saved', inject(function ($compile) {
        layerService.hasSaved.andReturn(true);
        element = $compile(element)($scope);
        $scope.$digest();
        expect(element.find('button')).toHaveClass('disabled');
    }));

    it('should not call save when tactics are saved', inject(function ($compile) {
        layerService.hasSaved.andReturn(true);
        element = $compile(element)($scope);
        $scope.$digest();
        element.find('button').click();
    }));

    describe('after successful save', function () {
        beforeEach(inject(function ($compile) {
            spyOn(layerService, 'setSaved');
            element = $compile(element)($scope);
            $scope.$digest();
            $httpBackend.expectPOST('/api/tactics').respond(201, { id: '1' });
            element.find('button').click();
            $httpBackend.flush();
        }));

        it('should enable save', function () {
            expect(element).not.toHaveClass('disabled');
        });

        it('should set saved', function () {
            expect(layerService.setSaved).toHaveBeenCalledWith(true);
        });

        it('should call success notify', function () {
            expect(notificationService.success).toHaveBeenCalledWith('SUCCESS');
        });

        it('should show notification', function () {
            expect(element).toHaveClass('success');
            expect(element).toHaveAttr('notification-tooltip', 'SUCCESS');
        });

        it('should change location', function () {
            expect(locationService.pathWithoutReload).toHaveBeenCalledWith('/1');
        });
    });

    describe('after unsuccessful save', function () {
        beforeEach(inject(function ($compile) {
            element = $compile(element)($scope);
            $scope.$digest();
            $httpBackend.expectPOST('/api/tactics').respond(400);
            element.find('button').click();
            $httpBackend.flush();
        }));

        it('should enable save', function () {
            expect(element).not.toHaveClass('disabled');
        });

        it('should call error notify', function () {
            expect(notificationService.error).toHaveBeenCalledWith('ERROR');
        });

        it('should show notification', function () {
            expect(element).toHaveClass('error');
            expect(element).toHaveAttr('notification-tooltip', 'ERROR');
        });

        it('should not change location', function () {
            expect(locationService.pathWithoutReload).not.toHaveBeenCalled();
        });
    });
});
