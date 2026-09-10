.DEFAULT_GOAL := help

## install: installe les dépendances
install:
	npm install

## dev: lance le serveur de développement (http://localhost:5173)
dev:
	npm run dev

## lint: vérifie le code
lint:
	npm run lint

## build: build de production dans dist/
build:
	npm run build

## preview: sert le build de dist/ en local (pour vérifier avant deploy)
preview: build
	npm run preview

## clean: supprime node_modules et dist
clean:
	rm -rf node_modules dist

## reset: clean + réinstallation propre
reset: clean install

## netlify-login: connecte netlify-cli à ton compte (une seule fois)
netlify-login:
	npx netlify-cli login

## netlify-init: relie ce dossier à un site Netlify existant ou en crée un
netlify-init:
	npx netlify-cli init

## deploy-preview: déploie un aperçu (URL temporaire, ne touche pas la prod)
deploy-preview: build
	npx netlify-cli deploy --dir=dist

## deploy: déploie en production sur Netlify
deploy: build
	npx netlify-cli deploy --dir=dist --prod

## help: liste les commandes disponibles
help:
	@grep -E '^## ' Makefile | sed 's/## /make /'

.PHONY: install dev lint build preview clean reset netlify-login netlify-init deploy-preview deploy help
