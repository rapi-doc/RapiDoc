#!/bin/sh

set -e
BASE_URL=${BASE_URL:-/}
NGINX_ROOT=/usr/share/nginx/html
INDEX_FILE=$NGINX_ROOT/index.html


sed -i -e "s|%PAGE_TITLE%|$PAGE_TITLE|g" /usr/share/nginx/html/index.html
sed -i -e "s|%PAGE_FAVICON%|$PAGE_FAVICON|g" /usr/share/nginx/html/index.html
sed -i -e "s|%SPEC_URL%|$SPEC_URL|g" /usr/share/nginx/html/index.html
sed -i -e "s|%RAPIDOC_OPTIONS%|${RAPIDOC_OPTIONS}|g" /usr/share/nginx/html/index.html
sed -i -e "s|\(listen\s*\) [0-9]*|\1 ${PORT}|g" /etc/nginx/nginx.conf

exec nginx -g 'daemon off;'
