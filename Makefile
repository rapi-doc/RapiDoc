.DEFAULT_GOAL := build

.PHONY: github-pkg
github-pkg:
	@if cat ~/.npmrc | grep -q '^//npm\.pkg\.github\.com/:_authToken'; then \
		exit 0; \
	fi; \
	echo '==============================================================='; \
	echo 'Cannot download private packages from the Github package'; \
	echo 'repository. Please go to https://github.com/settings/tokens and'; \
	echo 'generate a personal access token with permissions to read'; \
	echo 'packages. After you generate the token, please type or paste it'; \
	read -a GH_TOKEN -e -p 'here: '; \
	touch ~/.npmrc \
	&& npm config set '//npm.pkg.github.com/:_authToken' "$$GH_TOKEN"

node_modules:
	npm ci

.PHONY: build
build: node_modules
	npm run build

.PHONY: lint
lint: node_modules
	npm run lint

.PHONY: ci
ci: node_modules lint build
