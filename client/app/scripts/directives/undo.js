angular.module('catenaccio.directives')
    .directive('undo', function (layerService) {
        'use strict';

        return {
            restrict: 'E',
            replace: true,
            scope: true,
            template: [
                '<button ng-click="undoHistory()" ng-class="{ disabled: isDisabled() }"',
                '        tooltip="{{ \'UNDO\' | translate }}">',
                '  <i class="fa fa-undo"></i>',
                '</button>'
            ].join('\n'),
            link: function ($scope) {
                $scope.isDisabled = function () {
                    return !layerService.hasHistoryUndo();
                };
                $scope.undoHistory = function () {
                    if (!$scope.isDisabled()) {
                        layerService.undoHistory();
                    }
                };
            }
        };
    });
