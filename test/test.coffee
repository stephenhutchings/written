assert         = require("assert")
{describe, it} = require("mocha")

w = require("../lib/written")

describe "written", ->
  describe "capitalize()", ->
    it "should capitalize the first letter of a string", ->
      assert.equal("Hello world!",  w.capitalize("hello world!"))

  describe "capitalizeAll()", ->
    it "should capitalize the first letter of non-reserved words in a string", ->
      assert.equal("Hello World!",  w.capitalizeAll("hello world!"))
      assert.equal("This and That", w.capitalizeAll("this and that"))

  describe "collapse()", ->
    it "should replace all white-space in a string with a single space character", ->
      assert.equal("this and that", w.collapse("this     \t\t and \n    that"))

  describe "camelCase()", ->
    it "should format a \"cased\" string into camel-case", ->
      assert.equal("someThing",     w.camelCase("some-thing"))
      assert.equal("someThing",     w.camelCase("some_thing"))
      assert.equal("someThing",     w.camelCase("someThing"))
      assert.equal("someThing",     w.camelCase("some Thing"))
      assert.equal("someThing",     w.camelCase("some    Thing"))

  describe "hyphenCase()", ->
    it "should format a \"cased\" string into hyphen-case", ->
      assert.equal("some-thing",    w.hyphenCase("some-thing"))
      assert.equal("some-thing",    w.hyphenCase("some_thing"))
      assert.equal("some-thing",    w.hyphenCase("someThing"))
      assert.equal("some-thing",    w.hyphenCase("some Thing"))
      assert.equal("some-thing",    w.hyphenCase("some    Thing"))
      assert.equal("-some-thing",   w.hyphenCase("someThing", true))

  describe "snakeCase()", ->
    it "should format a \"cased\" string into snake-case", ->
      assert.equal("some_thing",    w.snakeCase("some-thing"))
      assert.equal("some_thing",    w.snakeCase("some_thing"))
      assert.equal("some_thing",    w.snakeCase("someThing"))
      assert.equal("some_thing",    w.snakeCase("some Thing"))
      assert.equal("some_thing",    w.snakeCase("some    Thing"))

  describe "humanCase()", ->
    it "should format a \"cased\" string into human-case", ->
      assert.equal("some thing",    w.humanCase("some-thing"))
      assert.equal("some thing",    w.humanCase("some_thing"))
      assert.equal("some Thing",    w.humanCase("someThing"))
      assert.equal("some Thing",    w.humanCase("some Thing"))
      assert.equal("some Thing",    w.humanCase("some    Thing"))
      assert.equal("from A to Z",   w.humanCase("fromA_to-Z"))

  describe "wrapInTag()", ->
    it "should wrap a string inside an HTML tag", ->
      assert.equal("<span>Hello world!</span>",     w.wrapInTag("Hello world!"))
      assert.equal("<strong>Hello world!</strong>", w.wrapInTag("Hello world!", "strong"))
      assert.equal("<a href=\"/url\" class=\"b\" disabled=\"disabled\">Link</a>",
        w.wrapInTag "Link", "a",
          href: "/url"
          class: ["b"]
          disabled: true
      )


  describe "prettyList()", ->
    it "should format an array into a grammatically correct string", ->
      assert.equal("Ben and Bob",               w.prettyList(["Ben", "Bob"]))
      assert.equal("Ben, Bob and Bill",         w.prettyList(["Ben", "Bob", "Bill"]))
      assert.equal("Ben, Bob and 2 more",       w.prettyList(["Ben", "Bob", "Bill", "Max"], 2))
      assert.equal("Ben and 1 other",           w.prettyList(["Ben", "Bob"], 1, {more: "other"}))
      assert.equal("Ben and one more",          w.prettyList(["Ben", "Bob"], 1, {written: true}))
      assert.equal("Doc1 and two other files",  w.prettyList(["Doc1", "Doc2", "Doc3"], 1, {written: true, more: "other file", quantify: true}))
      assert.equal("Doc1 and 1 more",           w.prettyList([{file: "Doc1"}, {file: "Doc2"}], 1, {key: "file"}))

  describe "prettyNumber()", ->
    it "should format a number into a correctly formatted string", ->
     assert.equal("1,000",                       w.prettyNumber(1000))
     assert.equal("10.50",                       w.prettyNumber(10.5, 2))
     assert.equal("9 999,00",                    w.prettyNumber(9999, " ", 2, ","))

  describe "prettyPrice()", ->
    it "should format a number as a correctly formatted price", ->
     assert.equal("$4.00",                       w.prettyPrice(4))
     assert.equal("£4.00",                       w.prettyPrice(4, "£"))
     assert.equal("€4<sup>00</sup>",             w.prettyPrice(4, {currency: "€", wrap: "sup"}))

   describe "parseNumber()", ->
    it "should convert a string to it's numerical equivalent", ->
      assert.equal(1000,             w.parseNumber(1000))
      assert.equal(1000,             w.parseNumber("1,000.00"))
      assert.equal(0.99,             w.parseNumber("99%"))
      assert.equal(44000,            w.parseNumber("some 44,000 participants"))

  describe "hypenate()", ->
    it "should add invisible soft hyphens to a string every `n` characters", ->
      assert.equal("antidisest­ablishment­arianism", w.hyphenate("antidisestablishmentarianism"))
      assert.equal("antidisest%C2%ADablishment%C2%ADarianism", encodeURIComponent(w.hyphenate("antidisestablishmentarianism")))

  describe "quantify()", ->
    it "should add an \"s\" where appropriate to a number and a string", ->
      assert.equal("1 monkey",      w.quantify("monkey", 1))
      assert.equal("1 monkey",      w.quantify(1, "monkey"))
      assert.equal("monkey",        w.quantify("monkey", 1, numberless: true))
      assert.equal("nine monkeys",  w.quantify("monkey", 9, written: true))
      assert.equal("1 person",      w.quantify("person", 1, plural: "people"))
      assert.equal("9 people",      w.quantify("person", 9, plural: "people"))

  describe "writtenNumber()", ->
    it "should convert a number between 1 and 12 to it's written counterpart", ->
      assert.equal("one",           w.writtenNumber(1))

  describe "ordinals()", ->
    it "should convert a number from it's cardinal to ordinal equivalent", ->
      assert.equal("1st",             w.ordinal(1))
      assert.equal("second",          w.ordinal(2, {written: true}))
      assert.equal("3<sup>rd</sup>",  w.ordinal(3, {wrap: true}))
      assert.equal("4<em>th</em>",    w.ordinal(4, {wrap: "em"}))

  describe "quote()", ->
    it "should wrap a string in single, double quotes or guillemets (angle quotes).", ->
      assert.equal("‘pastry chef’",   w.quote("pastry chef", "s"))
      assert.equal("“cats cradle”",   w.quote("cats cradle"))
      assert.equal("«tres chic»",     w.quote("tres chic", "g"))
      assert.equal("¡Gol!",           w.quote("Gol", "!"))
      assert.equal("¿Cómo estás?",    w.quote("Cómo estás", "?"))

  describe "setLanguage()", ->
    it "should add a language to the dictionary", ->
      assert.equal "1", do ->
        w.setLanguage({cardinals: written: ["1"]}, "key")
        w.writtenNumber(1, "key")

  describe "aliases", ->
    it "should match the behaviour of their counterparts", ->
      assert.equal(w.dasherize,     w.hyphenCase)
      assert.equal(w.dashify,       w.hyphenCase)
      assert.equal(w.slugify,       w.snakeCase)
      assert.equal(w.underscore,    w.snakeCase)
      assert.equal(w.numerate,      w.quantify)
      assert.equal(w.count,         w.quantify)
      assert.equal(w.titleCase,     w.capitalizeAll)
