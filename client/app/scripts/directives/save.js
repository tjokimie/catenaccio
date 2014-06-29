angular.module('catenaccio.directives')
    .directive('save', function ($location, Tactics, layerService, notificationService) {
        'use strict';

        return {
            restrict: 'E',
            replace: true,
            scope: true,
            template: [
                '<div ng-class="{ success: notification.type === \'success\',',
                '                 error: notification.type === \'error\',',
                '                 show: notification.show === true }"',
                '     notification-tooltip="{{ notification.notification | translate }}">',
                '  <button ng-click="save()" ng-class="{ disabled: isDisabled() }"',
                '          tooltip="{{ \'SAVE\' | translate }}">',
                '    <i class="fa fa-save"></i>',
                '  </button>',
                '</div>'
            ].join('\n'),
            link: function ($scope) {
                var isSaving = false;

                $scope.notification = notificationService.getNotification();

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
                            notificationService.success('SUCCESS');
                            layerService.setSaved(true);
                            $location.path('/' + tactics.id, false);
                        }, function () {
                            isSaving = false;
                            notificationService.error('ERROR');
                        });
                    }
                };
            }
        };
    });
