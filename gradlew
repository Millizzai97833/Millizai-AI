#!/bin/sh
if [ -d "./android" ]; then
  cd android && ./gradlew "$@"
else
  echo "Android directory not found!"
  exit 1
fi
