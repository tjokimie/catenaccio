angular.module('catenaccio.directives')
    .directive('notification', function (notificationService) {
        'use strict';

        return {
            restrict: 'E',
            replace: true,
            scope: true,
            template: [
                '<div class="notification" ng-class="notification.class">',
                '  <div ng-if="notification">',
                '    <h2 translate="{{notification.key}}" translate-values="{ url: notification.url }"></h2>',
                '    <i class="fa fa-times" ng-click="close()"></i>',
                '  </div>',
                '<div>'
            ].join('\n'),
            link: function ($scope) {
                $scope.close = notificationService.removeNotification;

                $scope.$watch(notificationService.getNotification, function (notification) {
                    $scope.notification = notification;
                });
            }
        };
    });
