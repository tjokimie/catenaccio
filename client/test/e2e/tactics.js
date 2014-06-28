describe('Catenaccio', function () {
    'use strict';

    var Catenaccio = require('./Catenaccio'), catenaccio;

    beforeEach(function (){
        catenaccio = new Catenaccio();
    });

    it('should save tactics', function () {
        catenaccio.get();
        catenaccio.save();
        expect(catenaccio.notification.getAttribute('notification-tooltip')).toBe('Saved!');
    });

    it('should redirect after save', function () {
        catenaccio.get();
        catenaccio.save();
        expect(browser.getCurrentUrl()).toMatch(/\/[A-Za-z0-9_\-]{7,12}/);
    });

    it('should redirect after new', function () {
        catenaccio.new();
        expect(browser.getCurrentUrl()).toMatch(/\/$/);
    });
});
