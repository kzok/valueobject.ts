#!/bin/bash -eu

cd $(dirname $0)/../

NAME=$(node -p "require('./package.json').name")
VERSION=$(node -p "require('./package.json').version")

echo "Target: ${NAME}@${VERSION}"
if [ -n "$(npm view $NAME@$VERSION)" ]; then
    echo "This version already exists in npm repository."
    exit 0
fi

echo "//registry.npmjs.org/:_authToken=$NPM_TOKEN" > ./.npmrc
./node_modules/.bin/release-it "${VERSION}" --ci

echo "========================="
echo " SUCCESSFULLY PUBLISHED!"
echo "========================="
exit 0
