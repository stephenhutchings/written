module.exports = (grunt) ->
  grunt.loadNpmTasks "grunt-contrib-coffee"
  grunt.loadNpmTasks "grunt-contrib-uglify"
  grunt.loadNpmTasks "grunt-contrib-concat"

  config = require("./package.json")

  grunt.initConfig
    coffee:
      compile:
        files:
          "lib/written.js": "README.coffee.md"

        options:
          bare: true

    uglify:
      compress:
        files:
          "lib/written.min.js": "lib/written.js"

    concat:
      options:
        banner:
          """/* #{config.name} - v#{config.version} - #{config.license} */
             /* #{config.description} */
             /* #{config.repository.url} */\n"""

      full:
        src: ["lib/written.js"]
        dest: "lib/written.js"

      min:
        src: ["lib/written.min.js"]
        dest: "lib/written.min.js"

  grunt.registerTask "default", [
    "coffee"
    "uglify"
    "concat"
  ]
