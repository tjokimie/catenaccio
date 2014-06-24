angular.module('catenaccio.directives')
    .directive('new', function ($location, $route) {
        'use strict';

        return {
            restrict: 'E',
            replace: true,
            scope: true,
            template: [
                '<button ng-click="new()" tooltip="{{ \'NEW\' | translate }}">',
                '  <i class="fa fa-trash-o"></i>',
                '</button>'
            ].join('\n'),
            link: function ($scope) {
                $scope.new = function () {
                    if ($location.path() !== '/') {
                        $location.path('/');
                    } else {
                        $route.reload();
                    }
                };
            }
        };
    });
