#!/bin/bash

# A simple bash script for committing files to GitHub without a GUI
# Git auth is set up to make this easy.

# Set default commit message
DEFAULT_MSG="Updating Code!"

# Get the list of changed directories and files
CHANGED_ITEMS=$(git status --porcelain | awk '{print $2}' | uniq)
NUM_CHANGED_ITEMS=$(echo "$CHANGED_ITEMS" | wc -l)

if [ $NUM_CHANGED_ITEMS -eq 0 ]; then
  echo "No changes found in the repository."
  exit 1
elif [ $NUM_CHANGED_ITEMS -eq 1 ]; then
  SUB_DIR=$(echo "$CHANGED_ITEMS" | xargs dirname | uniq)
else
  echo "The following directories/files have changes:"
  CHANGED_DIRS=$(echo "$CHANGED_ITEMS" | xargs -I{} dirname {} | uniq)
  for DIR in $CHANGED_DIRS; do
    echo "$DIR"
    echo "-------> $(echo "$CHANGED_ITEMS" | grep "^$DIR" | awk '{print "    " $NF}')"
  done
  read -p "Do you want to proceed with the commit? [y/n]: " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Nn]$ ]]; then
    read -p "Enter the name of the directory you wish to commit: " SUB_DIR
    if [ ! -d "$SUB_DIR" ]; then
      echo "Invalid directory: $SUB_DIR"
      exit 1
    fi
  fi
fi

if [[ -z $SUB_DIR ]]; then
  # Set the commit message
  echo "Enter your commit message (Default: ${DEFAULT_MSG}):"
  read GIT_MESSAGE
  if [[ -z $GIT_MESSAGE ]]; then
    GIT_MESSAGE=${DEFAULT_MSG}
  fi

  # Add all changed files
  git add .

  # Commit changes
  git commit -m "${GIT_MESSAGE}"

  # Push changes to GitHub
  git push

  echo "The changes have been pushed to GitHub!"
else
  if [ ! -d "$SUB_DIR" ]; then
    echo "Invalid directory: $SUB_DIR"
    exit 1
  fi

  # Set the commit message
  echo "Enter your commit message (Default: ${DEFAULT_MSG}):"
  read GIT_MESSAGE
  if [[ -z $GIT_MESSAGE ]]; then
    GIT_MESSAGE=${DEFAULT_MSG}
  fi

  # Add all changed files in the specified subdirectory
  cd $SUB_DIR
  git add .

  # Commit changes
  git commit -m "${GIT_MESSAGE}"

  # Push changes to GitHub
  git push

  echo "The changes in directory ${SUB_DIR} have been pushed to GitHub!"
fi
