module.exports = function(grunt) {

  var license = '// defineObject-js v0.1.0 \n// (c) 2013 Sergey Melnikov \n\n// defineObject-js may be freely distributed under the MIT license\n\n\n';

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: license
      },
      dist: {
        files: {
          '<%= pkg.name %>.min.js': ['<%= pkg.name %>.js']
        }
      }
    },
    jshint: {
      files: ['<%= pkg.name %>.js'],
      options: {
          boss: true,
          eqnull: true,
          expr: true,
          bitwise: true,
          camelcase: true,
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
       src: ['<%= pkg.name %>.js'],
        options: {
          specs: ['test/<%= pkg.name %>.js']
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
