#!/bin/sh
# Exit immediately if a command exits with a non-zero status.
set -e

# Check if wasm-pack is installed and executable
if ! command -v wasm-pack > /dev/null; then
  echo "Error: wasm-pack is not installed or not in PATH."
  echo "Please install wasm-pack: https://rustwasm.github.io/wasm-pack/installer/"
  exit 1
fi

# Build the wasm package
(cd markdown-parser && wasm-pack build --target web)

# Create lib directory if it doesn't exist
mkdir -p scripts/lib

# Copy the generated js file and wasm file to the lib directory
cp markdown-parser/pkg/markdown_parser.js scripts/lib/
cp markdown-parser/pkg/markdown_parser_bg.wasm scripts/lib/
