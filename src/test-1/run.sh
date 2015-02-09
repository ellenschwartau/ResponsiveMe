#!/bin/bash
# if node modules are not installed, install them
#if[! -d "node_modules" ]
#then
#    echo "Installing dependencies..."
#    sudo npm install -g jasmine-node
#fi
# run test
echo "Starting test execution:"
echo ""
jasmine-node --verbose specs