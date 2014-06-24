angular.module('catenaccio.directives')
    .directive('redo', function (layerService) {
        'use strict';

        return {
            restrict: 'E',
            replace: true,
            scope: true,
            template: [
                '<button ng-click="redoHistory()" ng-class="{ disabled: isDisabled() }"',
                '        tooltip="{{ \'REDO\' | translate }}">',
                '  <i class="fa fa-repeat"></i>',
                '</button>'
            ].join('\n'),
            link: function ($scope) {
                $scope.isDisabled = function () {
                    return !layerService.hasHistoryRedo();
                };
                $scope.redoHistory = function () {
                    if (!$scope.isDisabled()) {
                        layerService.redoHistory();
                    }
                };
            }
        };
    });
