module.exports = (grunt) ->
  grunt.loadNpmTasks "grunt-contrib-coffee"
  grunt.loadNpmTasks "grunt-contrib-uglify"
  grunt.loadNpmTasks "grunt-contrib-concat"
  grunt.loadNpmTasks "grunt-version"

  config  = require("./package.json")
  version = grunt.option("ver")

  paths =
    written:
      src: "README.md"
      lib: "lib/written.js"
      min: "lib/written.min.js"

    language:
      cwd:     "lang/"
      min:     ".min.js"
      lib:     ".js"
      extDot:  "last"
      dest:    "lib/lang"

  grunt.initConfig
    version:
      project:
        src: ["bower.json", "package.json"]

    coffee:
      compile:
        files: [{
          src:  paths.written.src
          dest: paths.written.lib
        }]

        options:
          bare: true

      lang:
        files: [{
          expand:  true
          cwd:     paths.language.cwd
          src:     ["*.coffee"]
          ext:     paths.language.lib
          extDot:  paths.language.extDot
          dest:    paths.language.dest
        }]

    uglify:
      compress:
        files: [{
          src:  paths.written.lib
          dest: paths.written.min
        }]

    concat:
      options:
        banner:
          """/* #{config.name} - v#{config.version} - #{config.license} */
             /* #{config.description} */
             /* #{config.repository.url} */\n"""

      lib:
        src: [paths.written.lib]
        dest: paths.written.lib

      min:
        src: [paths.written.min]
        dest: paths.written.min

      lang:
        files: [{
          expand:  true
          cwd:     paths.language.dest
          src:     ["*.js"]
          dest:    paths.language.dest
        }]

  grunt.registerTask "default", [
    "coffee"
    "uglify"
    "concat"
  ]

  grunt.registerTask "release", [
    "version::#{version}"
  ]
