#!/usr/bin/env bash
set -eu
FILE=src/components/DeveloperCard.jsx
if grep -nE '^[[:space:]]*<div([[:space:]>]|/)' "$FILE"; then
  echo '[FAIL] A div element was found in DeveloperCard.jsx'
  exit 1
fi
if grep -n 'http://' "$FILE"; then
  echo '[FAIL] Insecure HTTP media origin found'
  exit 1
fi
echo '[PASS] 0 div elements found in DeveloperCard.jsx'
echo '[PASS] 0 insecure http:// references found in DeveloperCard.jsx'
echo '[MANUAL] Chrome 375px responsive inspection and Accessibility Tree still required'
echo '[MANUAL] Confirm two Ex1 commits in git log'
