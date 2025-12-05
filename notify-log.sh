#! /bin/bash


fswatch /Users/habsa2war/bash | while read x; do echo "File changed: $x"; done