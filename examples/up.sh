#!/usr/bin/env bash

echo "make link"
cd ..
yarn build
yarn link

cd -
yarn link cif-js
echo "make link -- done"

# install dependency
yarn

# start
yarn start
