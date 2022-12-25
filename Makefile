# Scripts

# Clean and build the project
cbr:
	@echo "Cleaning and building..."
	@rm -rf ./dist
	@yarn format
	@yarn build
	@yarn start

# Run the project
run:
	@echo "Running..."
	@yarn start
	@echo Done!