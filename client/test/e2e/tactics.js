describe('Catenaccio', function () {
    'use strict';

    var Catenaccio = require('./Catenaccio');

    it('should save tactics', function () {
        var catenaccio = new Catenaccio();
        catenaccio.get();
        catenaccio.save();
        expect(catenaccio.notification.getAttribute('notification-tooltip')).toBe('Saved!');
    });

    it('should redirect after save', function () {
        var catenaccio = new Catenaccio();
        catenaccio.get();
        catenaccio.save();
        expect(browser.getCurrentUrl()).toMatch(/[A-Za-z0-9_\-]{7,12}/);
    });
});