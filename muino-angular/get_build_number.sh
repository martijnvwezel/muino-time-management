#!/bin/bash

PORCELAIN=`git status --porcelain`
SHORTSTAT=`git diff --shortstat`

GIT_DIRTY=`git describe --always --dirty`
VERSION_STR=$( date -u "+%Y-%m-%dT%H:%M:%SZ")+"$GIT_DIRTY"

echo "export class BuildNumber {public static readonly number = '$VERSION_STR'}" >  "$PWD/src/buildnumber.ts"
echo "Build number = '$VERSION_STR'"