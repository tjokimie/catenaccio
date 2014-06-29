angular.module('catenaccio.services')
    .factory('dimensionService', function ($window) {
        'use strict';

        var dimensionService = {};

        dimensionService.width = function () {
            return $($window).width() * 0.8;
        };

        dimensionService.height = function () {
            return $($window).height() * 0.8;
        };

        return dimensionService;
    });
