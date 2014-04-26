'use strict';

module.exports = function (grunt) {

    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

    // Define the configuration for all the tasks
    grunt.initConfig({

        // Project settings
        yeoman: {
            // configurable paths
            app: require('./bower.json').appPath || 'client/app',
            build: 'build'
        },

        // Watches files for changes and runs tasks based on the changed files
        watch: {
            less: {
                files: ['<%= yeoman.app %>/styles/less/**/*.less'],
                tasks: ['less']
            },
            express: {
                files:  ['server/**/*.js'],
                tasks:  ['express:dev'],
                options: {
                    spawn: false // Without this option specified express won't be reloaded
                }
            }
        },

        // Make sure code styles are up to par and there are no obvious mistakes
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

        // Empties folders to start fresh
        clean: {
            build: {
                files: [
                    {
                        dot: true,
                        src: [
                            '<%= yeoman.build %>/*',
                            '!<%= yeoman.build %>/.git*'
                        ]
                    }
                ]
            },
            tmp: '.tmp'
        },

        // Add vendor prefixed styles
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

        bower: {
            install: {
                // just run 'grunt bower:install' and you'll see files from your Bower packages in lib directory
            }
        },

        'bower_postinst': {
            'angular-bootstrap': {
                options: {
                    components: {
                        'angular-bootstrap': [
                            'npm',
                            { grunt: 'html2js' },
                            { grunt: 'build:modal:tooltip' }
                        ]
                    }
                }
            }
        },

        // Automatically inject Bower components into the app
        'bowerInstall': {
            app: {
                src: '<%= yeoman.app %>/index.html',
                ignorePath: '<%= yeoman.app %>/',
                exclude: [
                    /bootstrap\.js/
                ]
            }
        },

        // Renames files for browser caching purposes
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

        // Reads HTML for usemin blocks to enable smart builds that automatically
        // concat, minify and revision files. Creates configurations in memory so
        // additional tasks can operate on them
        useminPrepare: {
            html: '<%= yeoman.app %>/index.html',
            options: {
                dest: '<%= yeoman.build %>'
            }
        },

        // Performs rewrites based on rev and the useminPrepare configuration
        usemin: {
            html: ['<%= yeoman.build %>/**/*.html'],
            css: ['<%= yeoman.build %>/styles/**/*.css'],
            options: {
                assetsDirs: ['<%= yeoman.build %>']
            }
        },

        // The following *-min tasks produce minified files in the build folder
        htmlmin: {
            build: {
                options: {
                    collapseWhitespace: true,
                    collapseBooleanAttributes: true,
                    removeCommentsFromCDATA: true,
                    removeOptionalTags: true
                },
                files: [
                    {
                        expand: true,
                        cwd: '<%= yeoman.build %>',
                        src: ['*.html', 'views/**/*.html'],
                        dest: '<%= yeoman.build %>'
                    }
                ]
            }
        },

        // Allow the use of non-minsafe AngularJS files. Automatically makes it
        // minsafe compatible so Uglify does not destroy the ng references
        ngmin: {
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

        // Replace CDN references
        htmlrefs: {
            build: {
                src: '<%= yeoman.build %>/index.html',
                dest: '<%= yeoman.build %>/index.html'
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
                        '<%= yeoman.app %>/styles/less/bootstrap/modals.less',
                        '<%= yeoman.app %>/styles/less/bootstrap/tooltip.less'
                    ]
                }
            }
        },

        // Copies remaining files to places other tasks can use
        copy: {
            build: {
                expand: true,
                dot: true,
                cwd: '<%= yeoman.app %>',
                dest: '<%= yeoman.build %>',
                src: [
                    '*.{ico,png,txt}',
                    '.htaccess',
                    '*.html',
                    'views/**/*.html',
                    'fonts/*'
                ]
            },
            styles: {
                expand: true,
                cwd: '<%= yeoman.app %>/styles',
                dest: '.tmp/styles/',
                src: '**/*.css'
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
            prod: {
                options: {
                    'node_env': 'production'
                }
            },
            test: {
                options: {
                    'node_env': 'test',
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
            }
        }
    });

    grunt.registerTask('styles', ['copy:styles', 'less', 'autoprefixer']);

    grunt.registerTask('server', ['less', 'express:dev', 'watch']);

    grunt.registerTask('e2e-test', ['express:test', 'protractor']);

    grunt.registerTask('test', [
        'less',
        'jshint',
        'karma',
        'mochaTest',
        'e2e-test'
    ]);

    grunt.registerTask('build', [
        'clean',
        'bower',
        'bower_postinst',
        'bowerInstall',
        'styles',
        'useminPrepare',
        'concat',
        'ngmin',
        'copy:build',
        'htmlrefs',
        'cssmin',
        'uglify',
        'rev',
        'usemin',
        'htmlmin'
    ]);

    grunt.registerTask('default', ['test', 'build']);
};
