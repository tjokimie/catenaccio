describe('Service: locationService', function () {
    'use strict';

    beforeEach(module('catenaccio.services'));

    var locationService, $route, $location, $rootScope;

    beforeEach(inject(function (_locationService_, _$route_, _$location_, _$rootScope_) {
        locationService = _locationService_;
        $route = _$route_;
        $location = _$location_;
        $rootScope = _$rootScope_;
    }));

    it('should call location path', function () {
        spyOn($location, 'path').andCallThrough();
        locationService.pathWithoutReload('/foo');
        expect($location.path).toHaveBeenCalledWith('/foo');
    });

    it('should set current route back to previous route', function () {
        $route.current = '/previous';
        locationService.pathWithoutReload('/new');
        $rootScope.$digest();
        expect($route.current).toBe('/previous');
    });
});
