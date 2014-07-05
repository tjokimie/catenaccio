angular.module('catenaccio')
    .controller('PitchController', function ($scope, tactics) {
        'use strict';

        $scope.tactics = tactics;
    });
