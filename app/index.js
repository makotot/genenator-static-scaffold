'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');


var StaticScaffoldGenerator = module.exports = function StaticScaffoldGenerator(args, options, config) {
	yeoman.generators.Base.apply(this, arguments);

	this.on('end', function () {
		this.installDependencies({ skipInstall: options['skip-install'] });
	});

	this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(StaticScaffoldGenerator, yeoman.generators.Base);

StaticScaffoldGenerator.prototype.askFor = function askFor() {
	var cb = this.async();

	// have Yeoman greet the user.
	console.log(this.yeoman);

	var prompts = [{
		name: 'name',
		message: 'What do you want to call this project?'
	}];

	this.prompt(prompts, function (props) {
		this.name = props.name;

		cb();
	}.bind(this));
};

StaticScaffoldGenerator.prototype.app = function app() {
	this.mkdir('app');
	this.mkdir('app/templates');

	this.copy('_package.json', 'package.json');
	this.copy('_bower.json', 'bower.json');

	this.copy('_package.json', 'package.json');
	this.copy('_bower.json', 'bower.json');

	this.mkdir('source');
	this.mkdir('source/layouts');
	this.mkdir('source/layouts/partials');
	this.mkdir('source/pages');
	this.mkdir('source/data');

	this.mkdir('source/css');
	this.mkdir('source/sass');
	this.mkdir('source/js');
	this.mkdir('source/images');
};

StaticScaffoldGenerator.prototype.projectfiles = function projectfiles() {
	this.copy('jshintrc', '.jshintrc');
	this.copy('csslintrc', '.csslintrc');
	this.copy('htmlhintrc', '.htmlhintrc');
	this.copy('gitignore', '.gitignore');
	this.copy('_README.md', 'README.md');
	this.template('Gruntfile.js');
};

StaticScaffoldGenerator.prototype.assemblefiles = function assemblefiles() {
	this.copy('assemble/_default.hbs', 'source/layouts/default.hbs');
	this.copy('assemble/_index.hbs', 'source/index.hbs');
	this.copy('assemble/_base.hbs', 'source/layouts/base.hbs');
	this.copy('assemble/_default.hbs', 'source/layouts/default.hbs');
	this.copy('assemble/_head.hbs', 'source/layouts/partials/head.hbs');
	this.copy('assemble/_scripts.hbs', 'source/layouts/partials/scripts.hbs');
	this.copy('assemble/_header.hbs', 'source/layouts/partials/header.hbs');
	this.copy('assemble/_footer.hbs', 'source/layouts/partials/footer.hbs');
};

