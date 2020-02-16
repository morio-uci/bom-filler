#!/usr/bin/env bash

set -e

# Use nodemon to watch and reload our app codebase
./node_modules/.bin/nodemon --ignore src/www  --require esm src/api/index.js
