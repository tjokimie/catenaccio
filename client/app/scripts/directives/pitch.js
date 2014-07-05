angular.module('catenaccio.directives')
    .directive('pitch', function (dimensionService, stageService, pitchBuilder, tacticsBuilder, layerService) {
        'use strict';

        return {
            restrict: 'E',
            replace: true,
            scope: {
                tactics: '='
            },
            template: [
                '<div class="top-corners">',
                '  <div class="bottom-corners">',
                '    <div id="pitch"></div>',
                '  </div>',
                '</div>'
            ].join('\n'),
            link: function ($scope) {
                var width = dimensionService.width();
                var height = dimensionService.height();

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
            }
        };
    });
