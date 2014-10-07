#!/bin/bash

y=2
x=$1
r=$((x / y))

#for f in *; do cp "$f" "${f%.JPG}@2x.jpg"; done

#sips -Z $1 *@2x.jpg

sips -Z $1 *.JPG

for f in *; do mv "$f" "`echo $f | tr "[:upper:]" "[:lower:]"`"; done
