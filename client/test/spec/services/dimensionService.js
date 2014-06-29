describe('Service: dimensionService', function () {
    'use strict';

    beforeEach(module('catenaccio.services'));

    var dimensionService;

    /* jshint camelcase: false */
    beforeEach(inject(function (_dimensionService_) {
        dimensionService = _dimensionService_;
    }));
    /* jshint camelcase: true */

    it('should calculate width', function () {
        spyOn(jQuery.fn, 'width').andReturn(1000);
        spyOn(jQuery.fn, 'css').andReturn('100px');
        expect(dimensionService.width()).toBe(800);
    });

    it('should calculate height', function () {
        spyOn(jQuery.fn, 'height').andReturn(500);
        spyOn(jQuery.fn, 'css').andReturn('50px');
        expect(dimensionService.height()).toBe(400);
    });
});
