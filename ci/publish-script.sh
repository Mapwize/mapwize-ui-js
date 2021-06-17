#!/usr/bin/env bash

RED="\033[0;31m"
BLUE="\033[0;34m"
NC="\033[0m"

npm publish dist

npm run docs
zip -r jsdoc.zip docs > /dev/null

release_notes=$(sed -n "/^## ${CI_COMMIT_REF_NAME}$/,/^## /p" CHANGELOG.md | grep -E "^(\*|-|\s+)" | sed ':a;N;$!ba;s/\n/\\n/g')

echo -e "${BLUE}  > Creating or retrieving the release linked to \"$CI_COMMIT_REF_NAME\"...${NC}"
response=$(http \
    --ignore-stdin \
    --check-status \
    GET \
    https://api.github.com/repos/Mapwize/mapwize-ui-js/releases/tags/$CI_COMMIT_REF_NAME \
    "Accept:application/vnd.github.v3+json" \
    "Authorization: token $GITHUB_TOKEN")
if [ $? -ne 0 ]; then
    response=$(http \
        --ignore-stdin \
        --check-status \
        POST \
        https://api.github.com/repos/Mapwize/mapwize-ui-js/releases \
        "Accept:application/vnd.github.v3+json" \
        "Authorization: token $GITHUB_TOKEN" \
        tag_name="$CI_COMMIT_REF_NAME" \
        body="$release_notes")
fi

# We need to delete the jsdoc.zip asset first if it exists, otherwise the upload will fail
upload_url=$(echo $response | jq -re '.upload_url')
upload_url=${upload_url%{?*}
asset_id=$(echo $response | jq -re '.assets | .[] | select(.name == "jsdoc.zip") | .id')
if [ $? -eq 0 ]; then
    http \
        --ignore-stdin \
        --check-status \
        DELETE \
        https://api.github.com/repos/Mapwize/mapwize-ui-js/releases/assets/$asset_id \
        "Accept:application/vnd.github.v3+json" \
        "Authorization: token $GITHUB_TOKEN" &>/dev/null
fi

echo -e "${BLUE}  > Uploading the release asset \"jsdoc.zip\" for \"$CI_COMMIT_REF_NAME\"...${NC}"
http \
    --ignore-stdin \
    --check-status \
    POST \
    "$upload_url?name=jsdoc.zip" \
    "Content-Type:application/zip" \
    "Authorization: token $GITHUB_TOKEN" \
    @jsdoc.zip &>/dev/null

exit $?
