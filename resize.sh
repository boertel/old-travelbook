#!/bin/bash

sips -Z $1 *.JPG

for f in *; do mv "$f" "`echo $f | tr "[:upper:]" "[:lower:]"`"; done
