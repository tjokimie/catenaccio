angular.module('catenaccio.services')
    .run(['$rootScope', '$location', '$route', function ($rootScope, $location, $route) {
        'use strict';

        var pathFn = $location.path;

        $location.path = function (path, reload) {
            if (reload === false) {
                var lastRoute = $route.current;
                var off = $rootScope.$on('$locationChangeSuccess', function () {
                    $route.current = lastRoute;
                    off();
                });
            }
            return pathFn.call($location, path);
        };
    }]);
