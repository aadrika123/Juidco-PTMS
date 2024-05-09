#!/bin/bash

tsc --watch &

node ./build/server.js

tsc_paid=$!