#!/usr/bin/env bash
# This script will zip up the contents of the dist directory
# and place it in the root of the project directory

function zip_extension() {
    local browser=$1
    (cd dist && zip -r ../extension-"$browser".zip .)
}

pnpm build-firefox
zip_extension "firefox"
pnpm build-chrome
zip_extension "chrome"

