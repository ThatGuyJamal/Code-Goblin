#!/bin/bash

# Function to get a list of all directories in the project
function get_dirs() {
    find . -type d ! -path "./.git*" -printf "%P\n"
}

# Function to get a list of changed files and directories
function get_changes() {
    git diff --name-only HEAD | sed -e 's|/[^/]*$||' | sort | uniq
}

# Function to print the current changes
function print_changes() {
    echo "Current git changes:"
    echo "dirs:"
    for dir in "${changed_dirs[@]}"
    do
        echo "------> $dir"
    done
    echo "files:"
    for file in "${changed_files[@]}"
    do
        echo "------> $file"
    done
}

# Function to prompt the user to select a subdirectory to commit
function select_directory() {
    local i=1
    for dir in "${changed_dirs[@]}"
    do
        echo "[$i] $dir"
        i=$((i+1))
    done
    read -p "Select a directory to commit (1-$i): " selection
    if [[ "$selection" =~ ^[0-9]+$ && "$selection" -le "$i" && "$selection" -gt 0 ]]
    then
        selected_dir="${changed_dirs[$((selection-1))]}"
    else
        echo "Invalid selection. Please enter a number between 1 and $i."
        select_directory
    fi
}

# Get the list of changed files and directories
changed_items=($(get_changes))

# Split the list into files and directories
changed_files=()
changed_dirs=()
for item in "${changed_items[@]}"
do
    if [[ -f "$item" ]]
    then
        changed_files+=("$item")
    elif [[ -d "$item" ]]
    then
        changed_dirs+=("$item")
    fi
done

# Print the current changes
print_changes

# Prompt the user to select a subdirectory to commit if necessary
if [[ ${#changed_dirs[@]} -gt 1 ]]
then
    select_directory
elif [[ ${#changed_dirs[@]} -eq 1 ]]
then
    selected_dir="${changed_dirs[0]}"
fi

# Check if the user wants to commit only the subdirectories
if [[ ${#changed_dirs[@]} -gt 0 && ${#changed_files[@]} -gt 0 ]]
then
    read -p "Do you want to commit only the subdirectories? (y/n): " commit_subdirs
    if [[ "$commit_subdirs" =~ ^[Yy]$ ]]
    then
        # Filter out the files not in the selected subdirectory
        changed_files=($(echo "${changed_files[@]}" | tr ' ' '\n' | grep "^$selected_dir/"))
    fi
fi

# Get the commit message from the user
read -p "Enter a commit message: " commit_message
if [[ -z "$commit_message" ]]
then
    commit_message="Updating Code!"
fi

# Add the changed files to the commit
if [[ ${#changed_files[@]} -gt 0 ]]
then
    git add "${changed_files[@]}"
fi

# Commit the changes
git commit -m "$commit_message"

# Push the changes
git push

echo "The changes have been pushed to GitHub!"
