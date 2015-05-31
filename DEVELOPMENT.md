### written

#### Install Dependencies

```
npm install
```

#### Build
Create builds using [grunt](http://gruntjs.com/).

```
$ grunt
```

#### Test
Test builds using [mocha](http://mochajs.org) via [npm](https://npmjs.com).
Tests are defined in `tests/test.coffee`.

```
npm test

# Shorthand for...
mocha --compilers coffee:coffee-script/register
```

#### Release
Release with [mversion](https://github.com/mikaelbr/mversion).
Remember that mversion will build, test, version, push and publish in one step.

```
npm install mversion -g

mversion major|minor|patch
```
