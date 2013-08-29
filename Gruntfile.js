/* global module:false */
module.exports = function (grunt) {

	// Project configuration
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		meta: {
			banner:
				'/*!\n' +
				' * PAPI <%= pkg.version %> (<%= grunt.template.today("yyyy-mm-dd, HH:MM") %>)\n' +
				' * https://github.com/boye/PAPI\n' +
				' * MIT licensed\n' +
				' *\n' +
				' * Copyright (C) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>, <%= pkg.author.web %>\n' +
				' */'
		},

		jshint: {
			files: [ 'Gruntfile.js', 'jquery.papi.js' ]
		},

		uglify: {
			options: {
				banner: '<%= meta.banner %>\n'
			},
			build: {
				files: {
					'jquery.papi.min.js': ['jquery.papi.js']
				}
			}
		},

		qunit: {
			all: {
				options: {
					timeout: 7000,
					urls: [
						'tests/index.html'
					]
				}
			}
		}

	});

	// Dependencies
	grunt.loadNpmTasks( 'grunt-contrib-jshint' );
	grunt.loadNpmTasks( 'grunt-contrib-uglify' );
	grunt.loadNpmTasks( 'grunt-contrib-qunit' );

	// Default task
	grunt.registerTask( 'default', [ 'jshint', 'uglify', 'qunit'] );

};