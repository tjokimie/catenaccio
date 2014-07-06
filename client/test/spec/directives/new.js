describe('Directive: new', function () {
    'use strict';

    beforeEach(module('catenaccio.directives'));

    var element, $scope, $location, $route;

    /* jshint camelcase: false */
    beforeEach(inject(function ($rootScope, _$location_, _$route_) {
        element = angular.element('<new></new>');
        $scope = $rootScope.$new();
        $location = _$location_;
        $route = _$route_;
        spyOn($route, 'reload');
    }));
    /* jshint camelcase: true */

    it('should redirect when not in root', inject(function ($compile) {
        spyOn($location, 'path').and.returnValue('/foo');
        element = $compile(element)($scope);
        $scope.$digest();
        element.click();
        expect($location.path).toHaveBeenCalledWith('/');
    }));

    it('should reload when in root', inject(function ($compile) {
        spyOn($location, 'path').and.returnValue('/');
        element = $compile(element)($scope);
        $scope.$digest();
        element.click();
        expect($route.reload).toHaveBeenCalled();
    }));
});
