#!/usr/bin/env bash
# Cache-bust every local <script src> and stylesheet <link href> in index.html.
# Sets ?v=<unix time> (defaults to now, i.e. the commit you are about to make).
# Usage:  scripts/bump.sh            # then: git commit -am "..."
#         scripts/bump.sh 1792719687 # explicit version
set -euo pipefail
cd "$(dirname "$0")/.."
V="${1:-$(date +%s)}"
# local .js / .css refs only (skips http(s):// and //cdn URLs); replaces any existing ?v=
sed -E -i \
  -e "s#((src|href)=\")([^\":]+\.(js|css))(\?v=[0-9A-Za-z]+)?\"#\1\3?v=${V}\"#g" \
  index.html
echo "bumped to v=${V}:"
grep -nE '(src|href)="[^":]+\.(js|css)\?v=' index.html
