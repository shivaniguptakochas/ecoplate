#!/bin/bash
# EcoPlate - One-click GitHub Publisher Script

set -e

REPO_DIR="/Users/hannukumargupta/.gemini/antigravity-ide/scratch/ecoplate"
cd "$REPO_DIR"

echo "=========================================="
echo "  EcoPlate - Publish to GitHub"
echo "=========================================="

if [ -z "$1" ]; then
  echo ""
  echo "Usage: ./publish_to_github.sh <YOUR_GITHUB_REPO_URL>"
  echo "Example:"
  echo "  ./publish_to_github.sh https://github.com/YOUR_USERNAME/ecoplate.git"
  echo ""
  read -p "Enter your GitHub repository URL: " GITHUB_URL
else
  GITHUB_URL="$1"
fi

if [ -z "$GITHUB_URL" ]; then
  echo "Error: No repository URL provided."
  exit 1
fi

echo "Setting remote origin to: $GITHUB_URL"
git remote remove origin 2>/dev/null || true
git remote add origin "$GITHUB_URL"
git branch -M main

echo "Pushing code to GitHub..."
git push -u origin main

echo ""
echo "=========================================="
echo "  SUCCESS! EcoPlate is now live on GitHub."
echo "=========================================="
