angular.module('catenaccio')
    .controller('PitchController',
    function (dimensionService, stageService, pitchBuilder, tacticsBuilder, layerService, tactics) {
        'use strict';

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
            .setTactics(tactics)
            .addFootball()
            .addHomeGoalkeeper()
            .addHomePlayers()
            .addAwayGoalkeeper()
            .addAwayPlayers()
            .addPencils()
            .build();
        layerService.setLayer(tacticsLayer);
    });
