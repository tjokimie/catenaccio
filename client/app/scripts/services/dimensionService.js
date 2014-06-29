angular.module('catenaccio.services')
    .factory('dimensionService', function ($document, $window) {
        'use strict';

        var dimensionService = {};

        dimensionService.width = function () {
            var marginLeft = $($document[0].body).css('margin-left');
            var marginRight = $($document[0].body).css('margin-right');
            return $($window).width() - parseInt(marginLeft, 10) - parseInt(marginRight, 10);
        };

        dimensionService.height = function () {
            var marginTop = $($document[0].body).css('margin-top');
            var marginBottom = $($document[0].body).css('margin-bottom');
            return $($window).height() - parseInt(marginTop, 10) - parseInt(marginBottom, 10);
        };

        return dimensionService;
    });
