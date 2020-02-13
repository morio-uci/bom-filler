#!/usr/bin/env bash

set -e
# Determine docker-compose port mapping and set environment variables
node ./src/api/index.js

# Use nodemon to watch and reload our app codebase
./node_modules/.bin/nodemon --ignore src/www src/api/index.js
