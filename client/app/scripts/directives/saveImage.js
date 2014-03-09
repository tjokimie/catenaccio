angular.module('catenaccio.directives')
    .controller('ImageModalController', function ($scope, $modalInstance, dataURL) {
        'use strict';

        $scope.dataURL = dataURL;

        $scope.close = function () {
            $modalInstance.dismiss('cancel');
        };
    })
    .directive('saveImage', function ($modal, stageService) {
        'use strict';

        return {
            restrict: 'E',
            replace: true,
            scope: true,
            template: [
                '<button ng-click="open()" ng-class="{ disabled: disabled }"',
                '        tooltip="{{ \'SAVE_IMAGE\' | translate }}" tooltip-placement="left">',
                '  <i class="fa fa-picture-o"></i>',
                '</button>'
            ].join('\n'),
            link: function ($scope) {
                $scope.disabled = false;

                $scope.open = function () {
                    if (!$scope.disabled) {
                        $scope.disabled = true;

                        var modal = $modal.open({
                            templateUrl: 'views/save_image_modal.html',
                            controller: 'ImageModalController',
                            resolve: {
                                dataURL: stageService.toDataURL
                            }
                        });

                        modal.result.then(enable, enable);
                    }
                };

                function enable() {
                    $scope.disabled = false;
                }
            }
        };
    });
