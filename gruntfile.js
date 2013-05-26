module.exports = function (grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    files: [
        'gruntfile.js',
        'src/app.js',
        'src/gmm/*.js',
        'src/utils/*.js',
        'src/polyfills/*.js'
    ],
    'jsbeautifier': {
      files: ['<%= files %>'],
      options: {
        indent_size: 2,
        indent_char: ' ',
        indent_level: 0,
        indent_with_tabs: false,
        preserve_newlines: true,
        max_preserve_newlines: 2,
        jslint_happy: true,
        brace_style: 'collapse',
        keep_array_indentation: false,
        keep_function_indentation: false,
        space_before_conditional: false,
        eval_code: false,
        indent_case: false,
        wrap_line_length: 80,
        unescape_strings: false
      }
    },
    jshint: {
      files: ['<%= files %>'],
      options: {
        browser: true,
        node: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        noempty: true,
        nonew: true,
        undef: true,
        quotmark: 'single',
        trailing: true,
        globals: {
          require: true,
          requirejs: true,
          define: true
        }
      }
    },
    watch: {
      files: ['<%= files %>'],
      tasks: [
          'jsbeautifier',
          'jshint'
      ]
    }
  });

  grunt.loadNpmTasks('grunt-jsbeautifier');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', [
      'jsbeautifier',
      'jshint'
  ]);

  grunt.registerTask('devmode', [
      'watch'
  ]);

};
