angular.module('catenaccio.directives', ['catenaccio.services', 'ui.bootstrap', 'pascalprecht.translate']);
angular.module('catenaccio.services', ['ngResource', 'Scope.safeApply']);
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
            'ERROR': 'Oops! We are really sorry but something went wrong during save.',
            'ISSUES': 'Issues',
            'LICENSED_UNDER': 'Licensed under the',
            'MIT_LICENSE': 'MIT License',
            'MOVE': 'Move',
            'NEW': 'New',
            'PROJECT': 'GitHub Project',
            'REDO': 'Redo',
            'SAVE': 'Save',
            'SAVE_IMAGE': 'Save image',
            'SUCCESS': 'Tactics saved! Share them with your friends: {{url}}',
            'UNDO': 'Undo'
        });

        $translateProvider.preferredLanguage('en');
    });