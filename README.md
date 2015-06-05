### written

[![Build Status](https://travis-ci.org/stephenhutchings/written.svg)](https://travis-ci.org/stephenhutchings/written)

*written* provides a set of utilities for manipulating text, with a focus on
providing typographic tools rather than pure string manipulation. It can be
added as a set of mixins to Underscore or used in it's own right, both in
front and back end contexts.

- [Capitalization](#capitalization)
- [Utilities](#utilities)
- [Collapse](#collapse)
- [Cases](#cases)
- [Tags](#tags)
- [Lists](#lists)
- [Hyphenation](#hyphenation)
- [Quantify](#quantify)
- [Written Numbers](#written-numbers)
- [Quotes](#quotes)
- [Ordinals](#ordinals)
- [Language Support](#language-support)

##### Node

```
npm install written
```

##### Bower

```
bower install written
```

This readme is also the source code for this module. Each function shows
examples and the implementation.

-------

#### Setup

*written* can be used as a module in Node and AMD contexts, and will otherwise
be made available as a global variable (`window.written`).

    ((root, factory) ->
      if typeof define is "function" and define.amd
        define [], factory
      else if typeof exports is "object"
        module.exports = factory()
      else
        root.written = factory()
      return
    ) this, ->


Some style guides prefer the numbers 12 and under to be written, so we'll
include those in here. If more or fewer numbers need to be added, or
those from another language, see [Language Support](#language-support).

Following the APA style guide (for ease and practicality) conjunctions,
articles, and short prepositions of less than four letters are will be
left in lowercase when calling `capitalizeAll()`.

A rule is needed to determine the correct ordinal for any number. For English,
we use match in such a way that the first value in the matching array is
returned, unless it is 11, 12 or 13. We use this number to determine the
correct ordinal form.


      dictionary =
        EN:
          noncaps: ///^(
                     an|and|as|at|be|but|by|has|in|if|nor|of|
                     off|on|or|out|per|the|to|up|was
                   )$///

          cardinals:
            written: ["one", "two", "three", "four",
                      "five", "six", "seven", "eight",
                      "nine", "ten", "eleven", "twelve"]

          ordinals:
            written: ["first", "second", "third", "fourth",
                      "fifth", "sixth", "seventh", "eighth",
                      "ninth", "tenth", "eleventh", "twelfth"]

            rule:    /((1{0,1}[123])|(\d))\b/

            suffixes:
              "1": "st"
              "2": "nd"
              "3": "rd"
              "n": "th"

-------

#### Capitalization
Capitalize the first letter of a string.

Examples:
```coffee
w.capitalize("obviously")                         # Obviously
```


      capitalize = (str) ->
        str.charAt(0).toUpperCase() + str.slice(1)


Capitalize all words in a string apart from some common lower case words.
This can be tested with the internal noncaps regular expression, which are
stored by language code, or by passing a regular expression of your own.

Examples:
```coffee
w.capitalizeAll("this and that")                  # This and That
w.capitalizeAll("the cat in the hat")             # The Cat in the Hat
```


      capitalizeAll = (str, regEx = dictionary["EN"].noncaps) ->
        unless toString.call(regEx) is "[object RegExp]"
          regEx = dictionary[regEx].noncaps

        (for s, i in str.split(/\s/g)
          if i > 0 and regEx.test(s) then s else capitalize(s)
        ).join(" ")


#### Utilities
`enclose` wraps a string within two other strings, repeating the first if needs
be. `cleanJoin` joins an array of words with falsy, non-string values removed with
some glue. Both are used internally but are offered in case of their
external value.

Examples:
```coffee
w.enclose("'", "string")                          # 'string'
w.cleanJoin(["this", null, "that"], " and ")      # this and that
```


      enclose = (a, b, c) ->
        "#{a}#{b}#{c or a}"

      cleanJoin = (arr, glue = "") ->
        (a for a in arr when a and typeof a is "string").join(glue)


#### Collapse
Replace all white-space in a string with a single space character

Examples:
```coffee
w.collapse("this   \t\t and \n    that")          # this and that
```


      collapse = (str) ->
        str.replace(/\s+/g, " ")


#### Cases
Transform strings between common code cases.

Examples:
```coffee
w.camelCase("some-thing")                         # someThing
w.hyphenCase("some_thing")                        # some-thing
w.snakeCase("someThing")                          # some_thing
w.humanCase("fromA_to-Z")                         # from A to Z
```

This helps to split "cased" words into their constituent parts...


      caseSplitter = /[-_\s]+|(!?[A-Z][a-z]*)/g

      camelCase = (str) ->
        cleanJoin(
          for s, i in str.split(caseSplitter) when s
            if i is 0 then s else capitalize(s)
        )

        str.replace(/[\s_-]+(\w)/g, (a, w) -> w.toUpperCase())

      hyphenCase = (str, leading) ->
        (if leading then "-" else "") +
        cleanJoin(str.split(caseSplitter), "-").toLowerCase()

      snakeCase = (str) ->
        cleanJoin(str.split(caseSplitter), "_").toLowerCase()

      humanCase = (str) ->
        cleanJoin(str.split(caseSplitter), " ")


#### Tags
Enclose a string inside an HTML tag.

Examples:
```coffee
w.wrapInTag("Hello world!")                       # <span>Hello world!</span>
w.wrapInTag("Hello world!", "em")                 # <em>Hello world!</em>
```


      wrapInTag = (str, tag = "span") ->
        enclose "<#{tag}>", str, "</#{tag}>"


#### Lists
Group strings into a grammatically correct list with an arbitrary limit.
The final example shows all the possible options available.

Examples:
```coffee
w.prettyList(["Ben", "Bob"])                      # Ben and Bob
w.prettyList(["Ben", "Bob", "Bill"])              # Ben, Bob and Bill
w.prettyList(["Ben", "Bob", "Bill", "Max"], 2)    # Ben, Bob and 2 more
w.prettyList(["Ben", "Bob"], 1, {more: "other"})  # Ben and 1 other
w.prettyList([                                    # Document 1 & two other files
  {file: "Document 1"},
  {file: "Document 2"},
  {file: "Document 3"}
], 1, {
  amp: "&"
  written: true,
  more: "other file",
  quantify: true,
  key: "file"
})
```


      prettyList = (arr, max, opts = {}) ->
        more   = opts.more or "more"
        amp    = opts.amp or "and"

        if opts.key
          arr = (obj[opts.key] for obj in arr when typeof obj is "object")

        if opts.wrap
          arr = (wrapInTag(s, opts.wrap) for s in arr)

        if max < (len = arr.length)
          diff = len - max
          more = quantify(more, diff, numberless: true) if opts.quantify
          diff = writtenNumber(diff, opts.lang) if opts.written
          arr  = arr.slice(0, max)
          arr  = arr.concat("#{diff} #{more}")

        arr
          .slice(0, -1)
          .join(", ")
          .concat((if arr.length is 1 then "" else " #{amp} "), arr.slice(-1))


#### Hyphenation
Add soft hyphens every `n` characters so that the CSS attribute
`hyphens: manual` will allow for nice breaks in long strings of text. This is
especially useful on mobile devices, where long strings can break the layout.

Examples:
```coffee
w.hyphenate("antidisestablishmentarianism")       # antidisest%C2%ADablishm...
```


      hyphenate = (str = "", n = 10, softHyphen = "\u00AD") ->
        str.replace new RegExp("\\w{#{n}}", "g"), (w) -> w + softHyphen


#### Quantify
Add an "s" to a string when an amount is non-singular, disregarding the
order of the arguments passsed.

Examples:
```coffee
w.quantify("monkey", 1)                           # 1 monkey
w.quantify(1, "monkey")                           # 1 monkey
w.quantify("monkey", 9, {written: true})          # nine monkeys
w.quantify("person", 9, {plural: "people"})       # 9 people
```


      quantify = (str, n, {numberless, written, lang, plural} = {}) ->
        [n, str] = [str, n] unless typeof str is "string"

        s = if n is 1 then str else (plural or "#{str}s")
        n = writtenNumber(n, lang) if written
        n = if numberless then "" else "#{n} "

        n + s


#### Written Numbers
Convert numbers between one and twelve into their written counter-parts.

Examples:
```coffee
w.writtenNumber(1)                                # one
w.writtenNumber(2, "DE")                          # zwei
```


      writtenNumber = (n, lang = "EN", gender = "m") ->
        if num = dictionary[lang]?.cardinals.written[n - 1]
          num[gender] and num[gender] or num
        else
          n


#### Quotes
Wrap a string in single or double quotes or guillemets (angle quotes).

Examples:
```coffee
w.quote("pastry chef", "s")                       # ‘pastry chef’
w.quote("cats cradle")                            # “cats cradle”
w.quote("Gol", "!")                               # ¡Gol!
w.quote("Cómo estás", "?")                        # ¿Cómo estás?
```


      quote = (str, type) ->
        switch type
          when "s", "single"
            enclose "‘", str, "’"
          when "a", "angle", "g", "guillemets"
            enclose "«", str, "»"
          when "!"
            enclose "¡", str, "!"
          when "?"
            enclose "¿", str, "?"
          else
            enclose "“", str, "”"


#### Ordinals
Convert a number from it's cardinal to ordinal equivalent.

Examples:
```coffee
w.ordinal(1)                                      # 1st
w.ordinal(2, {written: true})                     # second
w.ordinal(3, {wrap: true})                        # 3<sup>rd</sup>
w.ordinal(4, {wrap: "em"})                        # 4<em>th</em>
```


      ordinal = (n, opts = {}) ->
        { ordinals } = dictionary[opts.lang or "EN"]
        base  = n.toString().match(ordinals.rule)[0]

        if opts.written? and w = ordinals.written[+n - 1]
          n = w

        if opts.wrap and not w
          opts.wrap = "sup" if typeof opts.wrap is "boolean"
          suffixes = {}
          for key, val of ordinals.suffixes
            suffixes[key] = wrapInTag(val, opts.wrap)

        else
          suffixes = ordinals.suffixes

        w or (if suffixes[base]? then n + suffixes[base] else n + suffixes.n)


#### Marks
Provide quick access to different typographic marks without the need commit them
to memory or look at a reference table.

Examples:
```coffee
w.glyphs()                                        # Create a map of ASCII glyphs
w.glyph("!")                                      # &#33;
```


      fromTo = (x, y) ->
        Array.apply(0, length: y - x + 1).map((e, i) -> i + x)

      glyphs = (marks = {}) ->
        for code in fromTo(161, 255)
          .concat(fromTo(338, 402))
          .concat(fromTo(8211, 8230))
          .concat([8240, 8364, 8482])
            marks[code] = String.fromCharCode(code)

        return marks

      glyph = (c) ->
        enclose "&#", c.charCodeAt(0), ";"


#### Language Support
Set numbers and non-caps words for different languages as appropriate.


      setLanguage = (object, lang) ->
        dictionary[lang] = object


#### Aliases
Pack up the `written` object (with some aliases...)


      return written =
        camelCase: camelCase
        capitalize: capitalize
        capitalizeAll: capitalizeAll
        collapse: collapse
        count: quantify
        dasherize: hyphenCase
        dashify: hyphenCase
        humanCase: humanCase
        hyphenate: hyphenate
        hyphenCase: hyphenCase
        glyph: glyph
        glyphs: glyphs
        numerate: quantify
        ordinal: ordinal
        prettyList: prettyList
        quantify: quantify
        quote: quote
        setLanguage: setLanguage
        slugify: snakeCase
        snakeCase: snakeCase
        titleCase: capitalizeAll
        underscore: snakeCase
        wrapInTag: wrapInTag
        writtenNumber: writtenNumber
