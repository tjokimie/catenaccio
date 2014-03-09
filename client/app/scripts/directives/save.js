angular.module('catenaccio.directives')
    .directive('save', function ($location, Tactics, layerService, notificationService) {
        'use strict';

        return {
            restrict: 'E',
            replace: true,
            scope: true,
            template: [
                '<button ng-click="save()" ng-class="{ disabled: isSaving || isDisabled() }"',
                '        tooltip="{{ \'SAVE\' | translate }}" tooltip-placement="left">',
                '  <i class="fa fa-save"></i>',
                '</button>'
            ].join('\n'),
            link: function ($scope) {
                var isSaving = false;

                $scope.isDisabled = function () {
                    return isSaving || layerService.hasSaved();
                };

                $scope.save = function () {
                    if (!$scope.isDisabled()) {
                        isSaving = true;

                        var tactics = new Tactics();
                        tactics.fromShapes();

                        tactics.$save(function () {
                            isSaving = false;
                            layerService.setSaved(true);
                            notificationService.setNotification({
                                key: 'SUCCESS',
                                url: 'http://catenacc.io/' + tactics.id,
                                class: 'success'
                            });
                            $location.path('/' + tactics.id);
                        }, function () {
                            isSaving = false;
                            notificationService.setNotification({
                                key: 'ERROR',
                                class: 'error'
                            });
                        });
                    }
                };
            }
        };
    });
