angular.module('catenaccio.directives')
    .directive('pitch', function ($window, stageService, pitchBuilder, tacticsBuilder, layerService) {
        'use strict';

        return {
            restrict: 'E',
            replace: true,
            scope: {
                tactics: '='
            },
            template: [
                '<div>',
                '  <div class="top-corners">',
                '    <div class="bottom-corners">',
                '      <div id="pitch"></div>',
                '    </div>',
                '  </div>',
                '</div>'
            ].join('\n'),
            link: function ($scope, $element) {
                var width = getWidth();
                var height = getHeight();

                stageService.newStage(width, height, 'pitch');

                var pitchLayer = pitchBuilder
                    .newLayer()
                    .addBackground()
                    .addGrass()
                    .addGoals()
                    .addGoalAreas()
                    .addPenaltyAreas()
                    .addCorners()
                    .addHalfwayLine()
                    .addCenterCircle()
                    .addTouchlineAndGoalLine()
                    .build();
                stageService.addLayer(pitchLayer);

                var tacticsLayer = tacticsBuilder
                    .newLayer()
                    .setTactics($scope.tactics)
                    .addFootball()
                    .addHomeGoalkeeper()
                    .addHomePlayers()
                    .addAwayGoalkeeper()
                    .addAwayPlayers()
                    .addPencils()
                    .build();
                layerService.setLayer(tacticsLayer);

                function getWidth() {
                    var margin = (parseAttr('margin-left') + parseAttr('margin-right'));
                    var padding = (parseAttr('padding-left') + parseAttr('padding-right'));
                    return $(window).width() - margin - padding;
                }

                function getHeight() {
                    var margin = (parseAttr('margin-top') + parseAttr('margin-bottom'));
                    var padding = (parseAttr('padding-top') + parseAttr('padding-bottom'));
                    return $(window).height() - margin - padding;
                }

                function parseAttr(attr) {
                    return parseInt($element.css(attr), 10);
                }
            }
        };
    });
