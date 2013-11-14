/*jshint node:true*/

'use strict';

var LIVERELOAD_PORT = 35729;

module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);
  require('time-grunt')(grunt);

  grunt.initConfig({

    watch: {
      scripts: {
        files: ['client/scripts/{,*/}*.js'],
        tasks: ['scripts:build']
      }
    },

    useminPrepare: {
      html: 'client/index.html',
      options: {
        dest: 'dist'
      }
    },
    usemin: {
      html: ['dist/index.html'],
      css: ['dist/styles/{,*/}*.css'],
      options: {
        dirs: ['dirs']
      }
    },

    htmlmin: {
      dist: {
        options: {},
        files: {
          'dist/index.html':'client/index.html'
        }
      }
    },

    less: {
      dist: {
        options: {
          paths: ['client/styles']
        },
        files: [
          'dist/styles/'
        ]
      }
    },

    concat: {
      options: {
        stripBanners: true
      }
    },

    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            'client/.tmp',
            'dist/*'
          ]
        }]
      },
      server: '.tmp'
    },

    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: [
        'Gruntfile.js',
        'client/scripts/{,*/}*.js'
      ]
    },

    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: 'client',
          dest: 'dist',
          src: [
            '*.{ico, png, txt}',
            'bower_components/**/*',
            'images/{,*/}*.{gif, png}',
            'fonts/*'
          ]
        }]
      }
    },

    /** Add Script Tags on Bower Install */
    'bower-install': {
      target: {
        html: 'client/index.html',
        ignorePath: 'client/',
      }
    }
  });

  grunt.registerTask('build', [
    'clean:dist',
    'useminPrepare',
    'concat',
    'copy',
    'htmlmin',
    'uglify',
    'usemin'
  ]);
};
