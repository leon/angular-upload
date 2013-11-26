'use strict';

var path = require('path');

module.exports = function (grunt) {

  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  var conf = require('./Gruntfile.conf.js');

  grunt.initConfig({

    // Load Config
    config: conf,

    // Testing
    karma: {
      options: {
        configFile: 'karma.conf.js',
        files: [
          'bower_components/es5-shim/es5-shim.js',
          'bower_components/angular/angular.js',
          'bower_components/angular-mocks/angular-mocks.js',
          conf.src,
          conf.unit
        ]
      },
      unit: {
        options: {
          browsers: [
            'Chrome'
          ]
        },
        background: true
      },
      continuous: {
        options: {
          browsers: [
            'PhantomJS'
          ]
        },
        singleRun: true
      }
    },

    // Validation
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: [
        'Gruntfile.js',
        '<%= config.src %>',
        '<%= config.unit %>',
        '<%= config.e2e %>'
      ]
    },

    // Developing
    watch: {
      gruntfile: {
        files: ['Gruntfile.js'],
        tasks: ['build']
      },
      js: {
        files: ['<%= config.src %>', '<%= config.unit %>'],
        tasks: ['concat', 'karma:unit:run', 'jshint']
      },
      less: {
        files: ['<%= config.less %>'],
        tasks: ['less:dev']
      },
      livereload: {
        options: {
          livereload: true
        },
        files: ['<%= config.dist %>', 'src/**/*.css']
      }
    },

    express: {
      server: {
        options: {
          hostname: '*',
          debug: true,
          livereload: true,
          port: 9001,
          server: path.resolve('./example/server')
        }
      }
    },

    // Building
    clean: {
      dist: {
        files: '<%= config.dist %>'
      }
    },

    concat: {
      dev: {
        files: {
          '<%= config.dist %>': '<%= config.src %>'
        }
      }
    },

    ngmin: {
      dist: {
        files: {
          '<%= config.dist %>': '<%= config.dist %>'
        }
      }
    },

    uglify: {
      dist: {
        files: {
          '<%= config.minified %>': '<%= config.dist %>'
        },
        options: {
          compress: true
        }
      }
    },

    less: {
      dev: {
        files: [{
          expand: true,
          ext: '.min.css',
          src: ['<%= config.less %>']
        }]
      },
      dist: {
        options: {
          yuicompress: true
        },
        files: [{
          expand: true,
          ext: '.min.css',
          src: ['<%= config.less %>']
        }]
      }
    }
  });

  grunt.registerTask('test', [
    'jshint',
    'karma:continuous'
  ]);

  grunt.registerTask('webserver', [
    'concat',
    'less:dev',
    'jshint',
    'express',
    'watch',
  ]);

  grunt.registerTask('autotest', [
    'concat',
    'karma:unit',
    'karma:unit:run',
    'watch'
  ]);

  grunt.registerTask('package', [
    'clean:dist',
    'concat',
    'ngmin:dist',
    'uglify:dist',
    'less:dist'
  ]);

  grunt.registerTask('default', [
    'package',
    'test'
  ]);

  grunt.registerTask('travis', [
    'jshint',
    'test'
  ]);

};
