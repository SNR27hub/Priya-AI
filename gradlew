#!/bin/sh
# Root wrapper forwarding to android/gradlew if present
if [ -f "./android/gradlew" ]; then
  cd android && ./gradlew "$@"
else
  which gradle >/dev/null 2>&1 && exec gradle "$@"
  echo "Gradle not found directly, falling back to Java runner..."
fi
