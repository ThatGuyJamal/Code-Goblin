# Scripts

# Clean and build the project
cbr:
	@echo "Cleaning and building..."
	@rm -rf ./dist
	@yarn format
	@yarn build

# Make the config file in the src/config folder named config.ts
ccf:
	@echo "Creating config file..."
	@cp ./dist/config/example.config.ts ./dist/config/config.ts
	@echo Done!

# Run the project
run:
	@echo "Running..."
	@yarn start
	@echo Done!