#!/bin/bash

# Change to the 'docs' directory
cd docs

# Process all HTML files in the 'docs' directory
for file in *.html; do
  sed -i 's/\.html//g' "$file"
  sed -i '/index.js/!s/index//g' "$file"
  if [[ $file != "index.html" ]]; then
    # Remove the .html extension from the file name
    new_file="${file%.html}"

    # Rename the file without the .html extension
    mv "$file" "$new_file"

    
  fi
done

cd js
for file1 in *.js; do
  sed -i 's/\.html//g' "$file1"
  sed -i 's/index\>/index.html/g' "$file1"
done