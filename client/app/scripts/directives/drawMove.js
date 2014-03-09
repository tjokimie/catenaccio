angular.module('catenaccio.directives')
    .directive('drawMove', function (pencilService) {
        'use strict';

        return {
            restrict: 'E',
            replace: true,
            scope: true,
            template: [
                '<button ng-click="toggleDraw()"' +
                '        tooltip="{{ isDrawing() ? (\'MOVE\' | translate) : (\'DRAW\' | translate) }}"',
                '        tooltip-placement="left">',
                '  <i class="fa fa-arrows" ng-if="isDrawing()"></i>',
                '  <i class="fa fa-pencil" ng-if="!isDrawing()"></i>',
                '</button>'
            ].join('\n'),
            link: function ($scope) {
                $scope.toggleDraw = pencilService.toggleDraw;
                $scope.isDrawing = pencilService.hasStarted;
            }
        };
    });
