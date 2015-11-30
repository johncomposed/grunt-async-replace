/*
 * grunt-async-replace
 * https://github.com/johncomposed/grunt-async-replace
 *
 * Copyright (c) 2015 johncomposed
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  var async        = require('async'),
      asyncReplace = require('async-replace');


  grunt.registerMultiTask('async-replace', 'It\'s complicated', function(){

    var compilers = this.data.compilers;
    var files = this.files;
    var done = this.async();
    
    
    
    
    async.each(files, function(file, callback) {
      var data = grunt.file.read(file.src);
      
      async.reduce(compilers, data, function(data, compiler, reduce_callback) {
        var pattern = compiler.pattern != null ? compiler.pattern : /([\s\S]*)/img;
        var options = compiler.options != null ? compiler.options : {};
        
        asyncReplace(data, pattern, function(matches, offset, string, ar_callback) {
          
          compiler.func(matches, options, function(err, compiled) {
            ar_callback(err, compiled);
          });
          
        }, function(err, replacement) {
          if (err != null) {
            grunt.log.error("Error in file: " + file.src + "\n" + err);
            grunt.fail.warn(compiler.func + " failed on " + file.src);
          }
          
          reduce_callback(null, replacement);
        });
        
      }, function(err, result) {
        
        grunt.log.ok("Succesfully compiled " + file.src);
        grunt.file.write(file.dest, result);
        
      });
    }, function(err) {
      
      grunt.log.ok('Succesfully built all components');
      done();
      
    });
  });
  
  

                       
                        
                        
                        
                        
                        
                        
                        
                        
  

};


//    grunt.config('components', {
//        build:        # target   
//            files:[{  # data
//                expand: true
//                cwd: "src/"
//                src: "components/**/*.coffee"
//                dest: "target/"
//                ext: '.js'
//            }]
//            compilers:[{
//                    func: (data, config, callback) -> compileLess(data, config, callback)
//                    pattern: /less *?\: *?\"\"\" *?\n([\s\S]*?)\"\"\"/img
//                    options:
//                        compress: false
//                        cleancss: false
//                    }, {
//                    func: (data, config, callback) -> compileCoffee(data, config, callback)
//                    options:
//                        sourceMap: false
//                    }]
//        release:      # target
//            files:  "<%= components.build.files %>"
//            less:   "<%= components.build.less %>"
//            coffee: 
//                sourceMap: false
//    })
