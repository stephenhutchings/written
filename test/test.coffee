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

  describe "hyphenCase()", ->
    it "should format a \"cased\" string into hyphen-case", ->
      assert.equal("some-thing",    w.hyphenCase("some-thing"))
      assert.equal("some-thing",    w.hyphenCase("some_thing"))
      assert.equal("some-thing",    w.hyphenCase("someThing"))
      assert.equal("some-thing",    w.hyphenCase("some Thing"))
      assert.equal("-some-thing",   w.hyphenCase("someThing", true))

  describe "snakeCase()", ->
    it "should format a \"cased\" string into snake-case", ->
      assert.equal("some_thing",    w.snakeCase("some-thing"))
      assert.equal("some_thing",    w.snakeCase("some_thing"))
      assert.equal("some_thing",    w.snakeCase("someThing"))
      assert.equal("some_thing",    w.snakeCase("some Thing"))

  describe "humanCase()", ->
    it "should format a \"cased\" string into human-case", ->
      assert.equal("some thing",   w.humanCase("some-thing"))
      assert.equal("some thing",   w.humanCase("some_thing"))
      assert.equal("some Thing",   w.humanCase("someThing"))
      assert.equal("some Thing",   w.humanCase("some Thing"))
      assert.equal("from A to Z",  w.humanCase("fromA_to-Z"))

  describe "wrapInTag()", ->
    it "should wrap a string inside an HTML tag", ->
      assert.equal("<span>Hello world!</span>",     w.wrapInTag("Hello world!"))
      assert.equal("<strong>Hello world!</strong>", w.wrapInTag("Hello world!", "strong"))

  describe "prettyList()", ->
    it "should format an array into a grammatically correct string", ->
      assert.equal("Ben and Bob",               w.prettyList(["Ben", "Bob"]))
      assert.equal("Ben, Bob and Bill",         w.prettyList(["Ben", "Bob", "Bill"]))
      assert.equal("Ben, Bob and 2 more",       w.prettyList(["Ben", "Bob", "Bill", "Max"], 2))
      assert.equal("Ben and 1 other",           w.prettyList(["Ben", "Bob"], 1, {more: "other"}))
      assert.equal("Ben and one more",          w.prettyList(["Ben", "Bob"], 1, {written: true}))
      assert.equal("Doc1 and two other files",  w.prettyList(["Doc1", "Doc2", "Doc3"], 1, {written: true, more: "other file", quantify: true}))
      assert.equal("Doc1 et 2 plus",            w.prettyList(["Doc1", "Doc2", "Doc3"], 1, {amp: "et", lang: "FR", more: "plus"}))
      assert.equal("Doc1 and 1 more",           w.prettyList([{file: "Doc1"}, {file: "Doc2"}], 1, {key: "file"}))

  describe "hypenate()", ->
    it "should add invisible soft hyphens to a string every `n` characters", ->
      assert.equal("antidisest­ablishment­arianism", w.hyphenate("antidisestablishmentarianism"))
      assert.equal("antidisest%C2%ADablishment%C2%ADarianism", encodeURIComponent(w.hyphenate("antidisestablishmentarianism")))

  describe "quantify()", ->
    it "should add an \"s\" where appropriate to a number and a string", ->
      assert.equal("1 monkey",     w.quantify("monkey", 1))
      assert.equal("1 monkey",     w.quantify(1, "monkey"))
      assert.equal("monkey",       w.quantify("monkey", 1, numberless: true))
      assert.equal("nine monkeys", w.quantify("monkey", 9, written: true))

  describe "writtenNumber()", ->
    it "should convert a number between 1 and 12 to it's written counterpart", ->
      assert.equal("one",          w.writtenNumber(1))
      assert.equal("zwei",         w.writtenNumber(2, "DE"))
      assert.equal("una",          w.writtenNumber(1, "ES", "f"))

  describe "setNumbers()", ->
    it "should set an array of numbers to the language dictionary", ->
      assert.equal "1", do ->
        w.setNumbers(["1"], "key")
        w.writtenNumber(1, "key")

  describe "setNonCaps()", ->
    it "should set a regular expression to the language dictionary", ->
      assert.equal "True false", do ->
        w.setNonCaps(/^false$/, "custom")
        w.capitalizeAll("true false",  "custom")
