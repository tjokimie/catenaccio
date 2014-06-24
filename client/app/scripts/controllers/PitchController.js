angular.module('catenaccio')
    .controller('PitchController',
    function ($window, stageService, pitchBuilder, tacticsBuilder, layerService, tactics) {
        'use strict';

        var width = $($window).width() * 0.8;
        var height = $($window).height() * 0.8;

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
