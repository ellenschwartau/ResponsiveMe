#!/bin/bash
# if node modules are not installed, install them
if[! -d "node_modules ]
then
    echo "Installing dependencies..."
    npm install
fi
# run test
echor "Starting test execution:"
echo ""
jamsine-node --verbose test/specs