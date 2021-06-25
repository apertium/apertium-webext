# Testing the Extension

Tests are implemented using [Puppeteer](https://pptr.dev/) and [Mocha](https://mochajs.org/). To install these, simply run the following

```
npm init
npm install puppeteer mocha --dev
```

then run the tests with

```
cd tests/
mocha popup.test.js
mocha settings.test.js
```