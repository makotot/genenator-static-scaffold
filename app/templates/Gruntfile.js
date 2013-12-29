module.exports = function (grunt) {
	'use strict';

	require('time-grunt')(grunt);
	
	grunt.initConfig({

		pkg: grunt.file.readJSON('package.json'),

		path: {
			src: 'source',
			dev: './',
			build: 'build',
			doc: 'doc',
			layouts: '<%%= path.src %>/layouts',
			pages: '<%%= path.src %>/pages',
			data: '<%%= path.src %>/data',
			bower: 'bower_components'
		},

		bower: {
			install: {
				options: {
					copy: false
				}
			}
		},

		copy: {
			bower: {
				files: [
					{
						expand: true,
						flatten: true,
						src: ['<%%= path.bower %>/**/*.js'],
						dest: '<%%= path.dev %>/js/lib'
					},
					{
						expand: true,
						flatten: true,
						src: ['<%%= path.bower %>/**/*.css'],
						dest: '<%%= path.dev %>/css/lib'
					}
				]
			},
			sass: {
				expand: true,
				flatten: true,
				cwd: '<%%= path.src %>/sass',
				src: ['*.css'],
				dest: '<%%= path.dev %>/css'
			},
			js: {
				expand: true,
				flatten: true,
				cwd: '<%%= path.src %>/js',
				src: ['*.js'],
				dest: '<%%= path.dev %>/js'
			},
			img: {
				expand: true,
				cwd: '<%%= path.src %>/images',
				src: ['**/*.{png,jpg,jpeg,gif}'],
				dest: '<%%= path.dev %>/images'
			},
			build: {
				options: {
					expand: true,
					flatten: true
				},
				files: [
					{
						src: [
							'<%%= path.dev %>/**'
						],
						dest: '<%%= path.build %>/'
					},
					{
						src: [
							'<%%= path.src %>/**',
							'!<%%= path.src %>/**/*.hbs',
							'!<%%= path.src %>/data/**',
							'!<%%= path.layouts %>/**',
							'!<%%= path.pages %>/**',
						],
						dest: '<%%= path.build %>/'
					},
					{
						src: ['<%%= path.doc %>/js/**'],
						dest: '<%%= path.build %>/'
					}
				]
			}
		},

		assemble: {
			options: {
				flatten: true,
				data: '<%%= path.data %>/*',
				layoutdir: '<%%= path.layouts %>',
				layout: 'default.hbs',
				partials: ['<%%= path.layouts %>/partials/**/*.hbs'],
				basepath: '<%%= path.basepath %>'
			},
			dev: {
				options: {
					layout: 'default.hbs'
				},

				// ディレクトリ毎に分けて定義
				files: [
					{
						expand: true,
						cwd: '<%%= path.src %>/',
						src: 'index.hbs',
						dest: '<%%= path.dev %>'
					},
					{
						expand: true,
						cwd: '<%%= path.pages %>/',
						src: '*.hbs',
						dest: '<%%= path.dev %>'
					}
				]
			}
		},

		htmlhint: {
			options: {
				htmlhintrc: '.htmlhintrc',
				force: true
			},
			dev: {
				src: ['<%%= path.src %>/!(index|headers).html']
			}
		},

		sass: {
			dist: {
				files: [
					{
						expand: true,
						cwd: '<%%= path.src %>/css/sass',
						src: '*.sass',
						dest: '<%%= path.src %>/css',
						ext: '.css'
					}
				]
			}
		},

		csslint: {
			options: {
				csslintrc: '.csslintrc',
				force: true
			},
			dev: {
				src: ['<%%= path.src %>/**/*.css']
			}
		},

		jshint: {
			options: {
				jshintrc: '.jshintrc',
				force: true,
				reporter: require('jshint-stylish')
			},
			dev: {
				src: ['<%%= path.src %>/js/modules/*.js']
			}
		},

		uglify: {
			options: {
				preserveComments: 'some',
				report: 'min'
			},
			min: {
				files: [
					{
						expand: true,
						cwd: '<%%= path.src %>/',
						src: 'js/!(html5shiv|respond.min).js',
						dest: '<%%= path.dist %>/'
					}
				]
			}
		},

		connect: {
			options: {
				port: 9000,
				livereload: 35729,
				open: false
			},
			livereload: {
				options: {
					base: ['<%%= path.dev %>']
				}
			}
		},

		watch: {
			options: {
				spawn: false,
				livereload: '<%%= connect.options.livereload %>'
			},
			html: {
				files: ['<%%= path.src %>/**/*.{hbs,md}', '<%%= path.layouts %>/**', '<%%= path.data %>/**'],
				tasks: ['assemble']
			},
			css: {
				files: ['<%%= path.src %>/**/*.sass'],
				tasks: ['sass', 'copy:sass']
			},
			js: {
				files: ['<%%= path.src %>/**/*.js'],
				tasks: ['jshint', 'newer:copy:js']
			},
			img: {
				files: ['<%%= path.src %>/**/*.{png,jpg,jpeg,gif}'],
				tasks: ['newer:copy:img']
			}
		},

		yuidoc: {
			compile: {
				name: '<%%= pkg.name %>',
				description: '<%%= pkg.description %>',
				version: '<%%= pkg.version %>',
				url: '<%%= pkg.homepage %>',
				options: {
					paths: '<%%= path.src %>/js/',
					outdir: '<%%= path.doc %>/js',
					exclude: 'lib'
				}
			}
		}

	});



	require('jit-grunt')(grunt, {
		bower: 'grunt-bower-task'
	});

	grunt.registerTask('default', ['assemble', 'sass', 'lint']);

	grunt.registerTask('install', ['newer:bower:install', 'newer:copy:bower']);

	grunt.registerTask('compile', ['assemble', 'sass']);

	grunt.registerTask('doc', ['yuidoc']);

	grunt.registerTask('lint', ['htmlhint', 'csslint', 'jshint']);

	grunt.registerTask('serve', ['assemble', 'htmlhint', 'csslint', 'jshint', 'newer:copy:sass', 'newer:copy:js', 'newer:copy:img', 'connect', 'watch']);

};
