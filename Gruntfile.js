'use strict';

module.exports = function (grunt) {

    var htmlminOptions = {
        collapseWhitespace: true,
        collapseBooleanAttributes: true,
        removeOptionalTags: true
    };

    require('load-grunt-tasks')(grunt);

    require('time-grunt')(grunt);

    grunt.initConfig({

        yeoman: {
            app: require('./bower.json').appPath || 'client/app',
            build: 'build'
        },

        watch: {
            less: {
                files: ['<%= yeoman.app %>/styles/less/**/*.less'],
                tasks: ['less']
            },
            express: {
                files: ['server/**/*.js'],
                tasks: ['express:dev'],
                options: {
                    spawn: false // Without this option specified express won't be reloaded
                }
            }
        },

        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            },
            gruntfile: ['Gruntfile.js'],
            client: {
                options: {
                    jshintrc: 'client/.jshintrc'
                },
                src: ['<%= yeoman.app %>/scripts/**/*.js', 'client/test/**/*.js']
            },
            server: {
                options: {
                    jshintrc: 'server/.jshintrc'
                },
                src: ['server/**/*.js']
            }
        },

        clean: {
            build: '<%= yeoman.build %>/*',
            tmp: '.tmp'
        },

        bower: {
            install: {
                options: {
                    copy: false
                }
            }
        },

        'bower_postinst': {
            'angular-bootstrap': {
                options: {
                    components: {
                        'angular-bootstrap': [
                            'npm',
                            { grunt: 'html2js' },
                            { grunt: 'build:modal' }
                        ]
                    }
                }
            }
        },

        wiredep: {
            app: {
                src: '<%= yeoman.app %>/index.html',
                ignorePath: '<%= yeoman.app %>/',
                exclude: [
                    /bootstrap\.js/
                ]
            }
        },

        less: {
            styles: {
                files: {
                    '<%= yeoman.app %>/styles/main.css': '<%= yeoman.app %>/styles/less/main.less'
                }
            },
            bootstrap: {
                files: {
                    '<%= yeoman.app %>/bower_components/bootstrap/dist/css/bootstrap.css': [
                        '<%= yeoman.app %>/styles/less/bootstrap/modals.less'
                    ]
                }
            }
        },

        autoprefixer: {
            options: {
                browsers: ['last 1 version']
            },
            build: {
                files: [
                    {
                        expand: true,
                        cwd: '.tmp/styles/',
                        src: '**/*.css',
                        dest: '.tmp/styles/'
                    }
                ]
            }
        },

        copy: {
            build: {
                expand: true,
                dot: true,
                cwd: '<%= yeoman.app %>',
                dest: '<%= yeoman.build %>',
                src: ['*.{ico,png,txt}', '*.html']
            },
            fontAwesome: {
                expand: true,
                cwd: '<%= yeoman.app %>/bower_components/font-awesome/fonts',
                dest: '<%= yeoman.build %>/fonts',
                src: '*'
            }
        },

        useminPrepare: {
            html: '<%= yeoman.app %>/index.html',
            options: {
                dest: '<%= yeoman.build %>'
            }
        },

        usemin: {
            html: ['<%= yeoman.build %>/**/*.html'],
            css: ['<%= yeoman.build %>/styles/**/*.css'],
            options: {
                assetsDirs: ['<%= yeoman.build %>']
            }
        },

        ngtemplates: {
            app: {
                cwd: '<%= yeoman.app %>',
                src: 'views/**/*.html',
                dest: '.tmp/templates.js',
                options:  {
                    usemin: 'scripts/scripts.js',
                    module: 'catenaccio',
                    htmlmin:  htmlminOptions
                }
            }
        },

        htmlrefs: {
            build: {
                src: '<%= yeoman.build %>/index.html',
                dest: '<%= yeoman.build %>/index.html'
            }
        },

        htmlmin: {
            build: {
                options: htmlminOptions,
                files: [
                    {
                        expand: true,
                        cwd: '<%= yeoman.build %>',
                        src: ['*.html'],
                        dest: '<%= yeoman.build %>'
                    }
                ]
            }
        },

        ngAnnotate: {
            build: {
                files: [
                    {
                        expand: true,
                        cwd: '.tmp/concat/scripts',
                        src: '*.js',
                        dest: '.tmp/concat/scripts'
                    }
                ]
            }
        },

        rev: {
            build: {
                files: {
                    src: [
                        '<%= yeoman.build %>/scripts/**/*.js',
                        '<%= yeoman.build %>/styles/**/*.css',
                        '<%= yeoman.build %>/styles/fonts/*'
                    ]
                }
            }
        },

        express: {
            options: {
                script: 'server/server.js'
            },
            dev: {
                options: {
                    'node_env': 'development',
                    port: 3000
                }
            },
            test: {
                options: {
                    'node_env': 'test',
                    port: 8000
                }
            },
            travis: {
                options: {
                    'node_env': 'travis',
                    port: 8000
                }
            }
        },

        karma: {
            unit: {
                configFile: 'karma.conf.js',
                singleRun: true
            }
        },

        mochaTest: {
            options: {
                reporter: 'spec'
            },
            src: ['server/test/**/*.js']
        },

        protractor: {
            options: {
                keepAlive: false
            },
            test: {
                options: {
                    configFile: 'protractor.conf.js'
                }
            },
            travis: {
                options: {
                    configFile: 'protractor-sauce.conf.js'
                }
            }
        }
    });

    grunt.registerTask('styles', ['less', 'autoprefixer']);

    grunt.registerTask('start', ['styles', 'express:dev', 'watch']);

    grunt.registerTask('e2e-test', ['express:test', 'protractor:test']);

    grunt.registerTask('test', [
        'jshint',
        'karma',
        'mochaTest',
        'e2e-test'
    ]);

    grunt.registerTask('test:travis', [
        'jshint',
        'karma',
        'mochaTest',
        'express:travis',
        'protractor:travis'
    ]);

    grunt.registerTask('build', [
        'clean',
        'bower',
        'bower_postinst',
        'wiredep',
        'styles',
        'copy:build',
        'copy:fontAwesome',
        'useminPrepare',
        'ngtemplates',
        'concat',
        'cssmin',
        'htmlrefs',
        'ngAnnotate',
        'uglify',
        'rev',
        'usemin',
        'htmlmin'
    ]);

    grunt.registerTask('default', ['test', 'build']);
};
