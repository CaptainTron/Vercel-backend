#!/bin/bash
export GIT_REPO_URL="$GIT_REPO_URL"

# Cline the Repo
git clone "$GIT_REPO_URL" /home/app/output


# Call the script.js
exec node script.js

