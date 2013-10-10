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
      unit: {
        configFile: 'karma.conf.js',
        background: true
      },
      continuous: {
        configFile: 'karma.conf.js',
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

  grunt.registerTask('server', [
    'concat',
    'less:dev',
    'jshint',
    'express',
    'watch',
  ]);

  grunt.registerTask('testserver', [
    'concat',
    'karma:unit',
    'karma:unit:run',
    'watch'
  ]);

  grunt.registerTask('build', [
    'clean:dist',
    'concat',
    'ngmin:dist',
    'uglify:dist',
    'less:dist'
  ]);

  grunt.registerTask('default', [
    'build',
    'test'
  ]);

};
