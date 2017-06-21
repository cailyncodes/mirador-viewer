# mirador-viewer

[![Build Status](https://travis-ci.org/colehansen/mirador-viewer.svg)](https://travis-ci.org/colehansen/mirador-viewer)

A Polymer custom element component to encapsulate a Mirador viewer instance.

## Installing

For the current version run:

    bower install --save mirador-viewer

However, we recommend you fix your version to the minor version:

    bower install --save mirador-viewer#^X.Y.Z

## Usage
	<html>
      <head>
      <script src="../bower_components/webcomponentsjs/webcomponents-lite.js"></script>
      <link rel="import" href="[realtive path]/bower_components/build/es2015/mirador-viewer.html">
      </head>
      <body>
      ...
      	<mirador-viewer url="http://example.com/path/to/manifest.json" width="500px" height="600px"></mirador-viewer>
      ...
      </body>
    </html>

## Contributing

Clone the repo into your file system.

    git clone https://github.com/colehansen/mirador-viewer.git

Make sure that you have yarn installed and then run:

    yarn install

### How to build (for dev)

    yarn run build:dev

### How to test

You will need a SauceLab account, which is free for OpenSource projects. Once you have
a username and access key, run the following:

    export SAUCE_USERNAME=[Your username]
    export SAUCE_ACCESS_KEY=[Your access key]

You will need to build it for tests:

    yarn run build:test

Now you can run the actual test

    yarn run test

This will start up a SauceLab test suite and display the results to the command line.

### Submit a pull request

Once you have made your changes, submit a pull request!
