### written

[![Build Status](https://travis-ci.org/stephenhutchings/written.svg)](https://travis-ci.org/stephenhutchings/written)

*written* provides a set of utilities for manipulating text, with a focus on
providing typographic tools rather than pure string manipulation. It can be
added as a set of mixins to Underscore or used in it's own right, both in
front and back end contexts.

- [Capitalization](#capitalization)
- [Clean Join](#clean-join)
- [Collapse](#collapse)
- [Cases](#cases)
- [Tags](#tags)
- [Lists](#lists)
- [Hyphenation](#hyphenation)
- [Quantify](#quantify)
- [Written Numbers](#written-numbers)
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

    ((root, factory) ->
      if typeof define is "function" and define.amd
        define [], factory
      else if typeof exports is "object"
        module.exports = factory()
      else
        root.written = factory()
      return
    ) this, ->

This helps to split "cased" words into their constituent parts...

      caseSplitter = /[-_\s]|(!?[A-Z][a-z]*)/g

Declare the `written` object...

      w =

Some style guides prefer numbers under 12 to be written, so we'll include
those in some common languages. If more or fewer numbers need to be added, or
another those from another language, see `setNumbers()`. For compatibility,
Swedish uses "m" for co_m_mon, and "n" for _n_euter genders.

        numbers:
          "EN": ["one", "two", "three", "four", "five", "six", "seven",
                 "eight", "nine", "ten", "eleven", "twelve"]

          "FR": [{m: "un", f: "une"}, "deux", "trois", "quatre", "cinq",
                 "six", "sept", "huit", "neuf", "dix", "onze", "douze"]

          "DE": ["eins", "zwei", "drei", "vier", "fünf", "sechs", "sieben",
                 "acht", "neun", "zehn", "elf", "zwölf"]

          "IT": [{m: "uno", f: "una"}, "due", "tre", "quattro", "cinque",
                 "sei", "sette", "otto", "nove", "dieci", "undici", "dodic"]

          "ES": [{m: "uno", f: "una"}, "dos", "tres", "cuatro", "cinco",
                 "seis", "siete", "ocho", "nueve", "diez", "once", "doce"]

          "SE": [{m: "ett", n: "en"}, "två", "tre", "fyra", "fem", "sex"
                 "sju", "åtta", "nio", "tio", "elva", "tolv"]

Following the APA style guide (for ease and practicality) conjunctions,
articles, and short prepositions of less than four letters are will be
left in lowercase when calling `capitalizeAll()`.

        noncaps:
          "EN": ///^(
            an|and|as|at|be|but|by|has|in|if|nor|of|
            off|on|or|out|per|the|to|up|was
          )$///

-------

#### Capitalization
Capitalize the first letter of a string.

```coffee
# Examples
w.capitalize("obviously")                       # Obviously
```

        capitalize: (str) ->
          str.charAt(0).toUpperCase() + str.slice(1)

Capitalize all words in a string apart from some common lower case words.
This can be tested with the internal noncaps regular expression, which are
stored by language code, or by passing a regular expression of your own.

```coffee
# Examples
w.capitalizeAll("this and that")                # This and That
w.capitalizeAll("the cat in the hat")           # The Cat in the Hat
```

        capitalizeAll: (str, regEx = w.noncaps["EN"]) ->
          unless toString.call(regEx) is "[object RegExp]"
            regEx = w.noncaps[regEx]

          (for s, i in str.split(/\s/g)
            if i > 0 and regEx.test(s) then s else w.capitalize(s)
          ).join(" ")

#### Clean Join
Join an array of words with falsy, non-string values removed with some glue.
It is used internally for casing and is offered in case of external value.

```coffee
# Examples
w.cleanJoin(["this", null, "that"], " and ")    # "this and that"
```

        cleanJoin: (arr, glue = "") ->
          (a for a in arr when a and typeof a is "string").join(glue)

#### Collapse
Replace all white-space in a string with a single space character

```coffee
# Examples
w.collapse("this   \t\t and \n    that")        # this and that
```

        collapse: (str) ->
          str.replace(/\s+/g, " ")

#### Cases
Transform strings between common code cases:

```coffee
# Examples
w.camelCase("some-thing")                       # someThing
w.hyphenCase("some_thing")                      # some-thing
w.snakeCase("someThing")                        # some_thing
w.humanCase("fromA_to-Z")                       # from A to Z
```

        camelCase: (str) ->
          str.replace(/[\s_-](\w)/g, (a, w) -> w.toUpperCase())

        hyphenCase: (str, leading) ->
          (if leading then "-" else "") +
          w.cleanJoin(str.split(caseSplitter), "-").toLowerCase()

        snakeCase: (str) ->
          w.cleanJoin(str.split(caseSplitter), "_").toLowerCase()

        humanCase: (str) ->
          w.cleanJoin(str.split(caseSplitter), " ")

#### Tags
Enclose a string inside an HTML tag.

```coffee
# Examples
w.wrapInTag("Hello world!")                     # <span>Hello world!</span>
w.wrapInTag("Hello world!", "em")               # <em>Hello world!</em>
```

        wrapInTag: (str, tag = "span") ->
          "<#{tag}>#{str}</#{tag}>"

#### Lists
Group strings into a grammatically correct list with an arbitrary limit.
The final example shows all the possible options available.

```coffee
# Examples
w.prettyList(["Ben", "Bob"])                    # Ben and Bob
w.prettyList(["Ben", "Bob", "Bill"])            # Ben, Bob and Bill
w.prettyList(["Ben", "Bob", "Bill", "Max"], 2)  # Ben, Bob and 2 more
w.prettyList(["Ben", "Bob"], 1, more: "other")  # Ben and 1 other

w.prettyList([                                  # Document 1 & two other files
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

        prettyList: (arr, max, opts = {}) ->
          more   = opts.more or "more"
          amp    = opts.amp or "and"

          if opts.key
            arr = (obj[opts.key] for obj in arr when typeof obj is "object")

          if opts.wrap
            arr = (w.wrapInTag(s, opts.wrap) for s in arr)

          if max < (len = arr.length)
            diff = len - max
            more = w.quantify(more, diff, numberless: true) if opts.quantify
            diff = w.writtenNumber(diff, opts.lang) if opts.written
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

```coffee
# Examples
w.hyphenate("antidisestablishmentarianism")     # antidisest%C2%ADablishmen...
```

        hyphenate: (str = "", n = 10, softHyphen = "\u00AD") ->
          str.replace new RegExp("\\w{#{n}}", "g"), (w) -> w + softHyphen

#### Quantify
Add an "s" to a string when an amount is non-singular, disregarding the
order of the arguments passsed.

```coffee
# Examples
w.quantify("monkey", 1)                         # 1 monkey
w.quantify(1, "monkey")                         # 1 monkey
w.quantify("monkey", 9, {written: true})        # nine monkeys
w.quantify("person", 9, {plural: "people"})     # 9 people
```

        quantify: (str, n, {numberless, written, lang, plural} = {}) ->
          { n, str } = str: n, n: str unless typeof str is "string"

          s = if n is 1 then "" else "s"
          n = w.writtenNumber(n, lang) if written
          n = if numberless then "" else "#{n} "

          n + (plural or str + s)

#### Written Numbers
Convert numbers between one and twelve into their written counter-parts.

```coffee
# Examples
w.writtenNumber(1)                              # "one"
w.writtenNumber(2, "DE")                        # "zwei"
```

        writtenNumber: (n, lang = "EN", gender = "m") ->
          if (n - 1) < @numbers[lang].length
            num = @numbers[lang][n - 1]
            num[gender] and num[gender] or num
          else
            n

#### Language Support
Set numbers and non-caps words for different languages as appropriate.

        setNumbers: (arr, lang) ->
          @numbers[lang] = arr

        setNonCaps: (regEx, lang) ->
          @noncaps[lang] = regEx

Set up some aliases...

      w.dasherize = w.dashify = w.hyphenCase
      w.slugify   = w.underscore = w.snakeCase
      w.numerate  = w.count = w.quantify
      w.titleCase = w.capitalizeAll

.. and return the `written` object.

      return w
