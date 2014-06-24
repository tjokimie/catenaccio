angular.module('catenaccio.directives', ['catenaccio.services', 'ngRoute', 'pascalprecht.translate', 'ui.bootstrap']);
angular.module('catenaccio.services', ['ngResource', 'ngRoute', 'Scope.safeApply']);
angular.module('catenaccio', ['catenaccio.directives', 'catenaccio.services', 'ngRoute', 'pascalprecht.translate'])
    .config(function (pitchBuilderProvider, tacticsBuilderProvider, pencilServiceProvider, $translateProvider) {
        'use strict';

        pitchBuilderProvider.setGrassColor('#27ae60');

        tacticsBuilderProvider.setHomePlayerColor('#3498db');
        tacticsBuilderProvider.setHomeGoalkeeperStrokeColor('#3498db');
        tacticsBuilderProvider.setAwayPlayerColor('#e74c3c');
        tacticsBuilderProvider.setAwayGoalkeeperStrokeColor('#e74c3c');
        tacticsBuilderProvider.setFootballColor('#2c3e50');

        pencilServiceProvider.setPencilColor('#c0392b');

        $translateProvider.translations('en', {
            'CREATED_BY': '{{app}}. Created by {{creator}}.',
            'DRAW': 'Draw',
            'ERROR': 'Sorry! Something went wrong :(',
            'ISSUES': 'Issues',
            'LICENSED_UNDER': 'Licensed under the',
            'MIT_LICENSE': 'MIT License',
            'MOVE': 'Move',
            'NEW': 'New',
            'PROJECT': 'GitHub Project',
            'REDO': 'Redo',
            'SAVE': 'Save',
            'SAVE_IMAGE': 'Save image',
            'SUCCESS': 'Saved!',
            'UNDO': 'Undo'
        });

        $translateProvider.preferredLanguage('en');
    });
