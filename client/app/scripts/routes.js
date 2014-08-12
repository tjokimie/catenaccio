angular.module('catenaccio')
    .config(function ($routeProvider, $locationProvider) {
        'use strict';

        $routeProvider
            .when('/', {
                templateUrl: 'views/app.html',
                controller: 'PitchController',
                resolve: {
                    tactics: function ($q, Tactics) { // https://github.com/btford/ngmin/issues/35
                        var deferred = $q.defer();
                        deferred.resolve(new Tactics());
                        return deferred.promise;
                    }
                }
            })
            .when('/:id', {
                templateUrl: 'views/app.html',
                controller: 'PitchController',
                resolve: {
                    tactics: function ($route, Tactics) {
                        return Tactics.get({ id: $route.current.params.id }).$promise;
                    }
                }
            });

        $locationProvider.html5Mode(true);
    });
