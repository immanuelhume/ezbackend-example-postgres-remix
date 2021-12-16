.PHONY: env-api env-client

env-api:
	@npm i --prefix ./api
	-@docker-compose -f ./api/docker-compose.yml up -d
env-client:
	@npm i --prefix ./client

.PHONY: dev-api dev-client

dev-api: env-api
	@npm run --prefix ./api ezb
dev-client: env-client
	@npm run --prefix ./client dev