module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
    options: {
      separator: ' '
    },
    basic:{
      src: ['css/ngPopupStyle.css'],
      dest: 'dist/ngPopupStyle.css'
    },
    extras: {
      src: ['app.js','directive/ngPopupDirective.js','model/ngPopupBuilder.js'],
      dest: 'dist/ngPopup.js'
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