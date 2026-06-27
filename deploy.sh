#!/usr/bin/env bash
#
# Steps Budget — one-shot GitHub setup + deploy.
#
# BEFORE RUNNING:
#   1. Create an EMPTY repo on github.com named "steps-budget"
#      (no README, no .gitignore, no license).
#   2. Set GITHUB_USER below to your GitHub username.
#   3. Run this from inside the steps-budget folder:  bash deploy.sh
#
# It will: init git, push your code to `main`, then build and publish
# the live app to a `gh-pages` branch (GitHub Pages).

set -e  # stop on first error

# ---- EDIT THIS LINE ----
GITHUB_USER="OSKAYOTE"
# ------------------------

REPO="steps-budget"

if [ "$GITHUB_USER" = "YOUR_USERNAME_HERE" ]; then
  echo "❌ Open deploy.sh and set GITHUB_USER to your GitHub username first."
  exit 1
fi

echo "📦 Installing dependencies..."
npm install

echo "🔧 Initializing git..."
if [ ! -d .git ]; then
  git init
fi
git add .
git commit -m "Initial commit: Steps Budget" || echo "(nothing new to commit)"
git branch -M main

# Add the remote only if it isn't there yet.
if ! git remote | grep -q origin; then
  git remote add origin "https://github.com/${GITHUB_USER}/${REPO}.git"
else
  git remote set-url origin "https://github.com/${GITHUB_USER}/${REPO}.git"
fi

echo "⬆️  Pushing source to GitHub (main)..."
git push -u origin main

echo "🏗️  Building production bundle..."
npm run build

echo "🚀 Publishing live app to GitHub Pages (gh-pages branch)..."
npm run deploy

echo ""
echo "✅ Done!"
echo "   Repo:      https://github.com/${GITHUB_USER}/${REPO}"
echo "   Live app:  https://${GITHUB_USER}.github.io/${REPO}/"
echo ""
echo "ℹ️  One-time: in the repo, go to Settings → Pages and confirm the"
echo "   source is set to the 'gh-pages' branch. The live link works a"
echo "   minute or two after that."
