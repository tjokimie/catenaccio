describe('Controller: PitchController', function () {
    'use strict';

    beforeEach(module('catenaccio'));

    var $scope, tactics;

    beforeEach(inject(function ($rootScope, $controller, Tactics) {
        $scope = $rootScope.$new();
        tactics = new Tactics();
        $controller('PitchController', {
            '$scope': $scope,
            tactics: tactics
        });
    }));

    it('should have tactics', function () {
        expect($scope.tactics).toBe(tactics);
    });
});
