module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
    options: {
      separator: ' '
    },
    dist: {
      src: ['app.js','directive/ngPopupDirective.js','model/ngPopupBuilder.js'],
      dest: 'dist/ngPopup.js'
    }
	},

    concat: {
      options: {
        separator: ' '
      },
      dist: {
        src: ['css/ngPopupStyle.css'],
        dest: 'dist/ngPopupStyle.css'
      }
    },
	
	
  uglify: {
    options: {
      mangle: false
    },
    my_target: {
      files: {
        'dist/ngPopup.min.js': ['dist/ngPopup.js']
      }
    }
  
}
});
  
  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Default task(s).
  grunt.registerTask('default', ['concat','uglify']);

};