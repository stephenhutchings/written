### written

#### Install Dependencies

```
$ npm install
```

#### Build
Create builds using [grunt](http://gruntjs.com/).

```
$ grunt
```

#### Test
Test builds using [mocha](http://mochajs.org) via [npm](https://npmjs.com).
Tests are defined in `test/test.coffee`.

```
$ npm test

# Shorthand for...
$ mocha --compilers coffee:coffee-script/register
```

#### Release

```
$ grunt release --ver=patch && grunt
$ git commit -a -m v?.?.? && git tag v?.?.?
$ git push && git push --tags && npm publish
```
