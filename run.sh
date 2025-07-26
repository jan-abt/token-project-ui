#!/bin/bash

########################################
#  * Starts Next.js application in development mode.
#  * Accessible via http://localhost:3000
#  * Forces .env.development, ignoring .env.local
########################################

# Exit script if any command fails
set -e

# set -x  # Uncomment for debugging: print commands

printf "\nStarting Next.js application ...\n"

# Try to get PID using port 3000 (don't fail if empty)
PID=$(lsof -ti tcp:3000 || true)
if [ -n "$PID" ]; then
  printf "\n🔓  Port 3000 is in use by PID $PID."
  printf "\n    (Find PID manually via lsof -wni tcp:3000)"
  printf "\n Killing it ..."
  if kill -9 "$PID"; then
    printf "\n 💀 Process $PID has been killed.\n"
  else
    printf "\n⚠️  Failed to kill PID $PID. Continuing anyway..."
  fi
fi

# Start Next.js app with NODE_ENV=development, unsetting local overrides
unset NEXT_PUBLIC_TOKEN_ADDRESS NEXT_PUBLIC_PROVIDER_URL NEXT_PUBLIC_CHAIN_ID

NODE_ENV=development npm run dev