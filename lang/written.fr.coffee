# French language support for Written

code = "FR"
dico =
  cardinals:
    written: [{m: "un", f: "une"}, "deux", "trois", "quatre", "cinq",
               "six", "sept", "huit", "neuf", "dix", "onze", "douze"]

  ordinals:
    written: [{m: "premier", f: "première"}, "deuxième", "troisième",
              "quatrième", "cinquième", "sixième", "septième",
              "huitième", "neuvième", "dixième"]

    rule:    /(\d)\b/

    suffixes:
      "1": {m: "er", f: "re"}
      "n": "e"

if typeof define is "function" and define.amd
  define [], dico
else if typeof exports is "object"
  module.exports = dico
else if typeof written is "object"
  written.setLanguage(dico, code)
