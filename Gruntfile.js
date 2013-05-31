module.exports = function(grunt) {

  var license = '// defineObject-js v1.0 \n// (c) 2013 Sergey Melnikov \n\n// defineObject-js may be freely distributed under the MIT license\n\n\n';

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: license
      },
      dist: {
        files: {
          'defineObject.min.js': ['defineObject.js']
        }
      }
    },
    jshint: {
      files: ['defineObject.js'],
      options: {
          boss: true,
          eqnull: true,
          expr: true,
          bitwise: true,
          eqeqeq: true,
          forin: true,
          immed: true,
          noarg: true,
          newcap: false,
	        node: true
      }
    },
    jasmine: {
      kettle : {
       src: ['defineObject.js'],
        options: {
          specs: ['test/defineObject.js']
        }
      }
    },
    watch: {
      src : {
        files: ['<%= jshint.files %>','Gruntfile.js'],
        tasks: ['uglify','jshint', 'jasmine']
      },
      test: {
        files: ['<%= jasmine.kettle.options.specs %>'],
        tasks: ['jasmine']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['uglify','jshint','jasmine']);

};
