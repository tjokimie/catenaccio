angular.module('catenaccio.services')
    .factory('locationService', function ($rootScope, $location, $route) {
        'use strict';

        var locationService = {};

        locationService.pathWithoutReload = function (path) {
            var lastRoute = $route.current;
            var off = $rootScope.$on('$locationChangeSuccess', function () {
                $route.current = lastRoute;
                off();
            });
            $location.path(path);
        };

        return locationService;
    });
