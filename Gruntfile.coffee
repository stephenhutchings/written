module.exports = (grunt) ->
  grunt.loadNpmTasks "grunt-contrib-coffee"
  grunt.loadNpmTasks "grunt-contrib-uglify"
  grunt.loadNpmTasks "grunt-contrib-concat"
  grunt.loadNpmTasks "grunt-version"

  config  = require("./package.json")
  version = grunt.option("ver")

  paths =
    src: "README.md"
    lib: "lib/written.js"
    min: "lib/written.min.js"

  grunt.initConfig
    version:
      project:
        src: ["bower.json", "package.json"]

    coffee:
      compile:
        files: [{
          src:  paths.src
          dest: paths.lib
        }]

        options:
          bare: true

    uglify:
      compress:
        files: [{
          src:  paths.lib
          dest: paths.min
        }]

    concat:
      options:
        banner:
          """/* #{config.name} - v#{config.version} - #{config.license} */
             /* #{config.description} */
             /* #{config.repository.url} */\n"""

      lib:
        src: [paths.lib]
        dest: paths.lib

      min:
        src: [paths.min]
        dest: paths.min

  grunt.registerTask "default", [
    "coffee"
    "uglify"
    "concat"
  ]

  grunt.registerTask "release", [
    "version::#{version}"
  ]
